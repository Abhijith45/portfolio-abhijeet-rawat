const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Query = require('../models/Query');
const emailUtil = require('../utils/email');

vi.spyOn(emailUtil, 'sendInquiryNotification').mockImplementation(() => Promise.resolve({ success: true }));

describe('Queries Integration Tests', () => {
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
    });

    it('should submit a contact query successfully', async () => {
        const res = await request(app)
            .post('/api/queries')
            .send({
                name: 'Recruiter Jane',
                email: 'jane.recruiter@techfirm.com',
                message: 'Hello Abhijeet, we loved your portfolio and want to discuss a full-stack role.',
                subject: 'Job Opportunity',
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Recruiter Jane');
    });

    it('should reject contact query with invalid email', async () => {
        const res = await request(app)
            .post('/api/queries')
            .send({
                name: 'Jane',
                email: 'invalid-email-string',
                message: 'Hello Abhijeet, this is a short test message.',
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should allow admin to fetch all contact queries', async () => {
        await Query.create({
            name: 'Test Sender',
            email: 'sender@example.com',
            message: 'Testing message delivery to admin inbox.',
        });

        const res = await request(app)
            .get('/api/queries')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(1);
    });
});
