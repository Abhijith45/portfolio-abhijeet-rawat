const experienceService = require('../services/experienceService');
const serverCache = require('../utils/cacheManager');

class ExperienceController {
    async getAll(req, res, next) {
        try {
            const result = await experienceService.getAll();
            res.setHeader('x-cache-version', String(serverCache.getCacheVersion()));
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
            res.setHeader('x-server-cache', result.fromCache ? 'HIT' : 'MISS');
            res.json(result.data);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const result = await experienceService.createExperience(req.body);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.status(201).json({ success: true, data: result.experience });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    async update(req, res, next) {
        try {
            const result = await experienceService.updateExperience(req.params.id, req.body);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.json({ success: true, data: result.experience });
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 400;
            res.status(status).json({ success: false, message: err.message });
        }
    }

    async delete(req, res, next) {
        try {
            const result = await experienceService.deleteExperience(req.params.id);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.json({ success: true, message: 'Experience deleted successfully' });
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 500;
            res.status(status).json({ success: false, message: err.message });
        }
    }
}

module.exports = new ExperienceController();
