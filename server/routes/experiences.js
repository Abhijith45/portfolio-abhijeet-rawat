const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { protect } = require('../middleware/auth');

const defaultExperiences = [
    {
        company: 'Tiger Education Services',
        role: 'JavaScript Developer',
        period: 'Feb 2025 – Present',
        active: true,
        location: 'Lucknow, India',
        responsibilities: [
            'Building MERN stack applications and educational platforms using Next.js and Node.js',
            'Improving platform performance by 40% through code splitting and asset optimization',
            'Implementing real-time quiz engines and student progress dashboards using WebSockets',
        ],
        skills: ['JavaScript', 'React.js', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'WebSockets'],
        order: 1,
    },
    {
        company: 'Tiger Education Services',
        role: 'Web Developer Intern',
        period: 'Nov 2024 – Jan 2025',
        active: false,
        location: 'Lucknow, India',
        responsibilities: [
            'Developed responsive landing pages and UI components using Tailwind CSS',
            'Collaborated with the design team to translate Figma prototypes into functional code',
        ],
        skills: ['HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript', 'Git', 'Responsive Design'],
        order: 2,
    },
];

// GET /api/experiences - Public: get all experiences
router.get('/', async (req, res) => {
    try {
        let experiences = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();

        // Auto-seed if database collection is empty
        if (!experiences || experiences.length === 0) {
            await Experience.insertMany(defaultExperiences);
            experiences = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();
        }

        res.json({ success: true, count: experiences.length, data: experiences });
    } catch (err) {
        console.error('Error fetching experiences:', err);
        // Fallback to default in-memory list on database failure
        res.json({ success: true, count: defaultExperiences.length, data: defaultExperiences });
    }
});

// POST /api/experiences - Admin: create experience
router.post('/', protect, async (req, res) => {
    try {
        const { company, role, period, active, location, responsibilities, skills, order } = req.body;
        const experience = await Experience.create({
            company,
            role,
            period,
            active: active !== undefined ? active : false,
            location: location || 'Lucknow, India',
            responsibilities: Array.isArray(responsibilities)
                ? responsibilities
                : (responsibilities || '').split('\n').map((r) => r.trim()).filter(Boolean),
            skills: Array.isArray(skills)
                ? skills
                : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
            order: Number(order) || 0,
        });

        res.status(201).json({ success: true, data: experience });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT /api/experiences/:id - Admin: update experience
router.put('/:id', protect, async (req, res) => {
    try {
        const { company, role, period, active, location, responsibilities, skills, order } = req.body;
        const updateData = {};
        if (company !== undefined) updateData.company = company;
        if (role !== undefined) updateData.role = role;
        if (period !== undefined) updateData.period = period;
        if (active !== undefined) updateData.active = active;
        if (location !== undefined) updateData.location = location;
        if (responsibilities !== undefined) {
            updateData.responsibilities = Array.isArray(responsibilities)
                ? responsibilities
                : responsibilities.split('\n').map((r) => r.trim()).filter(Boolean);
        }
        if (skills !== undefined) {
            updateData.skills = Array.isArray(skills)
                ? skills
                : skills.split(',').map((s) => s.trim()).filter(Boolean);
        }
        if (order !== undefined) updateData.order = Number(order);

        const experience = await Experience.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!experience) {
            return res.status(404).json({ success: false, message: 'Experience not found' });
        }

        res.json({ success: true, data: experience });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE /api/experiences/:id - Admin: delete experience
router.delete('/:id', protect, async (req, res) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);
        if (!experience) {
            return res.status(404).json({ success: false, message: 'Experience not found' });
        }
        res.json({ success: true, message: 'Experience deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete experience' });
    }
});

module.exports = router;
