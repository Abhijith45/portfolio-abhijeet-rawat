import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    withCredentials: true, // Crucial for JWT HTTP-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for unified error parsing
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject(new Error(errorMsg));
    }
);

// Auth API
export const authApi = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    getMe: () => api.get('/api/auth/me'),
    logout: () => api.post('/api/auth/logout'),
};

// Projects API
export const projectsApi = {
    getAll: () => api.get('/api/projects'),
    create: (data) => api.post('/api/projects', data),
    update: (id, data) => api.put(`/api/projects/${id}`, data),
    delete: (id) => api.delete(`/api/projects/${id}`),
    uploadImage: (formData) =>
        api.post('/api/projects/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};

// Technologies API
export const technologiesApi = {
    getAll: () => api.get('/api/technologies'),
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
    getApproved: () => api.get('/api/reviews'),
    getAll: () => api.get('/api/reviews/all'),
    create: (data) => api.post('/api/reviews', data),
    update: (id, data) => api.put(`/api/reviews/${id}`, data),
    delete: (id) => api.delete(`/api/reviews/${id}`),
};

// Contact Queries API
export const queriesApi = {
    submit: (data) => api.post('/api/queries', data),
    getAll: (params) => api.get('/api/queries', { params }),
    update: (id, data) => api.put(`/api/queries/${id}`, data),
    delete: (id) => api.delete(`/api/queries/${id}`),
};

// Resume API
export const resumeApi = {
    getActive: () => api.get('/api/resume'),
    update: (data) => api.post('/api/resume', data),
};

// Experiences API
export const experiencesApi = {
    getAll: () => api.get('/api/experiences'),
    create: (data) => api.post('/api/experiences', data),
    update: (id, data) => api.put(`/api/experiences/${id}`, data),
    delete: (id) => api.delete(`/api/experiences/${id}`),
};

export default api;
