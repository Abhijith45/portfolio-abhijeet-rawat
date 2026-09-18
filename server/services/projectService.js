const projectRepository = require('../repositories/projectRepository');
const serverCache = require('../utils/cacheManager');
const { validateSafeUrl } = require('../utils/urlValidator');

class ProjectService {
    async getFeatured(limit = 6) {
        const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 6, 1), 50);
        const query = {
            $or: [{ isFeatured: true }, { isFeatured: { $exists: false } }],
            isVisible: { $ne: false },
        };

        const cacheKey = `projects:featured:limit=${safeLimit}`;
        const cached = serverCache.get(cacheKey);
        if (cached) {
            return { data: cached, fromCache: true };
        }

        const [totalProjects, featuredCount, featuredProjects] = await Promise.all([
            projectRepository.count({ isVisible: { $ne: false } }),
            projectRepository.count(query),
            projectRepository.find(query, { sort: { order: 1, createdAt: -1 }, limit: safeLimit }),
        ]);

        const hasMore = totalProjects > safeLimit || featuredCount > safeLimit;
        const payload = {
            success: true,
            count: featuredProjects.length,
            totalProjects,
            featuredCount,
            hasMore,
            data: featuredProjects,
        };

        serverCache.set(cacheKey, payload);
        return { data: payload, fromCache: false };
    }

    async getAll(queryParams = {}) {
        const query = {};
        if (queryParams.isFeatured !== undefined) {
            query.isFeatured = queryParams.isFeatured === 'true' || queryParams.isFeatured === true;
        } else if (queryParams.featured !== undefined) {
            query.isFeatured = queryParams.featured === 'true' || queryParams.featured === true;
        }

        if (queryParams.isVisible !== undefined) {
            query.isVisible = queryParams.isVisible === 'true' || queryParams.isVisible === true;
        } else if (queryParams.visible !== undefined) {
            query.isVisible = queryParams.visible === 'true' || queryParams.visible === true;
        } else if (queryParams.all !== 'true' && queryParams.all !== true && queryParams.admin !== 'true' && queryParams.admin !== true) {
            // Default for public portfolio queries: fetch only visible projects
            query.isVisible = { $ne: false };
        }

        const cacheKey = `projects:${JSON.stringify(query)}`;
        const cached = serverCache.get(cacheKey);
        if (cached) {
            return { data: cached, fromCache: true };
        }

        const projects = await projectRepository.find(query, { sort: { order: 1, createdAt: -1 } });
        const payload = { success: true, count: projects.length, data: projects };

        serverCache.set(cacheKey, payload);
        return { data: payload, fromCache: false };
    }

    async createProject(body) {
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
            isVisible,
            visible,
            order,
        } = body;

        const resolvedGithub = githubURL !== undefined ? githubURL : (github || '');
        const resolvedLive = liveURL !== undefined ? liveURL : (demo || '');
        const resolvedImage = imageURL !== undefined ? imageURL : (image || '');
        const resolvedOverview = engineeringOverview !== undefined ? engineeringOverview : (overview || '');
        const resolvedFeatured = isFeatured !== undefined ? isFeatured : (featured !== undefined ? featured : true);
        const resolvedVisible = isVisible !== undefined ? isVisible : (visible !== undefined ? visible : true);

        // Calculate and shift order rank
        let targetOrder;
        if (order !== undefined && order !== null && order !== '' && Number(order) > 0) {
            targetOrder = Math.max(1, parseInt(order, 10) || 1);
            await projectRepository.updateMany({ order: { $gte: targetOrder } }, { $inc: { order: 1 } });
        } else {
            const maxItem = await projectRepository.findOne({}, { sort: { order: -1 } });
            targetOrder = (maxItem && typeof maxItem.order === 'number' && maxItem.order >= 1) ? maxItem.order + 1 : 1;
        }

        const project = await projectRepository.create({
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
            isVisible: Boolean(resolvedVisible),
            order: targetOrder,
        });

        serverCache.clearPattern('projects');
        const newVersion = serverCache.incrementCacheVersion();

        return { project, cacheVersion: newVersion };
    }

    async updateProject(id, body) {
        const existing = await projectRepository.findById(id);
        if (!existing) {
            throw new Error('Project not found');
        }

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
            isVisible,
            visible,
            order,
        } = body;

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

        const resolvedVisible = isVisible !== undefined ? isVisible : visible;
        if (resolvedVisible !== undefined) updateData.isVisible = Boolean(resolvedVisible);

        // Auto-shift if order is updated
        if (order !== undefined && order !== null && order !== '') {
            const oldOrder = existing.order || 1;
            const newOrder = Math.max(1, parseInt(order, 10) || 1);
            if (newOrder !== oldOrder) {
                if (newOrder < oldOrder) {
                    await projectRepository.updateMany(
                        { _id: { $ne: id }, order: { $gte: newOrder, $lt: oldOrder } },
                        { $inc: { order: 1 } }
                    );
                } else {
                    await projectRepository.updateMany(
                        { _id: { $ne: id }, order: { $gt: oldOrder, $lte: newOrder } },
                        { $inc: { order: -1 } }
                    );
                }
                updateData.order = newOrder;
            }
        }

        const project = await projectRepository.updateById(id, updateData);

        serverCache.clearPattern('projects');
        const newVersion = serverCache.incrementCacheVersion();

        return { project, cacheVersion: newVersion };
    }

    async deleteProject(id) {
        const existing = await projectRepository.findById(id);
        if (!existing) {
            throw new Error('Project not found');
        }

        await projectRepository.deleteById(id);

        if (typeof existing.order === 'number' && existing.order >= 1) {
            await projectRepository.updateMany({ order: { $gt: existing.order } }, { $inc: { order: -1 } });
        }

        serverCache.clearPattern('projects');
        const newVersion = serverCache.incrementCacheVersion();

        return { success: true, cacheVersion: newVersion };
    }

    async verifyUrl(url) {
        // 1. Strict SSRF check & DNS pre-resolution
        const { parsedUrl } = await validateSafeUrl(url);
        const trimmedUrl = parsedUrl.toString();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        try {
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
            }

            if (response.status >= 200 && response.status < 400) {
                return { success: true, accessible: true, statusCode: response.status, message: 'URL is accessible' };
            } else if ([401, 403, 405, 429].includes(response.status)) {
                return { success: true, accessible: true, statusCode: response.status, message: 'Host is reachable' };
            } else if (response.status === 404) {
                return { success: false, accessible: false, statusCode: 404, message: 'Page not found (404)' };
            } else {
                return { success: false, accessible: false, statusCode: response.status, message: `Server returned status ${response.status}` };
            }
        } finally {
            clearTimeout(timeoutId);
        }
    }
}

module.exports = new ProjectService();
