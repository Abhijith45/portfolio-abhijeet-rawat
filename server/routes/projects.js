const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../utils/cloudinary');

// GET /api/projects - Public: get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
        res.json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
});

// POST /api/projects - Admin: create project
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, techStack, github, demo, image, featured, order } = req.body;
        const project = await Project.create({
            title,
            description,
            techStack: Array.isArray(techStack)
                ? techStack
                : (techStack || '').split(',').map((t) => t.trim()).filter(Boolean),
            github: github || '',
            demo: demo || '',
            image: image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop',
            featured: featured !== undefined ? featured : true,
            order: Number(order) || 0,
        });

        res.status(201).json({ success: true, data: project });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT /api/projects/:id - Admin: update project
router.put('/:id', protect, async (req, res) => {
    try {
        const { title, description, techStack, github, demo, image, featured, order } = req.body;
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (techStack !== undefined) {
            updateData.techStack = Array.isArray(techStack)
                ? techStack
                : techStack.split(',').map((t) => t.trim()).filter(Boolean);
        }
        if (github !== undefined) updateData.github = github;
        if (demo !== undefined) updateData.demo = demo;
        if (image !== undefined) updateData.image = image;
        if (featured !== undefined) updateData.featured = featured;
        if (order !== undefined) updateData.order = Number(order);

        const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, data: project });
    } catch (err) {
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
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
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
        console.error(err);
        res.status(500).json({ success: false, message: err.message || 'Image upload failed' });
    }
});

module.exports = router;
