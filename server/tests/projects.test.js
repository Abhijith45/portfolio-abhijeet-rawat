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

    it('should fetch public featured projects with cache headers and only include visible projects', async () => {
        // Add a hidden featured project
        await Project.create({
            title: 'Hidden Featured Project',
            description: 'Hidden from public',
            techStack: ['Rust'],
            isFeatured: true,
            isVisible: false,
        });

        const res = await request(app).get('/api/projects/featured');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].title).toBe('Featured Project 1');
        expect(res.headers['x-cache-version']).toBeDefined();
    });

    it('should fetch only visible projects for public listing and exclude isVisible=false projects', async () => {
        // Add a hidden project
        await Project.create({
            title: 'Internal Secret Project',
            description: 'Not for public eyes',
            techStack: ['Go'],
            isVisible: false,
        });

        // Public request
        const publicRes = await request(app).get('/api/projects');
        expect(publicRes.status).toBe(200);
        expect(publicRes.body.success).toBe(true);
        expect(publicRes.body.count).toBe(2);
        const titles = publicRes.body.data.map((p) => p.title);
        expect(titles).not.toContain('Internal Secret Project');

        // Admin request with all=true
        const adminRes = await request(app).get('/api/projects?all=true');
        expect(adminRes.status).toBe(200);
        expect(adminRes.body.count).toBe(3);
        const allTitles = adminRes.body.data.map((p) => p.title);
        expect(allTitles).toContain('Internal Secret Project');
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

    it('should auto-shift orders when creating, updating, and deleting projects', async () => {
        // Clear projects and create 3 sequential projects
        await Project.deleteMany({});
        const p1 = await Project.create({ title: 'Alpha', description: 'desc', order: 1 });
        const p2 = await Project.create({ title: 'Beta', description: 'desc', order: 2 });
        const p3 = await Project.create({ title: 'Gamma', description: 'desc', order: 3 });

        // 1. Insert new project at order 2 -> Beta & Gamma should shift to 3 & 4
        const createRes = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: 'Inserted Delta', description: 'desc', order: 2 });
        expect(createRes.status).toBe(201);
        expect(createRes.body.data.order).toBe(2);

        const afterInsertBeta = await Project.findById(p2._id);
        const afterInsertGamma = await Project.findById(p3._id);
        expect(afterInsertBeta.order).toBe(3);
        expect(afterInsertGamma.order).toBe(4);

        // 2. Move Alpha from order 1 to order 3
        const updateRes = await request(app)
            .put(`/api/projects/${p1._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ order: 3 });
        expect(updateRes.status).toBe(200);
        expect(updateRes.body.data.order).toBe(3);

        // Items that were 2 and 3 should shift down to 1 and 2
        const delta = await Project.findById(createRes.body.data._id);
        const beta = await Project.findById(p2._id);
        expect(delta.order).toBe(1);
        expect(beta.order).toBe(2);

        // 3. Delete Alpha (currently at 3) -> Gamma (at 4) should shift to 3
        const deleteRes = await request(app)
            .delete(`/api/projects/${p1._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(deleteRes.status).toBe(200);

        const gammaAfterDelete = await Project.findById(p3._id);
        expect(gammaAfterDelete.order).toBe(3);

        // 4. Verify public fetch order
        const listRes = await request(app).get('/api/projects');
        expect(listRes.body.data.map(p => p.title)).toEqual(['Inserted Delta', 'Beta', 'Gamma']);
    });
});

