const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
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
    body('designation')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Designation must be at most 100 characters'),
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
router.get('/', (req, res, next) => reviewController.getApproved(req, res, next));

// GET /api/reviews/all - Fetch all reviews (Admin only)
router.get('/all', protect, (req, res, next) => reviewController.getAll(req, res, next));

// POST /api/reviews - Submit a new review (Public)
router.post('/', submitLimiter, reviewValidation, (req, res, next) => reviewController.submitReview(req, res, next));

// PUT /api/reviews/:id - Approve or update review (Admin only)
router.put('/:id', protect, (req, res, next) => reviewController.update(req, res, next));

// DELETE /api/reviews/:id - Delete review (Admin only)
router.delete('/:id', protect, (req, res, next) => reviewController.delete(req, res, next));

module.exports = router;
