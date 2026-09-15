const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Review = require('../models/Review');

describe('Reviews Integration Tests', () => {
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

        await Review.create([
            {
                name: 'Alice Johnson',
                designation: 'Tech Lead',
                message: 'Abhijeet is an outstanding engineer with deep architectural knowledge.',
                rating: 5,
                approved: true,
            },
            {
                name: 'Bob Smith',
                designation: 'Senior Developer',
                message: 'Great pair programmer and problem solver.',
                rating: 5,
                approved: false,
            },
        ]);
    });

    it('should only return approved reviews on public GET /api/reviews', async () => {
        const res = await request(app).get('/api/reviews');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].name).toBe('Alice Johnson');
    });

    it('should allow public submission of reviews into pending state', async () => {
        const res = await request(app)
            .post('/api/reviews')
            .send({
                name: 'Carol Danvers',
                email: 'carol@marvel.com',
                designation: 'Staff Architect',
                message: 'Exceptional full stack and system design capabilities.',
                rating: 5,
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Carol Danvers');
    });

    it('should allow admin to view all reviews including unapproved ones', async () => {
        const res = await request(app)
            .get('/api/reviews/all')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(2);
    });
});
