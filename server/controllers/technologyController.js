const technologyService = require('../services/technologyService');
const { uploadToCloudinary } = require('../utils/cloudinary');
const serverCache = require('../utils/cacheManager');

class TechnologyController {
    async getAll(req, res, next) {
        try {
            const result = await technologyService.getAll();
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
            const result = await technologyService.createTechnology(req.body);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.status(201).json({ success: true, data: result.tech });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    async update(req, res, next) {
        try {
            const result = await technologyService.updateTechnology(req.params.id, req.body);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.json({ success: true, data: result.tech });
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 400;
            res.status(status).json({ success: false, message: err.message });
        }
    }

    async delete(req, res, next) {
        try {
            const result = await technologyService.deleteTechnology(req.params.id);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.json({ success: true, message: 'Technology removed' });
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 500;
            res.status(status).json({ success: false, message: err.message });
        }
    }

    async uploadIcon(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No icon file provided' });
            }
            const result = await uploadToCloudinary(req.file.buffer, 'portfolio/tech');
            res.json({ success: true, url: result.secure_url });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message || 'Icon upload failed' });
        }
    }
}

module.exports = new TechnologyController();
