const reviewService = require('../services/reviewService');
const serverCache = require('../utils/cacheManager');
const { validationResult } = require('express-validator');

class ReviewController {
    async getApproved(req, res, next) {
        try {
            const result = await reviewService.getApproved();
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
            const result = await reviewService.getAll();
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async submitReview(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: errors.array()[0].msg,
                    errors: errors.array(),
                });
            }

            const result = await reviewService.submitReview(req.body);
            res.status(201).json(result);
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to submit review',
            });
        }
    }

    async update(req, res, next) {
        try {
            const result = await reviewService.updateReview(req.params.id, req.body);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.json({ success: true, data: result.review });
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 400;
            res.status(status).json({ success: false, message: err.message });
        }
    }

    async delete(req, res, next) {
        try {
            const result = await reviewService.deleteReview(req.params.id);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.json({ success: true, message: 'Review deleted successfully' });
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 500;
            res.status(status).json({ success: false, message: err.message });
        }
    }
}

module.exports = new ReviewController();
