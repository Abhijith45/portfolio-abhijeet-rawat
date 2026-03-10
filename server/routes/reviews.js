const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const Review = require('../models/Review');

// Strict rate limiter for review submission
const submitLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { success: false, message: 'Too many review submissions. Please try again later.' },
    keyGenerator: (req) => req.ip,
});

// Validation rules
const reviewValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be 2–100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name contains invalid characters'),
    body('company')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company must be 2–100 characters'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be 10–1000 characters'),
    body('rating')
        .optional()
        .isFloat({ min: 0.5, max: 5 })
        .withMessage('Rating must be between 0.5 and 5'),
];

// GET /api/reviews - Fetch approved reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ approved: true })
            .sort({ createdAt: -1 })
            .select('-__v')
            .lean();

        res.json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
        });
    }
});

// POST /api/reviews - Submit a new review
router.post('/', submitLimiter, reviewValidation, async (req, res) => {
    // Validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }

    try {
        // Sanitize input with XSS protection
        const sanitized = {
            name: xss(req.body.name.trim()),
            company: xss(req.body.company.trim()),
            message: xss(req.body.message.trim()),
            rating: req.body.rating || 5,
            approved: false, // Always pending approval
        };

        const review = await Review.create(sanitized);

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully. It will appear after approval.',
            data: {
                id: review._id,
                name: review.name,
                company: review.company,
                rating: review.rating,
                createdAt: review.createdAt,
            },
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(err.errors).map((e) => e.message).join(', '),
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to submit review',
        });
    }
});

module.exports = router;
