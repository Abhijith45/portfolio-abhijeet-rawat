import axios from 'axios';
import { apiCache } from './apiCache';
import { clientRateLimiter } from './rateLimiter';
import { logErrorToWebhook } from './logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    withCredentials: true, // Crucial for JWT HTTP-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Client-Side Rate Limiter & Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Attach Bearer token from sessionStorage if available (supports cross-domain auth)
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const token = window.sessionStorage.getItem('admin_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        const method = (config.method || 'get').toUpperCase();
        const url = config.url || '';
        const bucketKey = `${method}:${url}`;

        // Custom limits: e.g., max 8 submissions per 10s for POST/PUT, 40 per 10s for GET
        const maxLimit = method === 'GET' ? 40 : 8;
        const rateCheck = clientRateLimiter.checkLimit(bucketKey, maxLimit);

        if (!rateCheck.allowed) {
            // If it's a GET request and we have cached data, we can resolve from cache
            if (method === 'GET') {
                const cacheKey = apiCache.generateKey(url, config.params);
                const cached = apiCache.getRaw(cacheKey);
                if (cached?.data) {
                    // Attach cached response to config so adapter or error interceptor returns it
                    config.adapter = () =>
                        Promise.resolve({
                            data: cached.data,
                            status: 200,
                            statusText: 'OK (Client Rate Limited - Served from Cache)',
                            headers: { 'x-cache': 'HIT_RATE_LIMITED' },
                            config,
                        });
                    return config;
                }
            }

            return Promise.reject(new Error(rateCheck.message));
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Caching, Invalidation & Offline/429 Fallback
api.interceptors.response.use(
    (response) => {
        const method = (response.config?.method || 'get').toUpperCase();
        const url = response.config?.url || '';

        // Synchronize with server cache version if header is provided
        const serverCacheVer = response.headers?.['x-cache-version'];
        if (serverCacheVer) {
            apiCache.checkVersion(serverCacheVer);
        }

        // 1. Cache successful GET requests
        if (method === 'GET' && response.status >= 200 && response.status < 300) {
            const cacheKey = apiCache.generateKey(url, response.config.params);
            apiCache.set(cacheKey, response.data);
        }

        // 2. Invalidate cache on mutations (POST, PUT, DELETE)
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
            if (url.includes('project') || url.includes('/api/projects')) {
                apiCache.clear('project');
            }
            if (url.includes('technolog') || url.includes('/api/technologies')) {
                apiCache.clear('technolog');
            }
            if (url.includes('review') || url.includes('/api/reviews')) {
                apiCache.clear('review');
            }
            if (url.includes('quer') || url.includes('/api/queries')) {
                apiCache.clear('quer');
            }
            if (url.includes('resume') || url.includes('/api/resume')) {
                apiCache.clear('resume');
                apiCache.clear('user');
            }
            if (url.includes('experience') || url.includes('/api/experiences')) {
                apiCache.clear('experience');
            }
            if (url.includes('user') || url.includes('/api/user')) {
                apiCache.clear('user');
            }
            if (url.includes('purge-cache')) {
                apiCache.purgeAll();
            }
        }

        return response;
    },
    (error) => {
        const config = error.config || {};
        const method = (config.method || 'get').toUpperCase();
        const url = config.url || '';

        // Check if fallback cache is available for GET requests (offline, 429, 500, timeout)
        if (method === 'GET' && url) {
            const cacheKey = apiCache.generateKey(url, config.params);
            const cached = apiCache.getRaw(cacheKey);
            if (cached?.data) {
                return Promise.resolve({
                    data: cached.data,
                    status: 200,
                    statusText: 'OK (Offline / Error Fallback Cache)',
                    headers: { 'x-cache': 'HIT_FALLBACK' },
                    config,
                    fromCache: true,
                });
            }
        }

        const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
        const statusCode = error.response?.status || 0;

        // Clear expired session token if unauthorized
        if (statusCode === 401 && typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.removeItem('admin_token');
        }

        // Log critical network / server errors to webhook in fire-and-forget mode
        if (statusCode >= 500 || statusCode === 0) {
            try {
                logErrorToWebhook({
                    severity: 'ERROR',
                    component: `apiClient:${method}:${url}`,
                    stack: error.stack || 'N/A',
                    statusCode,
                    message: errorMsg,
                });
            } catch {
                // Safeguard against logging issues
            }
        }

        return Promise.reject(new Error(errorMsg));
    }
);

/**
 * Deduplicated GET helper to ensure concurrent identical requests share a single network call.
 */
const deduplicatedGet = (url, params) => {
    const cacheKey = apiCache.generateKey(url, params);
    return apiCache.deduplicate(cacheKey, () => api.get(url, { params }));
};

// Admin Management & System APIs
export const adminApi = {
    purgeCache: () => api.post('/api/admin/purge-cache'),
    getCacheStatus: () => api.get('/api/admin/cache-status'),
};

// User Profile & Social Links API
export const userApi = {
    getProfile: () => deduplicatedGet('/api/user/profile'),
    updateProfile: (data) => api.put('/api/user/profile', data),
};

// Auth API
export const authApi = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    getMe: () => deduplicatedGet('/api/auth/me'),
    logout: () => api.post('/api/auth/logout'),
};

// Projects API
export const projectsApi = {
    getFeatured: (params) => deduplicatedGet('/api/projects/featured', params),
    getAll: (params) => deduplicatedGet('/api/projects', params),
    create: (data) => api.post('/api/projects', data),
    update: (id, data) => api.put(`/api/projects/${id}`, data),
    delete: (id) => api.delete(`/api/projects/${id}`),
    uploadImage: (formData) =>
        api.post('/api/projects/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    verifyUrl: (url) => api.post('/api/projects/verify-url', { url }),
};

// Technologies API
export const technologiesApi = {
    getAll: () => deduplicatedGet('/api/technologies'),
    create: (data) => api.post('/api/technologies', data),
    update: (id, data) => api.put(`/api/technologies/${id}`, data),
    delete: (id) => api.delete(`/api/technologies/${id}`),
    uploadIcon: (formData) =>
        api.post('/api/technologies/upload-icon', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};

// Reviews API
export const reviewsApi = {
    getApproved: () => deduplicatedGet('/api/reviews'),
    getAll: () => deduplicatedGet('/api/reviews/all'),
    create: (data) => api.post('/api/reviews', data),
    update: (id, data) => api.put(`/api/reviews/${id}`, data),
    delete: (id) => api.delete(`/api/reviews/${id}`),
};

// Contact Queries API
export const queriesApi = {
    submit: (data) => api.post('/api/queries', data),
    getAll: (params) => deduplicatedGet('/api/queries', params),
    update: (id, data) => api.put(`/api/queries/${id}`, data),
    delete: (id) => api.delete(`/api/queries/${id}`),
};

// Resume API (Backward Compatible)
export const resumeApi = {
    getActive: () => deduplicatedGet('/api/user/profile'),
    update: (data) => api.put('/api/user/profile', { resumeURL: data.downloadUrl || data.resumeURL }),
};

// Experiences API
export const experiencesApi = {
    getAll: () => deduplicatedGet('/api/experiences'),
    create: (data) => api.post('/api/experiences', data),
    update: (id, data) => api.put(`/api/experiences/${id}`, data),
    delete: (id) => api.delete(`/api/experiences/${id}`),
};

export { apiCache } from './apiCache';
export { clientRateLimiter } from './rateLimiter';
export default api;
