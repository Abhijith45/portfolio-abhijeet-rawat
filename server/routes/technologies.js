const express = require('express');
const router = express.Router();
const Technology = require('../models/Technology');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../utils/cloudinary');
const serverCache = require('../utils/cacheManager');

// GET /api/technologies - Public: get all tech grouped or ordered
router.get('/', async (req, res) => {
    try {
        const cacheKey = 'technologies:all';
        const cached = serverCache.get(cacheKey);

        res.setHeader('x-cache-version', String(serverCache.getCacheVersion()));
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

        if (cached) {
            res.setHeader('x-server-cache', 'HIT');
            return res.json(cached);
        }

        const technologies = await Technology.find().sort({ category: 1, order: 1, name: 1 }).lean();
        const payload = { success: true, count: technologies.length, data: technologies };

        serverCache.set(cacheKey, payload);
        res.setHeader('x-server-cache', 'MISS');
        res.json(payload);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch technologies' });
    }
});

// POST /api/technologies - Admin: create tech
router.post('/', protect, async (req, res) => {
    try {
        const { name, category, icon, proficiency, order } = req.body;
        const tech = await Technology.create({
            name,
            category,
            icon: icon || '',
            proficiency: proficiency || 'Proficient',
            order: Number(order) || 0,
        });

        serverCache.clearPattern('technologies');
        serverCache.incrementCacheVersion();

        res.status(201).json({ success: true, data: tech });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT /api/technologies/:id - Admin: update tech
router.put('/:id', protect, async (req, res) => {
    try {
        const tech = await Technology.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!tech) {
            return res.status(404).json({ success: false, message: 'Technology not found' });
        }

        serverCache.clearPattern('technologies');
        serverCache.incrementCacheVersion();

        res.json({ success: true, data: tech });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE /api/technologies/:id - Admin: delete tech
router.delete('/:id', protect, async (req, res) => {
    try {
        const tech = await Technology.findByIdAndDelete(req.params.id);
        if (!tech) {
            return res.status(404).json({ success: false, message: 'Technology not found' });
        }

        serverCache.clearPattern('technologies');
        serverCache.incrementCacheVersion();

        res.json({ success: true, message: 'Technology removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/technologies/upload-icon - Admin: upload icon
router.post('/upload-icon', protect, upload.single('icon'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No icon file provided' });
        }
        const result = await uploadToCloudinary(req.file.buffer, 'portfolio/tech');
        res.json({ success: true, url: result.secure_url });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Icon upload failed' });
    }
});

module.exports = router;
