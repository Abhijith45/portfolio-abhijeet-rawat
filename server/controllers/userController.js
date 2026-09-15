const userService = require('../services/userService');
const serverCache = require('../utils/cacheManager');

class UserController {
    async getProfile(req, res, next) {
        try {
            const result = await userService.getProfile();
            res.setHeader('x-cache-version', String(serverCache.getCacheVersion()));
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
            res.setHeader('x-server-cache', result.fromCache ? 'HIT' : 'MISS');
            res.json(result.data);
        } catch (err) {
            next(err);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const result = await userService.updateProfile(req.user._id, req.body);
            res.setHeader('x-cache-version', String(result.cacheVersion));
            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: result.user,
            });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
}

module.exports = new UserController();
