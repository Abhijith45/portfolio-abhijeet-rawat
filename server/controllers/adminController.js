const serverCache = require('../utils/cacheManager');

class AdminController {
    purgeCache(req, res, next) {
        try {
            serverCache.clearAll();
            const newVersion = serverCache.getCacheVersion();

            res.setHeader('x-cache-version', String(newVersion));
            res.json({
                success: true,
                message: 'All system and database caches purged successfully. Global cache version updated.',
                cacheVersion: newVersion,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            console.error('Error purging cache:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to purge cache: ' + err.message,
            });
        }
    }

    getCacheStatus(req, res, next) {
        try {
            res.json({
                success: true,
                cacheVersion: serverCache.getCacheVersion(),
                totalEntries: serverCache.cache.size,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AdminController();
