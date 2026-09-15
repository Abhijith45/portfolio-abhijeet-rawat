const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const queryController = require('../controllers/queryController');
const { protect } = require('../middleware/auth');

// Rate limiter for contact submission: 100 requests in dev, 20 in prod per 15 minutes per IP
const querySubmitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 20 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many messages sent from this IP. Please wait a moment.' },
});

// POST /api/queries - Public: submit contact inquiry
router.post(
    '/',
    querySubmitLimiter,
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be 2-100 characters')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name can only contain alphabets'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid email address'),
        body('message')
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Message must be 10-2000 characters'),
        body('subject')
            .optional()
            .trim(),
    ],
    (req, res, next) => queryController.submit(req, res, next)
);

// GET /api/queries - Protected: get all contact inquiries
router.get('/', protect, (req, res, next) => queryController.getAll(req, res, next));

// PUT /api/queries/:id - Protected: update query status
router.put('/:id', protect, (req, res, next) => queryController.update(req, res, next));

// DELETE /api/queries/:id - Protected: delete query
router.delete('/:id', protect, (req, res, next) => queryController.delete(req, res, next));

module.exports = router;
