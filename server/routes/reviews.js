const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// Strict rate limiter for public review submission
const submitLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
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
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address'),
    body('company')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company must be 2–100 characters'),
    body('designation')
        .optional()
        .trim(),
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be 10–1000 characters'),
    body('rating')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be between 0 and 5'),
];

// GET /api/reviews - Fetch approved reviews (Public)
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

// GET /api/reviews/all - Fetch all reviews (Admin only)
router.get('/all', protect, async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }).lean();
        const pendingCount = await Review.countDocuments({ approved: false });
        res.json({
            success: true,
            pendingCount,
            count: reviews.length,
            data: reviews,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
});

// POST /api/reviews - Submit a new review (Public)
router.post('/', submitLimiter, reviewValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }

    try {
        const role = req.body.designation?.trim() || req.body.company?.trim() || '';
        const sanitized = {
            name: xss(req.body.name.trim()),
            company: xss(role),
            designation: xss(role),
            email: req.body.email ? xss(req.body.email.trim()) : undefined,
            message: xss(req.body.message.trim()),
            rating: typeof req.body.rating === 'number' ? req.body.rating : (Number(req.body.rating) || 0),
            approved: false, // Pending approval
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

// PUT /api/reviews/:id - Approve or update review (Admin only)
router.put('/:id', protect, async (req, res) => {
    try {
        const { approved, name, company, message, rating } = req.body;
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            {
                ...(approved !== undefined && { approved }),
                ...(name && { name }),
                ...(company && { company }),
                ...(message && { message }),
                ...(rating && { rating }),
            },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.json({ success: true, data: review });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE /api/reviews/:id - Delete review (Admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
