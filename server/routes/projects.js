const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../utils/cloudinary');
const serverCache = require('../utils/cacheManager');

// POST /api/projects/verify-url - Verify if URL is accessible
router.post('/verify-url', async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ success: false, accessible: false, message: 'URL is required' });
    }

    const trimmedUrl = url.trim();
    if (!/^https?:\/\//i.test(trimmedUrl)) {
        return res.status(400).json({
            success: false,
            accessible: false,
            message: 'URL must start with http:// or https://',
        });
    }

    try {
        const parsed = new URL(trimmedUrl);
        if (!parsed.hostname || !parsed.hostname.includes('.')) {
            return res.status(400).json({
                success: false,
                accessible: false,
                message: 'Invalid domain hostname',
            });
        }
    } catch {
        return res.status(400).json({
            success: false,
            accessible: false,
            message: 'Invalid URL format',
        });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        // First attempt a fast HEAD request with a realistic User-Agent
        let response;
        try {
            response = await fetch(trimmedUrl, {
                method: 'HEAD',
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                },
            });
        } catch (headErr) {
            // Some servers reject HEAD requests with 405 or connection reset, fallback to GET
            if (headErr.name !== 'AbortError') {
                response = await fetch(trimmedUrl, {
                    method: 'GET',
                    signal: controller.signal,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': '*/*',
                    },
                });
            } else {
                throw headErr;
            }
        } finally {
            clearTimeout(timeoutId);
        }

        // Accept 2xx, 3xx, and client auth challenge codes 401/403/405/429 as reachable host
        if (response.status >= 200 && response.status < 400) {
            return res.json({ success: true, accessible: true, statusCode: response.status, message: 'URL is accessible' });
        } else if ([401, 403, 405, 429].includes(response.status)) {
            return res.json({ success: true, accessible: true, statusCode: response.status, message: 'Host is reachable' });
        } else if (response.status === 404) {
            return res.json({ success: false, accessible: false, statusCode: 404, message: 'Page not found (404)' });
        } else {
            return res.json({ success: false, accessible: false, statusCode: response.status, message: `Server returned status ${response.status}` });
        }
    } catch (err) {
        let msg = 'Unable to reach URL';
        if (err.name === 'AbortError') {
            msg = 'Connection timed out while trying to reach URL';
        } else if (err.code === 'ENOTFOUND') {
            msg = 'Domain name could not be resolved (DNS failure)';
        } else if (err.code === 'ECONNREFUSED') {
            msg = 'Connection refused by server';
        } else if (err.message) {
            msg = err.message;
        }

        return res.json({
            success: false,
            accessible: false,
            message: msg,
        });
    }
});

// GET /api/projects/featured - Public: get top featured projects (default limit: 6) & hasMore flag
router.get('/featured', async (req, res) => {
    try {
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 50);
        const query = {
            $or: [
                { isFeatured: true },
                { isFeatured: { $exists: false } },
            ],
        };

        const cacheKey = `projects:featured:limit=${limit}`;
        const cached = serverCache.get(cacheKey);

        res.setHeader('x-cache-version', String(serverCache.getCacheVersion()));
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

        if (cached) {
            res.setHeader('x-server-cache', 'HIT');
            return res.json(cached);
        }

        const [totalProjects, featuredCount, featuredProjects] = await Promise.all([
            Project.countDocuments(),
            Project.countDocuments(query),
            Project.find(query).sort({ createdAt: -1 }).limit(limit).lean(),
        ]);

        const hasMore = totalProjects > limit || featuredCount > limit;

        const payload = {
            success: true,
            count: featuredProjects.length,
            totalProjects,
            featuredCount,
            hasMore,
            data: featuredProjects,
        };

        serverCache.set(cacheKey, payload);
        res.setHeader('x-server-cache', 'MISS');
        res.json(payload);
    } catch (err) {
        console.error('Failed to fetch featured projects:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch featured projects' });
    }
});

// GET /api/projects - Public: get all projects
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.isFeatured !== undefined) {
            query.isFeatured = req.query.isFeatured === 'true';
        } else if (req.query.featured !== undefined) {
            query.isFeatured = req.query.featured === 'true';
        }

        const cacheKey = `projects:${JSON.stringify(query)}`;
        const cached = serverCache.get(cacheKey);

        res.setHeader('x-cache-version', String(serverCache.getCacheVersion()));
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

        if (cached) {
            res.setHeader('x-server-cache', 'HIT');
            return res.json(cached);
        }

        const projects = await Project.find(query).sort({ createdAt: -1 }).lean();
        const payload = { success: true, count: projects.length, data: projects };

        serverCache.set(cacheKey, payload);
        res.setHeader('x-server-cache', 'MISS');
        res.json(payload);
    } catch (err) {
        console.error('Failed to fetch projects:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
});

// POST /api/projects - Admin: create project
router.post('/', protect, async (req, res) => {
    try {
        const {
            title,
            description,
            techStack,
            githubURL,
            github,
            liveURL,
            demo,
            imageURL,
            image,
            engineeringOverview,
            overview,
            isFeatured,
            featured,
        } = req.body;

        const resolvedGithub = githubURL !== undefined ? githubURL : (github || '');
        const resolvedLive = liveURL !== undefined ? liveURL : (demo || '');
        const resolvedImage = imageURL !== undefined ? imageURL : (image || '');
        const resolvedOverview = engineeringOverview !== undefined ? engineeringOverview : (overview || '');
        const resolvedFeatured = isFeatured !== undefined ? isFeatured : (featured !== undefined ? featured : true);

        const project = await Project.create({
            title: (title || '').trim(),
            description: (description || '').trim(),
            techStack: Array.isArray(techStack)
                ? techStack
                : (techStack || '').split(',').map((t) => t.trim()).filter(Boolean),
            githubURL: (resolvedGithub || '').trim(),
            liveURL: (resolvedLive || '').trim(),
            imageURL: (resolvedImage || '').trim(),
            engineeringOverview: (resolvedOverview || '').trim(),
            isFeatured: Boolean(resolvedFeatured),
        });

        serverCache.clearPattern('projects');
        serverCache.incrementCacheVersion();

        res.status(201).json({ success: true, data: project });
    } catch (err) {
        console.error('Create project error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT /api/projects/:id - Admin: update project
router.put('/:id', protect, async (req, res) => {
    try {
        const {
            title,
            description,
            techStack,
            githubURL,
            github,
            liveURL,
            demo,
            imageURL,
            image,
            engineeringOverview,
            overview,
            isFeatured,
            featured,
        } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (techStack !== undefined) {
            updateData.techStack = Array.isArray(techStack)
                ? techStack
                : techStack.split(',').map((t) => t.trim()).filter(Boolean);
        }

        const resolvedGithub = githubURL !== undefined ? githubURL : github;
        if (resolvedGithub !== undefined) updateData.githubURL = resolvedGithub.trim();

        const resolvedLive = liveURL !== undefined ? liveURL : demo;
        if (resolvedLive !== undefined) updateData.liveURL = resolvedLive.trim();

        const resolvedImage = imageURL !== undefined ? imageURL : image;
        if (resolvedImage !== undefined) updateData.imageURL = resolvedImage.trim();

        const resolvedOverview = engineeringOverview !== undefined ? engineeringOverview : overview;
        if (resolvedOverview !== undefined) updateData.engineeringOverview = resolvedOverview.trim();

        const resolvedFeatured = isFeatured !== undefined ? isFeatured : featured;
        if (resolvedFeatured !== undefined) updateData.isFeatured = Boolean(resolvedFeatured);

        const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        serverCache.clearPattern('projects');
        serverCache.incrementCacheVersion();

        res.json({ success: true, data: project });
    } catch (err) {
        console.error('Update project error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE /api/projects/:id - Admin: delete project
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        serverCache.clearPattern('projects');
        serverCache.incrementCacheVersion();

        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Delete project error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/projects/upload-image - Admin: upload image to Cloudinary
router.post('/upload-image', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file uploaded' });
        }
        const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects');
        res.json({ success: true, url: result.secure_url });
    } catch (err) {
        console.error('Upload image error:', err);
        res.status(500).json({ success: false, message: err.message || 'Image upload failed' });
    }
});

module.exports = router;
