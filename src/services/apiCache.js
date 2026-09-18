/**
 * Production-grade API Cache with persistent localStorage, memory fallback,
 * Stale-While-Revalidate (SWR), Generation-based In-Flight Invalidation Protection,
 * Resource-Specific Policies, and Cross-Tab / Same-Tab Event Synchronization.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const CACHE_SCHEMA_VERSION = 'v2';

export const CACHE_POLICY = {
    projects: {
        ttl: 7 * DAY,
        staleMaxAge: 30 * DAY,
    },
    technologies: {
        ttl: 30 * DAY,
        staleMaxAge: 90 * DAY,
    },
    experiences: {
        ttl: 30 * DAY,
        staleMaxAge: 90 * DAY,
    },
    profile: {
        ttl: 7 * DAY,
        staleMaxAge: 30 * DAY,
    },
    reviews: {
        ttl: 1 * DAY,
        staleMaxAge: 7 * DAY,
    },
};

export const CACHE_STATES = {
    EMPTY: 'EMPTY',
    FRESH: 'FRESH',
    STALE: 'STALE',
    REVALIDATING: 'REVALIDATING',
    EXPIRED: 'EXPIRED',
    INVALID: 'INVALID',
    ERROR: 'ERROR',
};

/**
 * Determine cache resource type from URL string
 */
export const getResourceFromUrl = (url = '') => {
    const cleanUrl = url.toLowerCase();
    if (cleanUrl.includes('project') || cleanUrl.includes('/api/projects')) return 'projects';
    if (cleanUrl.includes('technolog') || cleanUrl.includes('/api/technologies')) return 'technologies';
    if (cleanUrl.includes('experience') || cleanUrl.includes('/api/experiences')) return 'experiences';
    if (cleanUrl.includes('user') || cleanUrl.includes('/api/user') || cleanUrl.includes('resume') || cleanUrl.includes('/api/resume')) return 'profile';
    if (cleanUrl.includes('review') || cleanUrl.includes('/api/reviews')) {
        if (cleanUrl.includes('/all')) return null; // Private admin endpoint
        return 'reviews';
    }
    return null;
};

/**
 * Check if endpoint contains private / admin data that should NEVER be stored in localStorage
 */
export const isPrivateEndpoint = (url = '') => {
    const cleanUrl = url.toLowerCase();
    return (
        cleanUrl.includes('/api/auth') ||
        cleanUrl.includes('/api/queries') ||
        cleanUrl.includes('/api/reviews/all') ||
        cleanUrl.includes('/api/admin')
    );
};

class ApiCache {
    constructor() {
        this.memoryCache = new Map();
        this.pendingRequests = new Map();
        this.revalidatingKeys = new Set();
        this.prefix = 'portfolio_api_cache_';
        this.versionKey = 'portfolio_global_cache_version';
        this.cacheGeneration = 1;

        // Initialize cross-tab synchronization
        this.initBroadcastChannel();
    }

    initBroadcastChannel() {
        if (typeof window !== 'undefined' && typeof window.BroadcastChannel !== 'undefined') {
            try {
                this.channel = new BroadcastChannel('portfolio_cache_sync');
                this.channel.onmessage = (event) => {
                    if (event.data?.type === 'CACHE_INVALIDATED') {
                        const { scope, generation } = event.data.detail || {};
                        this.handleRemoteInvalidation(scope, generation);
                    }
                };
            } catch {
                this.channel = null;
            }
        }
    }

    handleRemoteInvalidation(scope = 'all', remoteGen = null) {
        this.cacheGeneration = remoteGen ? Math.max(this.cacheGeneration + 1, remoteGen) : this.cacheGeneration + 1;
        this.pendingRequests.clear();

        if (scope === 'all') {
            this.memoryCache.clear();
        } else {
            for (const key of Array.from(this.memoryCache.keys())) {
                if (key.toLowerCase().includes(scope.toLowerCase())) {
                    this.memoryCache.delete(key);
                }
            }
        }

        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            try {
                window.dispatchEvent(
                    new CustomEvent('portfolio-cache-invalidated', {
                        detail: { scope, generation: this.cacheGeneration, fromRemote: true },
                    })
                );
            } catch {
                // Ignore dispatch errors
            }
        }
    }

    getGeneration() {
        return this.cacheGeneration;
    }

    incrementGeneration() {
        this.cacheGeneration += 1;
        return this.cacheGeneration;
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
     * Get detailed cache entry state: EMPTY, FRESH, STALE, EXPIRED, INVALID
     */
    getEntry(key) {
        const storageKey = this.prefix + key;
        const now = Date.now();

        // 1. Check Memory Cache
        if (this.memoryCache.has(key)) {
            const entry = this.memoryCache.get(key);
            if (!entry || entry.schemaVersion !== CACHE_SCHEMA_VERSION || entry.data === undefined || entry.data === null) {
                this.memoryCache.delete(key);
                return { status: CACHE_STATES.INVALID, data: null };
            }

            if (now <= entry.expiry) {
                return { status: CACHE_STATES.FRESH, data: entry.data, timestamp: entry.timestamp, resource: entry.resource };
            }
            if (now <= entry.staleUntil) {
                return { status: CACHE_STATES.STALE, data: entry.data, timestamp: entry.timestamp, resource: entry.resource };
            }
            return { status: CACHE_STATES.EXPIRED, data: entry.data, timestamp: entry.timestamp, resource: entry.resource };
        }

        // 2. Check localStorage (only for public data)
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const item = window.localStorage.getItem(storageKey);
                if (item) {
                    const parsed = JSON.parse(item);

                    // Schema validation
                    if (!parsed || parsed.schemaVersion !== CACHE_SCHEMA_VERSION || parsed.data === undefined || parsed.data === null) {
                        window.localStorage.removeItem(storageKey);
                        return { status: CACHE_STATES.INVALID, data: null };
                    }

                    // Promote to memory cache for fast repeat access
                    this.memoryCache.set(key, parsed);

                    if (now <= parsed.expiry) {
                        return { status: CACHE_STATES.FRESH, data: parsed.data, timestamp: parsed.timestamp, resource: parsed.resource };
                    }
                    if (now <= parsed.staleUntil) {
                        return { status: CACHE_STATES.STALE, data: parsed.data, timestamp: parsed.timestamp, resource: parsed.resource };
                    }
                    return { status: CACHE_STATES.EXPIRED, data: parsed.data, timestamp: parsed.timestamp, resource: parsed.resource };
                }
            }
        } catch {
            // Corrupt or inaccessible localStorage
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.removeItem(storageKey);
                }
            } catch {
                void 0;
            }
            return { status: CACHE_STATES.INVALID, data: null };
        }

        return { status: CACHE_STATES.EMPTY, data: null };
    }

    /**
     * Backward-compatible simple get: returns data ONLY if FRESH
     */
    get(key) {
        const entry = this.getEntry(key);
        if (entry.status === CACHE_STATES.FRESH) {
            return entry.data;
        }
        return null;
    }

    /**
     * Backward-compatible raw get
     */
    getRaw(key) {
        const entry = this.getEntry(key);
        if (entry.status === CACHE_STATES.EMPTY || entry.status === CACHE_STATES.INVALID) {
            return null;
        }
        return {
            data: entry.data,
            isStale: entry.status === CACHE_STATES.STALE || entry.status === CACHE_STATES.EXPIRED,
            timestamp: entry.timestamp,
        };
    }

    /**
     * Set item into cache with resource policy or explicit custom TTL
     */
    set(key, data, resource = null, customTtl = null) {
        if (data === undefined || data === null) return;

        let resolvedResource = resource;
        let explicitTtl = customTtl;

        if (typeof resource === 'number') {
            explicitTtl = resource;
            resolvedResource = getResourceFromUrl(key);
        } else if (!resolvedResource) {
            resolvedResource = getResourceFromUrl(key);
        }

        const policy = (resolvedResource && CACHE_POLICY[resolvedResource]) || {
            ttl: 7 * DAY,
            staleMaxAge: 30 * DAY,
        };

        const ttl = explicitTtl !== null && explicitTtl !== undefined ? explicitTtl : policy.ttl;
        const staleMaxAge = explicitTtl !== null && explicitTtl !== undefined ? explicitTtl * 2 : policy.staleMaxAge || ttl * 2;
        const now = Date.now();

        const entry = {
            schemaVersion: CACHE_SCHEMA_VERSION,
            data,
            timestamp: now,
            expiry: now + ttl,
            staleUntil: now + staleMaxAge,
            resource: resolvedResource,
            generation: this.cacheGeneration,
        };

        // 1. Always save in memory
        this.memoryCache.set(key, entry);

        // 2. Save in localStorage ONLY if NOT a private / admin endpoint
        if (!isPrivateEndpoint(key)) {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    const storageKey = this.prefix + key;
                    window.localStorage.setItem(storageKey, JSON.stringify(entry));
                }
            } catch {
                // Handle QuotaExceeded gracefully (memory cache retains data)
            }
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
     * Clear cache entries matching resource or pattern, increment generation, and notify subscribers
     */
    clear(pattern) {
        this.incrementGeneration();
        this.pendingRequests.clear();

        const scope = pattern ? String(pattern).toLowerCase() : 'all';

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
            this.notifyInvalidation('all');
            return;
        }

        // Targeted pattern clearing
        for (const k of Array.from(this.memoryCache.keys())) {
            if (k.toLowerCase().includes(scope)) {
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
                        if (subKey.includes(scope)) {
                            keysToRemove.push(key);
                        }
                    }
                }
                keysToRemove.forEach((k) => window.localStorage.removeItem(k));
            }
        } catch {
            void 0;
        }

        this.notifyInvalidation(scope);
    }

    /**
     * Explicit global purge helper for Admin
     */
    purgeAll() {
        this.incrementGeneration();
        this.pendingRequests.clear();
        this.memoryCache.clear();

        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const keysToRemove = [];
                for (let i = 0; i < window.localStorage.length; i++) {
                    const key = window.localStorage.key(i);
                    if (key && (key.startsWith(this.prefix) || key === this.versionKey)) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach((k) => window.localStorage.removeItem(k));
            }
        } catch {
            void 0;
        }

        this.notifyInvalidation('all', { type: 'purge' });
    }

    /**
     * Clear all in-memory data (useful on logout)
     */
    clearMemory() {
        this.memoryCache.clear();
        this.pendingRequests.clear();
    }

    /**
     * Emit cache invalidation event to same tab (CustomEvent) and other tabs (BroadcastChannel)
     */
    notifyInvalidation(scope = 'all', meta = {}) {
        const detail = {
            scope,
            generation: this.cacheGeneration,
            timestamp: Date.now(),
            ...meta,
        };

        // Same-tab DOM CustomEvent
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            try {
                window.dispatchEvent(new CustomEvent('portfolio-cache-invalidated', { detail }));
            } catch {
                void 0;
            }
        }

        // Cross-tab BroadcastChannel
        if (this.channel) {
            try {
                this.channel.postMessage({ type: 'CACHE_INVALIDATED', detail });
            } catch {
                void 0;
            }
        }
    }

    /**
     * In-flight request deduplication handler with generation check
     */
    deduplicate(key, promiseFn) {
        const currentGen = this.cacheGeneration;

        if (this.pendingRequests.has(key)) {
            const pending = this.pendingRequests.get(key);
            if (pending.generation === currentGen) {
                return pending.promise;
            }
        }

        const promise = (async () => {
            try {
                const result = await promiseFn();
                return result;
            } finally {
                if (this.pendingRequests.get(key)?.promise === promise) {
                    this.pendingRequests.delete(key);
                }
            }
        })();

        this.pendingRequests.set(key, { promise, generation: currentGen });
        return promise;
    }
}

export const apiCache = new ApiCache();
export default apiCache;
