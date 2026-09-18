/**
 * Client-Side Error Logging & Webhook Dispatcher
 * Dispatches unhandled frontend errors, API failures, and ErrorBoundary exceptions
 * directly to the Google Apps Script Webhook endpoint in fire-and-forget mode.
 *
 * Includes client-side deduplication to prevent flooding the webhook during re-render loops.
 */

const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzOPRYcdpy2x-iR_tbtYb0dLMbO_MplLFSEiW6RMqs-boK0pBjEPKu-vKBu9U6twSHB/exec';

// In-memory cache to deduplicate errors within a cooldown window (60s)
const recentlyLoggedErrors = new Map();
const DEDUPLICATION_WINDOW_MS = 60 * 1000;

/**
 * Cleans up expired error keys from the deduplication map.
 */
const cleanupDeduplicationCache = () => {
    const now = Date.now();
    for (const [key, timestamp] of recentlyLoggedErrors.entries()) {
        if (now - timestamp > DEDUPLICATION_WINDOW_MS) {
            recentlyLoggedErrors.delete(key);
        }
    }
};

/**
 * Dispatches an error payload to the configured webhook endpoint in fire-and-forget mode.
 * @param {Object} options
 * @param {string} [options.severity='ERROR'] - 'ERROR' | 'WARN' | 'INFO'
 * @param {string} [options.component='portfolio-frontend'] - Component or service name
 * @param {string} [options.stack='N/A'] - Error stack trace or component stack
 * @param {number} [options.statusCode=0] - Associated HTTP or application status code
 * @param {string} [options.message='Unknown frontend error'] - Human-readable error message
 * @param {string} [options.environment] - Environment override
 * @param {boolean} [options.force=false] - Bypass client-side deduplication
 */
export const logErrorToWebhook = ({
    severity = 'ERROR',
    component = 'portfolio-frontend',
    stack = 'N/A',
    statusCode = 0,
    message = 'Unknown frontend error',
    environment,
    force = false,
} = {}) => {
    cleanupDeduplicationCache();

    const normalizedSeverity = (severity || 'ERROR').toUpperCase();
    const errorSignature = `${component}:${normalizedSeverity}:${message}`;

    // Deduplication check
    if (!force && recentlyLoggedErrors.has(errorSignature)) {
        return; // Suppress duplicate log within cooldown window
    }
    recentlyLoggedErrors.set(errorSignature, Date.now());

    // Resolve webhook endpoint & secret from Vite environment or fallbacks
    const webhookUrl =
        (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_WEBHOOK_URL || import.meta.env?.WEBHOOK_URL)) ||
        DEFAULT_WEBHOOK_URL;

    const token =
        (typeof import.meta !== 'undefined' &&
            // react-doctor-disable-next-line react-doctor/public-env-secret-name
            (import.meta.env?.VITE_WEBHOOK_SECRET || import.meta.env?.VITE_WEBHOOK_TOKEN || import.meta.env?.WEBHOOK_SECRET)) ||
        '';

    if (!webhookUrl) return;

    const env =
        environment ||
        (typeof import.meta !== 'undefined'
            ? import.meta.env?.MODE || (import.meta.env?.PROD ? 'production' : 'development')
            : 'development');

    const finalPayload = {
        token,
        timestamp: new Date().toISOString(),
        severity: normalizedSeverity,
        environment: env,
        component,
        stack: stack || 'N/A',
        statusCode: typeof statusCode === 'number' ? statusCode : 0,
        message: String(message || 'Unknown error'),
    };

    const payloadString = JSON.stringify(finalPayload);

    // In test environments (e.g. Vitest / happy-dom), only execute if mocks are active
    const isTest = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') ||
                   (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test');

    const isSendBeaconMocked = typeof navigator !== 'undefined' && (Boolean(navigator.sendBeacon?._isMockFunction) || Boolean(navigator.sendBeacon?.mock));
    const isFetchMocked = typeof fetch === 'function' && (Boolean(fetch._isMockFunction) || Boolean(fetch.mock));

    if (isTest && !isSendBeaconMocked && !isFetchMocked && !globalThis.__ENABLE_TEST_NETWORK__) {
        return;
    }

    // 1. Try navigator.sendBeacon (ideal for async non-blocking / unload safety)
    try {
        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
            const blob = new Blob([payloadString], { type: 'application/json' });
            const queued = navigator.sendBeacon(webhookUrl, blob);
            if (queued) return;
        }
    } catch {
        // Fall back to fetch if Blob/sendBeacon throws
    }

    // In unit test environment, don't execute unmocked real cross-origin network fetch
    if (isTest && typeof fetch === 'function' && !fetch._isMockFunction && !globalThis.__ENABLE_TEST_NETWORK__) {
        return;
    }

    // 2. Fallback to native fetch (fire & forget)
    try {
        if (typeof fetch === 'function') {
            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: payloadString,
                keepalive: true,
                mode: 'cors',
            }).catch(() => {
                // Silently ignore webhook network errors to ensure UI remains smooth
            });
        }
    } catch {
        // Suppress any synchronous execution error
    }
};

export const frontendLogger = {
    error: (message, meta = {}) => {
        logErrorToWebhook({
            severity: 'ERROR',
            message,
            ...meta,
        });
    },
    warn: (message, meta = {}) => {
        logErrorToWebhook({
            severity: 'WARN',
            message,
            ...meta,
        });
    },
    info: (message, meta = {}) => {
        logErrorToWebhook({
            severity: 'INFO',
            message,
            ...meta,
        });
    },
    clearDeduplication: () => {
        recentlyLoggedErrors.clear();
    },
};

export default frontendLogger;
