const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/login - Public: admin login
router.post('/login', (req, res, next) => authController.login(req, res, next));

// GET /api/auth/me - Protected: get current authenticated user
router.get('/me', protect, (req, res, next) => authController.getMe(req, res, next));

// POST /api/auth/logout - Public: logout and clear cookie
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

module.exports = router;
