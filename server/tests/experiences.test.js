const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Experience = require('../models/Experience');

describe('Experiences Integration Tests', () => {
    let adminToken;

    beforeEach(async () => {
        await User.create({
            name: 'Admin Tester',
            email: 'admin@portfolio.dev',
            password: 'AdminPassword123!',
            role: 'admin',
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@portfolio.dev', password: 'AdminPassword123!' });

        adminToken = loginRes.body.token;

        await Experience.create({
            company: 'Cyberdyne Systems',
            role: 'Senior Systems Architect',
            period: '2024 - Present',
            location: 'Noida, India',
            responsibilities: ['Engineered scalable microservices', 'Managed CI/CD pipelines'],
            skills: ['React', 'Node.js', 'Docker'],
            active: true,
        });
    });

    it('should fetch all experiences publicly', async () => {
        const res = await request(app).get('/api/experiences');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].company).toBe('Cyberdyne Systems');
    });

    it('should create a new experience when authenticated as admin', async () => {
        const res = await request(app)
            .post('/api/experiences')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                company: 'Weyland-Yutani',
                role: 'Full Stack Engineer',
                period: '2023 - 2024',
                skills: ['TypeScript', 'Express', 'MongoDB'],
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.company).toBe('Weyland-Yutani');
    });

    it('should reject experience creation without auth', async () => {
        const res = await request(app)
            .post('/api/experiences')
            .send({
                company: 'Unauthorized Org',
                role: 'Hacker',
                period: '2024',
            });

        expect(res.status).toBe(401);
    });

    it('should update an existing experience', async () => {
        const exp = await Experience.findOne({ company: 'Cyberdyne Systems' });
        const res = await request(app)
            .put(`/api/experiences/${exp._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ role: 'Principal Architect' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.role).toBe('Principal Architect');
    });

    it('should delete an existing experience and return 200', async () => {
        const exp = await Experience.findOne({ company: 'Cyberdyne Systems' });
        const res = await request(app)
            .delete(`/api/experiences/${exp._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should return 404 when deleting non-existent experience', async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        const res = await request(app)
            .delete(`/api/experiences/${fakeId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});
