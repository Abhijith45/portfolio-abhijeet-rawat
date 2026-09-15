const express = require('express');
const router = express.Router();
const technologyController = require('../controllers/technologyController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

// GET /api/technologies - Public: get all technologies
router.get('/', (req, res, next) => technologyController.getAll(req, res, next));

// POST /api/technologies - Admin: create tech
router.post('/', protect, (req, res, next) => technologyController.create(req, res, next));

// PUT /api/technologies/:id - Admin: update tech
router.put('/:id', protect, (req, res, next) => technologyController.update(req, res, next));

// DELETE /api/technologies/:id - Admin: delete tech
router.delete('/:id', protect, (req, res, next) => technologyController.delete(req, res, next));

// POST /api/technologies/upload-icon - Admin: upload icon
router.post('/upload-icon', protect, upload.single('icon'), (req, res, next) => technologyController.uploadIcon(req, res, next));

module.exports = router;
