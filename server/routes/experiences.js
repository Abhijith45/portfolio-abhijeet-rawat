const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { protect } = require('../middleware/auth');

// GET /api/experiences - Public: get all experiences
router.get('/', (req, res, next) => experienceController.getAll(req, res, next));

// POST /api/experiences - Admin: create experience
router.post('/', protect, (req, res, next) => experienceController.create(req, res, next));

// PUT /api/experiences/:id - Admin: update experience
router.put('/:id', protect, (req, res, next) => experienceController.update(req, res, next));

// DELETE /api/experiences/:id - Admin: delete experience
router.delete('/:id', protect, (req, res, next) => experienceController.delete(req, res, next));

module.exports = router;
