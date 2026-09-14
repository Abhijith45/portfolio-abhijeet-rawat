const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const Query = require('../models/Query');
const { protect } = require('../middleware/auth');
const { sendInquiryNotification } = require('../utils/email');

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
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const subject = req.body.subject?.trim() || 'Enquiry Mail';
            const query = await Query.create({
                name: xss(req.body.name.trim()),
                email: xss(req.body.email.trim()),
                message: xss(req.body.message.trim()),
                subject: xss(subject),
            });

            // Dispatch notification email to abhijeetrawat45@gmail.com
            sendInquiryNotification({
                name: query.name,
                email: query.email,
                message: query.message,
                subject: query.subject,
                createdAt: query.createdAt,
            }).catch((err) => {
                console.error('[Email Notification Error]:', err);
            });

            res.status(201).json({
                success: true,
                message: 'Thank you! Your message has been received.',
                data: { id: query._id, createdAt: query.createdAt },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Failed to submit message' });
        }
    }
);

// GET /api/queries - Admin: list all queries
router.get('/', protect, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const queries = await Query.find(filter).sort({ createdAt: -1 }).lean();
        const unreadCount = await Query.countDocuments({ status: 'unread' });

        res.json({
            success: true,
            unreadCount,
            count: queries.length,
            data: queries,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
    }
});

// PUT /api/queries/:id - Admin: update status/notes
router.put('/:id', protect, async (req, res) => {
    try {
        const { status, notes, newNote } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (notes !== undefined) {
            updateData.notes = Array.isArray(notes)
                ? notes.map((n) => (typeof n === 'string' ? n.trim() : String(n))).filter(Boolean)
                : typeof notes === 'string' && notes.trim()
                ? [notes.trim()]
                : [];
        }

        let query = await Query.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (query && newNote && typeof newNote === 'string' && newNote.trim()) {
            query = await Query.findByIdAndUpdate(
                req.params.id,
                { $push: { notes: newNote.trim() } },
                { new: true }
            );
        }
        if (!query) {
            return res.status(404).json({ success: false, message: 'Query not found' });
        }
        res.json({ success: true, data: query });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE /api/queries/:id - Admin: delete query
router.delete('/:id', protect, async (req, res) => {
    try {
        const query = await Query.findByIdAndDelete(req.params.id);
        if (!query) {
            return res.status(404).json({ success: false, message: 'Query not found' });
        }
        res.json({ success: true, message: 'Inquiry deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
