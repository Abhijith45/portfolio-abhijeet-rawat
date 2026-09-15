const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// GET /api/user/profile - Public: get profile & social link details
router.get('/profile', (req, res, next) => userController.getProfile(req, res, next));

// PUT /api/user/profile - Admin: update profile & social links
router.put('/profile', protect, (req, res, next) => userController.updateProfile(req, res, next));

module.exports = router;
