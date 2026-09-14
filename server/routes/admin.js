const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const serverCache = require('../utils/cacheManager');

// POST /api/admin/purge-cache - Protected: Purge all server in-memory caches and update global cache version
router.post('/purge-cache', protect, (req, res) => {
    try {
        serverCache.clearAll();
        const newVersion = serverCache.getCacheVersion();

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
});

// GET /api/admin/cache-status - Protected: Get current cache metrics & version
router.get('/cache-status', protect, (req, res) => {
    res.json({
        success: true,
        cacheVersion: serverCache.getCacheVersion(),
        totalEntries: serverCache.cache.size,
    });
});

module.exports = router;
