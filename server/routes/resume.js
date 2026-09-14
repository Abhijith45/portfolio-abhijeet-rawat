const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/resume - Backward compatible: get active resume link from user profile
router.get('/', async (req, res) => {
    try {
        const user = await User.findOne({ role: 'admin' }).lean();
        const resumeUrl =
            user?.resumeURL ||
            process.env.DEFAULT_RESUME_URL ||
            'https://docs.google.com/document/d/1azXMe6AKB34DnnR3ogXqRry5aSpHL5IUCqf5qV7FqgA/edit?usp=sharing';

        res.json({
            success: true,
            data: {
                title: 'Abhijeet Rawat - Full Stack Developer Resume',
                downloadUrl: resumeUrl,
                version: '1.0',
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch resume link' });
    }
});

// POST /api/resume - Backward compatible: update resume link on user profile
router.post('/', protect, async (req, res) => {
    try {
        const { downloadUrl, resumeURL } = req.body;
        const targetUrl = resumeURL || downloadUrl;
        if (!targetUrl) {
            return res.status(400).json({ success: false, message: 'Resume URL is required' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { resumeURL: targetUrl },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            data: {
                title: 'Abhijeet Rawat - Full Stack Developer Resume',
                downloadUrl: user.resumeURL,
                version: '1.0',
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
