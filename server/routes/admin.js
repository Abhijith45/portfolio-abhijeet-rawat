const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// POST /api/admin/purge-cache - Protected: Purge all server in-memory caches and update global cache version
router.post('/purge-cache', protect, (req, res, next) => adminController.purgeCache(req, res, next));

// GET /api/admin/cache-status - Protected: Get current cache metrics & version
router.get('/cache-status', protect, (req, res, next) => adminController.getCacheStatus(req, res, next));

module.exports = router;
