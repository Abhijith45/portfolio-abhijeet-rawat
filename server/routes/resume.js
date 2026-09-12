const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');

// GET /api/resume - Public: get current active resume link
router.get('/', async (req, res) => {
    try {
        let resume = await Resume.findOne({ isActive: true }).sort({ updatedAt: -1 });
        if (!resume) {
            resume = {
                title: 'Abhijeet Rawat - Full Stack Developer Resume',
                downloadUrl:
                    process.env.DEFAULT_RESUME_URL ||
                    'https://drive.google.com/file/d/1Jlh8BsV3HuVy_DcsrTtsPv3e0-iaLOZa/view',
                version: '1.0',
            };
        }
        res.json({ success: true, data: resume });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch resume link' });
    }
});

// POST /api/resume - Admin: set new active resume link / Google Drive metadata
router.post('/', protect, async (req, res) => {
    try {
        const { title, downloadUrl, driveFileId, version } = req.body;
        if (!downloadUrl) {
            return res.status(400).json({ success: false, message: 'Download URL is required' });
        }

        // Set previous active resumes to false
        await Resume.updateMany({}, { isActive: false });

        const resume = await Resume.create({
            title: title || 'Abhijeet Rawat - Full Stack Developer Resume',
            downloadUrl,
            driveFileId: driveFileId || '',
            version: version || '1.0',
            isActive: true,
        });

        res.status(201).json({ success: true, data: resume });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
