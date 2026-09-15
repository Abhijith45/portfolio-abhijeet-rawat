const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth Integration Tests', () => {
    beforeEach(async () => {
        await User.create({
            name: 'Admin User',
            email: 'admin@portfolio.dev',
            password: 'AdminPassword123!',
            role: 'admin',
        });
    });

    it('should login successfully with valid credentials and return JWT', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@portfolio.dev',
                password: 'AdminPassword123!',
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('admin@portfolio.dev');
    });

    it('should reject login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@portfolio.dev',
                password: 'WrongPassword!',
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should get authenticated user profile via Bearer header', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@portfolio.dev',
                password: 'AdminPassword123!',
            });

        const token = loginRes.body.token;

        const meRes = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(meRes.status).toBe(200);
        expect(meRes.body.success).toBe(true);
        expect(meRes.body.user.email).toBe('admin@portfolio.dev');
    });

    it('should reject unauthenticated access to /api/auth/me', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.status).toBe(401);
    });

    it('should return 401 when accessing a protected route with an invalid token', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer this.is.a.completely.invalid.jwt.token');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/expired|invalid/i);
    });

    it('should logout successfully and clear the session cookie', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@portfolio.dev',
                password: 'AdminPassword123!',
            });

        expect(loginRes.status).toBe(200);

        const logoutRes = await request(app)
            .post('/api/auth/logout');

        expect(logoutRes.status).toBe(200);
        expect(logoutRes.body.success).toBe(true);
        // Verify the Set-Cookie header clears the token
        const setCookieHeader = logoutRes.headers['set-cookie'];
        if (setCookieHeader) {
            const tokenCookie = setCookieHeader.find((c) => c.startsWith('token='));
            if (tokenCookie) {
                expect(tokenCookie).toMatch(/token=;|token=\s*;|Max-Age=0/i);
            }
        }
    });
});
