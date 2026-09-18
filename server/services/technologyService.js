const technologyRepository = require('../repositories/technologyRepository');
const serverCache = require('../utils/cacheManager');

class TechnologyService {
    async getAll() {
        const cacheKey = 'technologies:all';
        const cached = serverCache.get(cacheKey);
        if (cached) {
            return { data: cached, fromCache: true };
        }

        const technologies = await technologyRepository.find({}, { sort: { category: 1, order: 1, createdAt: -1 } });
        const payload = { success: true, count: technologies.length, data: technologies };

        serverCache.set(cacheKey, payload);
        return { data: payload, fromCache: false };
    }

    async createTechnology(body) {
        const { name, category = 'Frontend & UI', icon, proficiency, order } = body;

        let targetOrder;
        if (order !== undefined && order !== null && order !== '' && Number(order) > 0) {
            targetOrder = Math.max(1, parseInt(order, 10) || 1);
            await technologyRepository.updateMany(
                { category, order: { $gte: targetOrder } },
                { $inc: { order: 1 } }
            );
        } else {
            const maxItem = await technologyRepository.findOne({ category }, { sort: { order: -1 } });
            targetOrder = (maxItem && typeof maxItem.order === 'number' && maxItem.order >= 1) ? maxItem.order + 1 : 1;
        }

        const tech = await technologyRepository.create({
            name,
            category,
            icon: icon || '',
            proficiency: proficiency || 'Proficient',
            order: targetOrder,
        });

        serverCache.clearPattern('technologies');
        const newVersion = serverCache.incrementCacheVersion();

        return { tech, cacheVersion: newVersion };
    }

    async updateTechnology(id, body) {
        const existing = await technologyRepository.findById(id);
        if (!existing) {
            throw new Error('Technology not found');
        }

        const targetCategory = body.category !== undefined ? body.category : existing.category;
        const categoryChanged = targetCategory !== existing.category;
        const oldOrder = existing.order || 1;

        if (body.order !== undefined && body.order !== null && body.order !== '') {
            const newOrder = Math.max(1, parseInt(body.order, 10) || 1);
            if (categoryChanged) {
                // Remove from old category
                await technologyRepository.updateMany(
                    { category: existing.category, order: { $gt: oldOrder } },
                    { $inc: { order: -1 } }
                );
                // Shift into new category
                await technologyRepository.updateMany(
                    { category: targetCategory, order: { $gte: newOrder } },
                    { $inc: { order: 1 } }
                );
            } else if (newOrder !== oldOrder) {
                if (newOrder < oldOrder) {
                    await technologyRepository.updateMany(
                        { _id: { $ne: id }, category: targetCategory, order: { $gte: newOrder, $lt: oldOrder } },
                        { $inc: { order: 1 } }
                    );
                } else {
                    await technologyRepository.updateMany(
                        { _id: { $ne: id }, category: targetCategory, order: { $gt: oldOrder, $lte: newOrder } },
                        { $inc: { order: -1 } }
                    );
                }
            }
            body.order = newOrder;
        } else if (categoryChanged) {
            // Category changed without explicit order: put at end of new category
            await technologyRepository.updateMany(
                { category: existing.category, order: { $gt: oldOrder } },
                { $inc: { order: -1 } }
            );
            const maxItem = await technologyRepository.findOne({ category: targetCategory }, { sort: { order: -1 } });
            body.order = (maxItem && typeof maxItem.order === 'number' && maxItem.order >= 1) ? maxItem.order + 1 : 1;
        }

        const tech = await technologyRepository.updateById(id, body);

        serverCache.clearPattern('technologies');
        const newVersion = serverCache.incrementCacheVersion();

        return { tech, cacheVersion: newVersion };
    }

    async deleteTechnology(id) {
        const existing = await technologyRepository.findById(id);
        if (!existing) {
            throw new Error('Technology not found');
        }

        await technologyRepository.deleteById(id);

        if (typeof existing.order === 'number' && existing.order >= 1) {
            await technologyRepository.updateMany(
                { category: existing.category, order: { $gt: existing.order } },
                { $inc: { order: -1 } }
            );
        }

        serverCache.clearPattern('technologies');
        const newVersion = serverCache.incrementCacheVersion();

        return { success: true, cacheVersion: newVersion };
    }
}

module.exports = new TechnologyService();
