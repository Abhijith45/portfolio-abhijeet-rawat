const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

const rateLimit = require('express-rate-limit');

const verifyUrlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, message: 'Too many URL verification attempts. Please try again later.' },
});

// POST /api/projects/verify-url - Admin: Verify if URL is accessible with SSRF protection
router.post('/verify-url', protect, verifyUrlLimiter, (req, res, next) => projectController.verifyUrl(req, res, next));

// GET /api/projects/featured - Public: get top featured projects
router.get('/featured', (req, res, next) => projectController.getFeatured(req, res, next));

// GET /api/projects - Public: get all projects
router.get('/', (req, res, next) => projectController.getAll(req, res, next));

// POST /api/projects - Admin: create project
router.post('/', protect, (req, res, next) => projectController.create(req, res, next));

// PUT /api/projects/:id - Admin: update project
router.put('/:id', protect, (req, res, next) => projectController.update(req, res, next));

// DELETE /api/projects/:id - Admin: delete project
router.delete('/:id', protect, (req, res, next) => projectController.delete(req, res, next));

// POST /api/projects/upload-image - Admin: upload image to Cloudinary
router.post('/upload-image', protect, upload.single('image'), (req, res, next) => projectController.uploadImage(req, res, next));

module.exports = router;
