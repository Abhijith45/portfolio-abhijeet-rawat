const technologyRepository = require('../repositories/technologyRepository');
const serverCache = require('../utils/cacheManager');

class TechnologyService {
    async getAll() {
        const cacheKey = 'technologies:all';
        const cached = serverCache.get(cacheKey);
        if (cached) {
            return { data: cached, fromCache: true };
        }

        const technologies = await technologyRepository.find({}, { sort: { category: 1, order: 1, name: 1 } });
        const payload = { success: true, count: technologies.length, data: technologies };

        serverCache.set(cacheKey, payload);
        return { data: payload, fromCache: false };
    }

    async createTechnology(body) {
        const { name, category, icon, proficiency, order } = body;
        const tech = await technologyRepository.create({
            name,
            category,
            icon: icon || '',
            proficiency: proficiency || 'Proficient',
            order: Number(order) || 0,
        });

        serverCache.clearPattern('technologies');
        const newVersion = serverCache.incrementCacheVersion();

        return { tech, cacheVersion: newVersion };
    }

    async updateTechnology(id, body) {
        const tech = await technologyRepository.updateById(id, body);
        if (!tech) {
            throw new Error('Technology not found');
        }

        serverCache.clearPattern('technologies');
        const newVersion = serverCache.incrementCacheVersion();

        return { tech, cacheVersion: newVersion };
    }

    async deleteTechnology(id) {
        const tech = await technologyRepository.deleteById(id);
        if (!tech) {
            throw new Error('Technology not found');
        }

        serverCache.clearPattern('technologies');
        const newVersion = serverCache.incrementCacheVersion();

        return { success: true, cacheVersion: newVersion };
    }
}

module.exports = new TechnologyService();
