const dns = require('dns');
// Use public reliable DNS fallback to resolve MongoDB SRV records smoothly on Windows networks
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    console.warn('DNS server setting skipped:', e.message);
}

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const { logger, sendWebhookPayload } = require('./utils/logger');
const morganMiddleware = require('./middleware/morganLogger');
const errorHandler = require('./middleware/errorHandler');

const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const technologyRoutes = require('./routes/technologies');
const queryRoutes = require('./routes/queries');
const resumeRoutes = require('./routes/resume');
const experienceRoutes = require('./routes/experiences');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

// Top-level unhandled exception and rejection handlers
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, {
        component: 'process:uncaughtException',
        severity: 'ERROR',
        statusCode: 500,
        stack: err.stack,
        sendToWebhook: true,
    });
});

process.on('unhandledRejection', (reason) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    logger.error(`Unhandled Rejection: ${err.message}`, {
        component: 'process:unhandledRejection',
        severity: 'ERROR',
        statusCode: 500,
        stack: err.stack,
        sendToWebhook: true,
    });
});

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP Request Logger (Morgan -> Winston)
app.use(morganMiddleware);

// Security middleware
app.use(helmet());

// Cookie parser
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// Centralized Global Error Handler Middleware
app.use(errorHandler);

// Connect to MongoDB & Start Server
if (!process.env.MONGODB_URI) {
    logger.error('CRITICAL: MONGODB_URI is not set in environment variables', {
        component: 'database:init',
        severity: 'ERROR',
        statusCode: 500,
        sendToWebhook: true,
    });
    process.exit(1);
}

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB Atlas', { component: 'database' });
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`, { component: 'server' });
        });
    })
    .catch((err) => {
        logger.error(`MongoDB connection error: ${err.message}`, {
            component: 'database',
            severity: 'ERROR',
            statusCode: 500,
            stack: err.stack,
            sendToWebhook: true,
        });
        process.exit(1);
    });

module.exports = app;
