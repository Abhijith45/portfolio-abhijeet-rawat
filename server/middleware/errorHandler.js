const { logger } = require('../utils/logger');

/**
 * Centralized Global Express Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    // If response was already sent, delegate to default Express error handler
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || err.status || 500;
    const isServerError = statusCode >= 500;
    const component = `express:${req.method}:${req.baseUrl || req.path || '/'}`;
    const message = err.message || 'Internal Server Error';

    // Log to Winston & Dispatch to Webhook for 5xx errors or explicit error logs
    logger.error(message, {
        component,
        statusCode,
        severity: isServerError ? 'ERROR' : 'WARN',
        stack: err.stack || 'N/A',
        sendToWebhook: isServerError,
    });

    res.status(statusCode).json({
        success: false,
        message: isServerError && process.env.NODE_ENV === 'production'
            ? 'Internal server error. Please try again later.'
            : message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
