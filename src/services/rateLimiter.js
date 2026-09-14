/**
 * Client-Side Rate Limiter using a sliding window algorithm.
 * Prevents rapid button mashing, infinite loops, and API quota exhaustion.
 */

class ClientRateLimiter {
    constructor(options = {}) {
        this.windowMs = options.windowMs || 10000; // 10 seconds
        this.maxRequests = options.maxRequests || 35; // 35 requests per 10s per client
        this.requestBuckets = new Map();
    }

    /**
     * Check if a request is allowed under current rate limits.
     * @param {string} key - Category or endpoint identifier (e.g., 'GET:/api/projects')
     * @param {number} [customMax] - Optional custom max request limit for this specific bucket
     * @param {number} [customWindowMs] - Optional custom window duration
     * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
     */
    checkLimit(key, customMax, customWindowMs) {
        const now = Date.now();
        const windowSize = customWindowMs || this.windowMs;
        const limit = customMax || this.maxRequests;

        const timestamps = this.requestBuckets.get(key) || [];
        // Filter out timestamps outside the active window
        const validTimestamps = timestamps.filter((time) => now - time < windowSize);

        if (validTimestamps.length >= limit) {
            const oldestInWindow = validTimestamps[0];
            const retryAfterMs = Math.max(0, windowSize - (now - oldestInWindow));
            return {
                allowed: false,
                remaining: 0,
                retryAfterMs,
                message: `Client rate limit exceeded. Please wait ${Math.ceil(retryAfterMs / 1000)}s before retrying.`,
            };
        }

        // Add current timestamp and save
        validTimestamps.push(now);
        this.requestBuckets.set(key, validTimestamps);

        return {
            allowed: true,
            remaining: limit - validTimestamps.length,
            retryAfterMs: 0,
        };
    }

    /**
     * Reset specific bucket or entire limiter
     */
    reset(key) {
        if (key) {
            this.requestBuckets.delete(key);
        } else {
            this.requestBuckets.clear();
        }
    }
}

export const clientRateLimiter = new ClientRateLimiter();
export default clientRateLimiter;
