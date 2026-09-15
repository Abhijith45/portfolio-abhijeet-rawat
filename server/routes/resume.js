const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/resume - Backward compatible route pointing to profile handler
router.get('/', (req, res, next) => userController.getProfile(req, res, next));

module.exports = router;
