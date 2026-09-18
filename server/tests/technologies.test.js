const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Technology = require('../models/Technology');

describe('Technologies Integration Tests', () => {
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

        await Technology.create({
            name: 'React 19',
            category: 'Frontend & UI',
            proficiency: 'Advanced',
            order: 1,
        });
    });

    it('should fetch all technologies publicly', async () => {
        const res = await request(app).get('/api/technologies');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].name).toBe('React 19');
    });

    it('should create a new technology when authenticated as admin', async () => {
        const res = await request(app)
            .post('/api/technologies')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Redis',
                category: 'Database & Cache',
                proficiency: 'Proficient',
                order: 2,
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Redis');
    });

    it('should reject technology creation without auth', async () => {
        const res = await request(app)
            .post('/api/technologies')
            .send({
                name: 'Unauthorized Tech',
            });

        expect(res.status).toBe(401);
    });

    it('should update an existing technology', async () => {
        const tech = await Technology.findOne({ name: 'React 19' });
        const res = await request(app)
            .put(`/api/technologies/${tech._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ proficiency: 'Master' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.proficiency).toBe('Master');
    });

    it('should delete an existing technology and return 200', async () => {
        const tech = await Technology.findOne({ name: 'React 19' });
        const res = await request(app)
            .delete(`/api/technologies/${tech._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should return 404 when deleting non-existent technology', async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        const res = await request(app)
            .delete(`/api/technologies/${fakeId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should auto-shift orders scoped to category when creating and updating technologies', async () => {
        await Technology.deleteMany({});
        const t1 = await Technology.create({ name: 'Vue', category: 'Frontend & UI', order: 1 });
        const t2 = await Technology.create({ name: 'Angular', category: 'Frontend & UI', order: 2 });
        const db1 = await Technology.create({ name: 'Postgres', category: 'Database & Cache', order: 1 });

        // Insert at order 1 in 'Frontend & UI' -> only Vue & Angular shift; Postgres unaffected
        const res = await request(app)
            .post('/api/technologies')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'React', category: 'Frontend & UI', order: 1 });

        expect(res.status).toBe(201);
        expect(res.body.data.order).toBe(1);

        const afterVue = await Technology.findById(t1._id);
        const afterAngular = await Technology.findById(t2._id);
        const afterPostgres = await Technology.findById(db1._id);

        expect(afterVue.order).toBe(2);
        expect(afterAngular.order).toBe(3);
        expect(afterPostgres.order).toBe(1); // Unaffected
    });
});
