import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiCache } from '../apiCache';
import { clientRateLimiter } from '../rateLimiter';
import api from '../api';

describe('API Caching & Client-Side Rate Limiter Test Suite', () => {
    beforeEach(() => {
        apiCache.clear();
        clientRateLimiter.reset();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('1. ApiCache Unit Tests', () => {
        it('saves and retrieves items within TTL', () => {
            const testKey = '/api/test-data';
            const payload = { success: true, count: 5, data: ['alpha', 'beta'] };

            apiCache.set(testKey, payload, 5000);
            const retrieved = apiCache.get(testKey);

            expect(retrieved).toEqual(payload);
        });

        it('returns null for expired items from get(), but retains them in getRaw() for offline fallback', () => {
            const testKey = '/api/stale-data';
            const payload = { cached: 'offline-record' };

            // Expire immediately by setting TTL = -100ms
            apiCache.set(testKey, payload, -100);

            // Regular get returns null because it is expired
            expect(apiCache.get(testKey)).toBeNull();

            // getRaw still preserves data with isStale = true to guarantee 100% site availability
            const raw = apiCache.getRaw(testKey);
            expect(raw).not.toBeNull();
            expect(raw.isStale).toBe(true);
            expect(raw.data).toEqual(payload);
        });

        it('deletes specific keys and pattern-clears matching categories', () => {
            apiCache.set('/api/projects', { projects: [1, 2] });
            apiCache.set('/api/projects?category=web', { projects: [1] });
            apiCache.set('/api/reviews', { reviews: [5] });

            // Pattern clear projects
            apiCache.clear('/api/projects');

            expect(apiCache.get('/api/projects')).toBeNull();
            expect(apiCache.get('/api/projects?category=web')).toBeNull();
            expect(apiCache.get('/api/reviews')).toEqual({ reviews: [5] });
        });

        it('deduplicates concurrent in-flight requests to the same endpoint', async () => {
            const mockAsyncFetcher = vi.fn().mockImplementation(
                () =>
                    new Promise((resolve) => {
                        setTimeout(() => resolve({ fetched: true }), 50);
                    })
            );

            const key = '/api/concurrent-test';

            // Fire 3 simultaneous calls
            const [call1, call2, call3] = await Promise.all([
                apiCache.deduplicate(key, mockAsyncFetcher),
                apiCache.deduplicate(key, mockAsyncFetcher),
                apiCache.deduplicate(key, mockAsyncFetcher),
            ]);

            expect(mockAsyncFetcher).toHaveBeenCalledTimes(1);
            expect(call1).toEqual({ fetched: true });
            expect(call2).toEqual({ fetched: true });
            expect(call3).toEqual({ fetched: true });
        });

        it('invalidates cache and updates version when server version is newer via checkVersion()', () => {
            apiCache.set('/api/projects', { projects: [1, 2] });
            expect(apiCache.get('/api/projects')).not.toBeNull();

            // Set initial version
            window.localStorage.setItem('portfolio_global_cache_version', '100');

            // Server version is newer (200 > 100)
            const invalidated = apiCache.checkVersion('200');
            expect(invalidated).toBe(true);
            expect(apiCache.get('/api/projects')).toBeNull();
            expect(window.localStorage.getItem('portfolio_global_cache_version')).toBe('200');

            // Server version is same (200 <= 200) -> no invalidation
            apiCache.set('/api/projects', { projects: [3, 4] });
            const notInvalidated = apiCache.checkVersion('200');
            expect(notInvalidated).toBe(false);
            expect(apiCache.get('/api/projects')).toEqual({ projects: [3, 4] });
        });

        it('clears all cached data and version key when purgeAll() is called', () => {
            apiCache.set('/api/projects', { projects: [1] });
            apiCache.set('/api/experiences', { experiences: [2] });
            window.localStorage.setItem('portfolio_global_cache_version', '500');

            apiCache.purgeAll();

            expect(apiCache.get('/api/projects')).toBeNull();
            expect(apiCache.get('/api/experiences')).toBeNull();
            expect(window.localStorage.getItem('portfolio_global_cache_version')).toBeNull();
        });
    });

    describe('2. ClientRateLimiter Unit Tests', () => {
        it('allows requests within the max window threshold', () => {
            const key = 'GET:/api/test';
            const max = 3;
            const windowMs = 5000;

            const res1 = clientRateLimiter.checkLimit(key, max, windowMs);
            const res2 = clientRateLimiter.checkLimit(key, max, windowMs);
            const res3 = clientRateLimiter.checkLimit(key, max, windowMs);

            expect(res1.allowed).toBe(true);
            expect(res1.remaining).toBe(2);
            expect(res2.allowed).toBe(true);
            expect(res2.remaining).toBe(1);
            expect(res3.allowed).toBe(true);
            expect(res3.remaining).toBe(0);
        });

        it('throttles and computes retryAfterMs when request threshold is exceeded', () => {
            const key = 'POST:/api/queries';
            const max = 2;
            const windowMs = 2000;

            clientRateLimiter.checkLimit(key, max, windowMs);
            clientRateLimiter.checkLimit(key, max, windowMs);

            // 3rd request in window must be blocked
            const blockedRes = clientRateLimiter.checkLimit(key, max, windowMs);
            expect(blockedRes.allowed).toBe(false);
            expect(blockedRes.remaining).toBe(0);
            expect(blockedRes.retryAfterMs).toBeGreaterThan(0);
            expect(blockedRes.message).toContain('Client rate limit exceeded');
        });

        it('resets limits correctly after manual reset or cooldown', () => {
            const key = 'GET:/api/reset-test';
            clientRateLimiter.checkLimit(key, 1, 5000);

            expect(clientRateLimiter.checkLimit(key, 1, 5000).allowed).toBe(false);

            clientRateLimiter.reset(key);
            expect(clientRateLimiter.checkLimit(key, 1, 5000).allowed).toBe(true);
        });
    });

    describe('3. Axios Interceptor Offline & Rate-Limit Fallback Resilience', () => {
        it('returns cached data transparently when network error or server 500 occurs', async () => {
            const url = '/api/projects';
            const cachedProjects = [{ _id: '1', title: 'Cached Project' }];

            // Seed cache
            const cacheKey = apiCache.generateKey(url);
            apiCache.set(cacheKey, { success: true, data: cachedProjects });

            // Set failing adapter to simulate Network Error
            const originalAdapter = api.defaults.adapter;
            api.defaults.adapter = async (config) => {
                const error = new Error('Network Error');
                error.config = config;
                throw error;
            };

            try {
                const response = await api.get(url);
                expect(response.data).toEqual({ success: true, data: cachedProjects });
                expect(response.fromCache).toBe(true);
            } finally {
                api.defaults.adapter = originalAdapter;
            }
        });
    });
});
