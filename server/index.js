const dns = require('dns');
// Use public reliable DNS fallback to resolve MongoDB SRV records smoothly on Windows networks
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    console.warn('DNS server setting skipped:', e.message);
}

require('dotenv').config();
const mongoose = require('mongoose');
const { logger } = require('./utils/logger');
const app = require('./app');

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

const PORT = process.env.PORT || 5000;

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
