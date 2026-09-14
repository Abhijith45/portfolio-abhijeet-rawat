const morgan = require('morgan');
const { logger } = require('../utils/logger');

// Custom morgan token for response time in ms
morgan.token('status-code', (req, res) => res.statusCode);

/**
 * Creates morgan HTTP request logging middleware piped through Winston.
 */
const morganMiddleware = morgan(
    (tokens, req, res) => {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number(tokens.status(req, res)),
            responseTime: `${tokens['response-time'](req, res)} ms`,
            contentLength: tokens.res(req, res, 'content-length'),
            ip: req.ip || req.connection?.remoteAddress,
        });
    },
    {
        stream: {
            write: (message) => {
                try {
                    const data = JSON.parse(message);
                    const statusCode = data.status || 200;
                    const logMsg = `HTTP ${data.method} ${data.url} ${statusCode} - ${data.responseTime}`;

                    if (statusCode >= 500) {
                        logger.error(logMsg, {
                            component: `http:${data.method}`,
                            statusCode,
                            severity: 'ERROR',
                            stack: `Server Error on ${data.method} ${data.url}`,
                            sendToWebhook: true,
                        });
                    } else if (statusCode >= 400) {
                        logger.warn(logMsg, {
                            component: `http:${data.method}`,
                            statusCode,
                            severity: 'WARN',
                        });
                    } else {
                        logger.info(logMsg, {
                            component: `http:${data.method}`,
                            statusCode,
                        });
                    }
                } catch {
                    logger.info(message.trim());
                }
            },
        },
    }
);

module.exports = morganMiddleware;
