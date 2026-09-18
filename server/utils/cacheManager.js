/**
 * Server-Side In-Memory Cache Manager with Global Versioning.
 * Eliminates redundant MongoDB trips and provides sub-2ms response times.
 */

class ServerCacheManager {
    constructor() {
        this.cache = new Map();
        this.cacheVersion = Date.now();
        this.defaultTTL = 24 * 60 * 60 * 1000; // 24 hours
    }

    getCacheVersion() {
        return this.cacheVersion;
    }

    incrementCacheVersion() {
        this.cacheVersion = Math.max(Date.now(), (this.cacheVersion || 0) + 1);
        return this.cacheVersion;
    }

    get(key) {
        if (!this.cache.has(key)) return null;
        const entry = this.cache.get(key);
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }

    set(key, data, ttl = this.defaultTTL) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + ttl,
        });
    }

    delete(key) {
        this.cache.delete(key);
    }

    clearPattern(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    clearAll() {
        this.cache.clear();
        this.incrementCacheVersion();
    }

    /**
     * Express middleware helper to serve and cache JSON responses.
     */
    cacheResponse(keyGen, ttl) {
        return (req, res, next) => {
            const key = typeof keyGen === 'function' ? keyGen(req) : keyGen || req.originalUrl;
            res.setHeader('x-cache-version', String(this.cacheVersion));
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

            const cached = this.get(key);
            if (cached) {
                res.setHeader('x-server-cache', 'HIT');
                return res.json(cached);
            }

            // Capture original res.json to cache response payload
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    this.set(key, body, ttl);
                }
                res.setHeader('x-server-cache', 'MISS');
                return originalJson(body);
            };

            next();
        };
    }
}

const serverCache = new ServerCacheManager();
module.exports = serverCache;
