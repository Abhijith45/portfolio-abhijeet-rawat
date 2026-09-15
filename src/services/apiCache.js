/**
 * Production-grade API Cache with persistent localStorage and in-memory fallback.
 * Implements 2-Tier Cache-First architecture, Long-Lived TTL (30 Days), and Global Version Invalidation.
 */

class ApiCache {
    constructor() {
        this.memoryCache = new Map();
        this.pendingRequests = new Map();
        this.defaultTTL = 30 * 24 * 60 * 60 * 1000; // 30 days default for static/read-heavy portfolio data
        this.prefix = 'portfolio_api_cache_';
        this.versionKey = 'portfolio_global_cache_version';
    }

    /**
     * Synchronize and validate client cache against server global cache version.
     * If serverVersion is newer than local version, flushes all stale cache entries.
     */
    checkVersion(serverVersion) {
        if (!serverVersion) return false;
        const numServerVer = Number(serverVersion);
        if (!numServerVer) return false;

        let localVer = 0;
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localVer = Number(window.localStorage.getItem(this.versionKey)) || 0;
            }
        } catch {
            localVer = 0;
        }

        if (numServerVer > localVer) {
            // Server has purged or updated data globally, invalidate client cache
            this.clear();
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem(this.versionKey, String(numServerVer));
                }
            } catch {
                void 0;
            }
            return true;
        }

        return false;
    }

    /**
     * Deterministic cache key generator
     */
    generateKey(url, params = {}) {
        const sortedParams = Object.keys(params || {})
            .sort()
            .map((k) => `${k}=${encodeURIComponent(params[k])}`)
            .join('&');
        return `${url}${sortedParams ? `?${sortedParams}` : ''}`;
    }

    /**
     * Get item from localStorage with memory fallback
     */
    get(key) {
        const raw = this.getRaw(key);
        if (!raw) return null;
        if (raw.isStale) {
            return null;
        }
        return raw.data;
    }

    /**
     * Get item including stale status (crucial for offline/429 fallback)
     */
    getRaw(key) {
        const storageKey = this.prefix + key;

        // 1. Try memory cache first
        if (this.memoryCache.has(key)) {
            const entry = this.memoryCache.get(key);
            const isStale = Date.now() > entry.expiry;
            return { data: entry.data, isStale, timestamp: entry.timestamp };
        }

        // 2. Try localStorage
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const item = window.localStorage.getItem(storageKey);
                if (item) {
                    const parsed = JSON.parse(item);
                    const isStale = Date.now() > parsed.expiry;
                    // Cache in memory for faster subsequent lookups
                    this.memoryCache.set(key, parsed);
                    return { data: parsed.data, isStale, timestamp: parsed.timestamp };
                }
            }
        } catch {
            // LocalStorage inaccessible (e.g. quota, security sandbox)
        }

        return null;
    }

    /**
     * Set item into cache with TTL
     */
    set(key, data, ttl = this.defaultTTL) {
        const entry = {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + ttl,
        };

        // Save in memory
        this.memoryCache.set(key, entry);

        // Save in localStorage
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const storageKey = this.prefix + key;
                window.localStorage.setItem(storageKey, JSON.stringify(entry));
            }
        } catch {
            // LocalStorage quota or error - memory cache still works
        }
    }

    /**
     * Remove specific key
     */
    delete(key) {
        this.memoryCache.delete(key);
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(this.prefix + key);
            }
        } catch {
            void 0;
        }
    }

    /**
     * Clear all cached items matching pattern or entirely
     */
    clear(pattern) {
        if (!pattern) {
            this.memoryCache.clear();
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    const keysToRemove = [];
                    for (let i = 0; i < window.localStorage.length; i++) {
                        const key = window.localStorage.key(i);
                        if (key && key.startsWith(this.prefix)) {
                            keysToRemove.push(key);
                        }
                    }
                    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
                }
            } catch {
                void 0;
            }
            return;
        }

        // Pattern clearing across memory and localStorage
        const cleanPattern = String(pattern).toLowerCase();

        for (const k of this.memoryCache.keys()) {
            if (k.toLowerCase().includes(cleanPattern)) {
                this.memoryCache.delete(k);
            }
        }
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const keysToRemove = [];
                for (let i = 0; i < window.localStorage.length; i++) {
                    const key = window.localStorage.key(i);
                    if (key && key.startsWith(this.prefix)) {
                        const subKey = key.slice(this.prefix.length).toLowerCase();
                        if (subKey.includes(cleanPattern)) {
                            keysToRemove.push(key);
                        }
                    }
                }
                keysToRemove.forEach((k) => window.localStorage.removeItem(k));
            }
        } catch {
            void 0;
        }
    }

    /**
     * Explicit global purge helper for Admin
     */
    purgeAll() {
        this.clear();
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(this.versionKey);
            }
        } catch {
            void 0;
        }
    }

    /**
     * In-flight request deduplication handler
     */
    deduplicate(key, promiseFn) {
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }

        const promise = promiseFn()
            .finally(() => {
                this.pendingRequests.delete(key);
            });

        this.pendingRequests.set(key, promise);
        return promise;
    }
}

export const apiCache = new ApiCache();
export default apiCache;
