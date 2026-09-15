const projectService = require('../services/projectService');
const { uploadToCloudinary } = require('../utils/cloudinary');
const serverCache = require('../utils/cacheManager');

class ProjectController {
    async verifyUrl(req, res, next) {
        try {
            const { url } = req.body;
            const result = await projectService.verifyUrl(url);
            res.json(result);
        } catch (err) {
            res.json({
                success: false,
                accessible: false,
                message: err.message || 'Unable to reach URL',
            });
        }
    }

    async getFeatured(req, res, next) {
        try {
            const result = await projectService.getFeatured(req.query.limit);
            res.setHeader('x-cache-version', String(serverCache.getCacheVersion()));
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
            res.setHeader('x-server-cache', result.fromCache ? 'HIT' : 'MISS');
            res.json(result.data);
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const result = await projectService.getAll(req.query);
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
            const result = await projectService.createProject(req.body);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.status(201).json({ success: true, data: result.project });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    async update(req, res, next) {
        try {
            const result = await projectService.updateProject(req.params.id, req.body);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.json({ success: true, data: result.project });
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 400;
            res.status(status).json({ success: false, message: err.message });
        }
    }

    async delete(req, res, next) {
        try {
            const result = await projectService.deleteProject(req.params.id);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.json({ success: true, message: 'Project deleted successfully' });
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 500;
            res.status(status).json({ success: false, message: err.message });
        }
    }

    async uploadImage(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No image file uploaded' });
            }
            const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects');
            res.json({ success: true, url: result.secure_url });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message || 'Image upload failed' });
        }
    }
}

module.exports = new ProjectController();
