const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/login
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
        body('password').notEmpty().withMessage('Password required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = generateToken(user._id);

            // Set secure cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({
                success: true,
                message: 'Logged in successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ success: false, message: 'Server error during login' });
        }
    }
);

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
