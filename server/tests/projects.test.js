const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');

describe('Projects Integration Tests', () => {
    let adminToken;

    beforeEach(async () => {
        const user = await User.create({
            name: 'Admin Tester',
            email: 'admin@portfolio.dev',
            password: 'AdminPassword123!',
            role: 'admin',
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@portfolio.dev', password: 'AdminPassword123!' });

        adminToken = loginRes.body.token;

        await Project.create([
            {
                title: 'Featured Project 1',
                description: 'Full stack enterprise platform',
                techStack: ['React', 'Node.js', 'MongoDB'],
                isFeatured: true,
            },
            {
                title: 'Standard Project 2',
                description: 'Internal dashboard',
                techStack: ['TypeScript', 'Express'],
                isFeatured: false,
            },
        ]);
    });

    it('should fetch public featured projects with cache headers', async () => {
        const res = await request(app).get('/api/projects/featured');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
        expect(res.headers['x-cache-version']).toBeDefined();
    });

    it('should fetch all projects for public listing', async () => {
        const res = await request(app).get('/api/projects');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(2);
    });

    it('should create a project when authenticated as admin', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'New AI Portfolio Engine',
                description: 'State of the art portfolio with HUD',
                techStack: ['React', 'Vite', 'MUI'],
                isFeatured: true,
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('New AI Portfolio Engine');
    });

    it('should reject project creation without auth', async () => {
        const res = await request(app)
            .post('/api/projects')
            .send({
                title: 'Unauthorized Project',
                description: 'Should fail',
            });

        expect(res.status).toBe(401);
    });

    it('should update an existing project when authenticated as admin', async () => {
        const existing = await Project.findOne({ title: 'Featured Project 1' });
        const res = await request(app)
            .put(`/api/projects/${existing._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: 'Updated Featured Project' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Updated Featured Project');
    });

    it('should delete an existing project and return 200', async () => {
        const existing = await Project.findOne({ title: 'Standard Project 2' });
        const res = await request(app)
            .delete(`/api/projects/${existing._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should return 404 when attempting to delete non-existent project', async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        const res = await request(app)
            .delete(`/api/projects/${fakeId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should block SSRF loopback probes on /api/projects/verify-url', async () => {
        const res = await request(app)
            .post('/api/projects/verify-url')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ url: 'http://127.0.0.1:5000' });

        expect(res.status).toBe(200);
        expect(res.body.accessible).toBe(false);
        expect(res.body.message).toContain('prohibited');
    });

    it('should block SSRF cloud metadata probes on /api/projects/verify-url', async () => {
        const res = await request(app)
            .post('/api/projects/verify-url')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ url: 'http://169.254.169.254/latest/meta-data/' });

        expect(res.status).toBe(200);
        expect(res.body.accessible).toBe(false);
        expect(res.body.message).toContain('prohibited');
    });
});
