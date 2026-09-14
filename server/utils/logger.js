const winston = require('winston');
const Transport = require('winston-transport');

const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzOPRYcdpy2x-iR_tbtYb0dLMbO_MplLFSEiW6RMqs-boK0pBjEPKu-vKBu9U6twSHB/exec';
const DEFAULT_WEBHOOK_SECRET = '9b752bdc626388ade8a4526825e0132e5f0558907756623f3793ca5ba06bca00';

/**
 * Dispatches error payload to the Google Apps Script Webhook endpoint in fire-and-forget mode.
 * Guarantees that failures in the webhook call will never impact or block application execution.
 */
const sendWebhookPayload = async (payload) => {
    const webhookUrl = process.env.WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
    const token = process.env.WEBHOOK_SECRET || DEFAULT_WEBHOOK_SECRET;

    if (!webhookUrl) return;

    const finalPayload = {
        token,
        timestamp: payload.timestamp || new Date().toISOString(),
        severity: (payload.severity || 'ERROR').toUpperCase(),
        environment: payload.environment || process.env.NODE_ENV || 'development',
        component: payload.component || 'portfolio-backend',
        stack: payload.stack || 'N/A',
        statusCode: typeof payload.statusCode === 'number' ? payload.statusCode : 500,
        message: payload.message || 'Unknown backend error',
    };

    try {
        if (typeof globalThis.fetch === 'function') {
            await globalThis.fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalPayload),
            });
        } else {
            // Fallback for older node environments
            const https = require('https');
            const url = new URL(webhookUrl);
            const data = JSON.stringify(finalPayload);

            const req = https.request(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(data),
                    },
                },
                (res) => {
                    res.resume(); // consume response
                }
            );

            req.on('error', () => {});
            req.write(data);
            req.end();
        }
    } catch (err) {
        // Suppress webhook dispatch errors so application never crashes
        if (process.env.NODE_ENV === 'development') {
            console.warn('[Webhook Logger Warning]: Failed to dispatch webhook:', err.message);
        }
    }
};

/**
 * Custom Winston Transport for Webhook Alerting
 */
class WebhookTransport extends Transport {
    constructor(opts) {
        super(opts);
        this.name = 'WebhookTransport';
        this.level = opts?.level || 'error';
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        // Only dispatch for error level or explicit webhook flags
        const isErrorLevel = info.level === 'error' || info.severity === 'ERROR';
        if (isErrorLevel || info.sendToWebhook) {
            const payload = {
                timestamp: info.timestamp || new Date().toISOString(),
                severity: (info.severity || (info.level === 'error' ? 'ERROR' : 'WARN')).toUpperCase(),
                environment: info.environment || process.env.NODE_ENV || 'development',
                component: info.component || 'portfolio-backend',
                stack: info.stack || (info.error && info.error.stack) || 'N/A',
                statusCode: info.statusCode || (info.error && info.error.statusCode) || 500,
                message: info.message || (info.error && info.error.message) || 'Unknown error',
            };

            // Fire and forget
            sendWebhookPayload(payload);
        }

        callback();
    }
}

// Custom format for clean console logs
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, component, statusCode, stack, ...meta }) => {
        const comp = component ? `[${component}]` : '';
        const status = statusCode ? `[${statusCode}]` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        const stackStr = stack ? `\n${stack}` : '';
        return `${timestamp} ${level} ${comp}${status}: ${message}${metaStr}${stackStr}`;
    })
);

// Instantiate Winston Logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
        new WebhookTransport({
            level: 'error',
        }),
    ],
});

/**
 * Direct fire-and-forget helper for logging explicit errors to webhook and winston
 */
logger.logWebhookError = ({ severity = 'ERROR', component = 'portfolio-backend', stack = 'N/A', statusCode = 500, message = 'Error' }) => {
    logger.error(message, {
        severity,
        component,
        stack,
        statusCode,
        sendToWebhook: true,
    });
};

module.exports = {
    logger,
    sendWebhookPayload,
    WebhookTransport,
};
