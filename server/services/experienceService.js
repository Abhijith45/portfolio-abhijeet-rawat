const experienceRepository = require('../repositories/experienceRepository');
const serverCache = require('../utils/cacheManager');

const defaultExperiences = [
    {
        company: 'Tiger Education Services (Edhike)',
        role: 'JavaScript Developer',
        period: 'Feb 2025 – July 2026',
        active: false,
        location: 'Lucknow, India',
        responsibilities: [
            'Worked on internal applications, lead-generation websites, integrations and data workflows used across the business.',
            'Built and maintained features for lead collection, processing and distribution across client systems.',
            'Developed tools that connected internal workflows with client APIs, Google Sheets and other external services.',
            'Worked on web applications and internal CRM workflows for managing and distributing leads.',
            'Built automation around incoming leads, including routing logic and scheduled distribution requirements.',
            'Worked with Cloudflare, Firebase, Google Apps Script, logging systems and API integrations across multiple projects.',
        ],
        skills: ['JavaScript', 'React.js', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'WebSockets'],
        order: 1,
    },
    {
        company: 'Tiger Education Services (Edhike)',
        role: 'Web Developer Intern',
        period: 'Nov 2024 – Jan 2025',
        active: false,
        location: 'Lucknow, India',
        responsibilities: [
            'Built responsive web pages and reusable UI components.',
            'Worked with the design team to translate Figma designs into functional interfaces.',
            'Implemented frontend functionality using JavaScript, HTML, CSS and Tailwind CSS.',
            'Supported website updates, debugging and integration work across company projects.',
        ],
        skills: ['HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript', 'Git', 'Responsive Design'],
        order: 2,
    },
];

class ExperienceService {
    async getAll() {
        const cacheKey = 'experiences:all';
        const cached = serverCache.get(cacheKey);
        if (cached) {
            return { data: cached, fromCache: true };
        }

        let experiences = await experienceRepository.find({}, { sort: { order: 1, createdAt: -1 } });
        if (!experiences || experiences.length === 0) {
            await experienceRepository.insertMany(defaultExperiences);
            experiences = await experienceRepository.find({}, { sort: { order: 1, createdAt: -1 } });
        }

        const payload = { success: true, count: experiences.length, data: experiences };
        serverCache.set(cacheKey, payload);
        return { data: payload, fromCache: false };
    }

    async createExperience(body) {
        const { company, role, period, active, location, responsibilities, skills, order } = body;
        const experience = await experienceRepository.create({
            company,
            role,
            period,
            active: Boolean(active),
            location: location || '',
            responsibilities: Array.isArray(responsibilities)
                ? responsibilities
                : (responsibilities || '').split('\n').map((r) => r.trim()).filter(Boolean),
            skills: Array.isArray(skills)
                ? skills
                : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
            order: Number(order) || 0,
        });

        serverCache.clearPattern('experiences');
        const newVersion = serverCache.incrementCacheVersion();

        return { experience, cacheVersion: newVersion };
    }

    async updateExperience(id, body) {
        const { company, role, period, active, location, responsibilities, skills, order } = body;
        const updateData = {};
        if (company !== undefined) updateData.company = company;
        if (role !== undefined) updateData.role = role;
        if (period !== undefined) updateData.period = period;
        if (active !== undefined) updateData.active = active;
        if (location !== undefined) updateData.location = location;
        if (responsibilities !== undefined) {
            updateData.responsibilities = Array.isArray(responsibilities)
                ? responsibilities
                : responsibilities.split('\n').map((r) => r.trim()).filter(Boolean);
        }
        if (skills !== undefined) {
            updateData.skills = Array.isArray(skills)
                ? skills
                : skills.split(',').map((s) => s.trim()).filter(Boolean);
        }
        if (order !== undefined) updateData.order = Number(order);

        const experience = await experienceRepository.updateById(id, updateData);
        if (!experience) {
            throw new Error('Experience not found');
        }

        serverCache.clearPattern('experiences');
        const newVersion = serverCache.incrementCacheVersion();

        return { experience, cacheVersion: newVersion };
    }

    async deleteExperience(id) {
        const experience = await experienceRepository.deleteById(id);
        if (!experience) {
            throw new Error('Experience not found');
        }

        serverCache.clearPattern('experiences');
        const newVersion = serverCache.incrementCacheVersion();

        return { success: true, cacheVersion: newVersion };
    }
}

module.exports = new ExperienceService();
