const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Technology = require('./models/Technology');
const Review = require('./models/Review');
const Experience = require('./models/Experience');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas for seeding');

        // 1. Seed Admin User with social profiles and resume
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.dev';
        const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = await User.create({
                name: 'Admin Developer',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                resumeURL: 'https://example.com/resume.pdf',
                githubURL: 'https://github.com',
                linkedInURL: 'https://linkedin.com',
                leetCodeURL: 'https://leetcode.com',
                HackerRankURL: 'https://hackerrank.com',
                mobileNumber: '+10000000000',
            });
            console.log(`Created default Admin User: ${adminEmail}`);
        } else {
            // Update missing fields if needed
            let modified = false;
            if (!admin.resumeURL) { admin.resumeURL = 'https://example.com/resume.pdf'; modified = true; }
            if (!admin.githubURL) { admin.githubURL = 'https://github.com'; modified = true; }
            if (!admin.linkedInURL) { admin.linkedInURL = 'https://linkedin.com'; modified = true; }
            if (!admin.leetCodeURL) { admin.leetCodeURL = 'https://leetcode.com'; modified = true; }
            if (!admin.HackerRankURL) { admin.HackerRankURL = 'https://hackerrank.com'; modified = true; }
            if (!admin.mobileNumber) { admin.mobileNumber = '+10000000000'; modified = true; }
            if (modified) await admin.save();
            console.log(`Admin user already exists: ${adminEmail}`);
        }

        // 2. Seed Default Projects if none exist
        const projectCount = await Project.countDocuments();
        if (projectCount === 0) {
            const initialProjects = [
                {
                    title: 'Lead Generation Platform',
                    description: 'A full-scale platform for managing and qualifying B2B leads with automated outreach capabilities.',
                    techStack: ['React', 'Node.js', 'MongoDB', 'AWS'],
                    githubURL: 'https://github.com',
                    liveURL: 'https://example.com',
                    imageURL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop',
                    engineeringOverview: 'High-throughput lead ingestion pipeline connecting webhooks, scoring algorithms, and automated email nurturing sequences.',
                    isFeatured: true,
                },
                {
                    title: 'Analytics Dashboard',
                    description: 'Real-time data visualization tool for monitoring server health and application performance metrics.',
                    techStack: ['React.js', 'Material-UI', 'D3.js', 'Redis'],
                    githubURL: 'https://github.com',
                    liveURL: 'https://example.com',
                    imageURL: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop',
                    engineeringOverview: 'Sub-second real-time telemetry streaming architecture using WebSockets and Redis pub/sub channels.',
                    isFeatured: true,
                },
                {
                    title: 'CRM System',
                    description: 'Custom CRM built for logistics operations to manage client interaction and shipment tracking.',
                    techStack: ['Express', 'React.js', 'PostgreSQL'],
                    githubURL: 'https://github.com',
                    liveURL: 'https://example.com',
                    imageURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop',
                    engineeringOverview: 'Role-based access control and live dispatch tracking built on top of relational database constraints.',
                    isFeatured: true,
                },
                {
                    title: 'Data Migration Automation Tool',
                    description: 'Automation tool for migrating legacy database records into modern, cloud-native structures.',
                    techStack: ['JavaScript', 'Python', 'Node.js'],
                    githubURL: 'https://github.com',
                    liveURL: 'https://example.com',
                    imageURL: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop',
                    engineeringOverview: 'ETL extraction and pipeline synchronization with automatic chunking and retry handlers.',
                    isFeatured: true,
                },
            ];
            await Project.insertMany(initialProjects);
            console.log('Seeded initial projects');
        }

        // 3. Seed Default Technologies if none exist
        const techCount = await Technology.countDocuments();
        if (techCount === 0) {
            const initialTech = [
                // Frontend
                { name: 'React.js', category: 'Frontend', proficiency: 'Advanced', order: 1 },
                { name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 'Advanced', order: 2 },
                { name: 'HTML5 & CSS3', category: 'Frontend', proficiency: 'Advanced', order: 3 },
                { name: 'Material UI', category: 'Frontend', proficiency: 'Proficient', order: 4 },
                { name: 'Framer Motion', category: 'Frontend', proficiency: 'Proficient', order: 5 },
                // Backend
                { name: 'Node.js', category: 'Backend', proficiency: 'Advanced', order: 1 },
                { name: 'Express.js', category: 'Backend', proficiency: 'Advanced', order: 2 },
                { name: 'REST APIs', category: 'Backend', proficiency: 'Advanced', order: 3 },
                // Database
                { name: 'MongoDB & Mongoose', category: 'Database', proficiency: 'Advanced', order: 1 },
                { name: 'PostgreSQL', category: 'Database', proficiency: 'Proficient', order: 2 },
                { name: 'Redis', category: 'Database', proficiency: 'Familiar', order: 3 },
                // Tools
                { name: 'Git & GitHub', category: 'Tools & DevOps', proficiency: 'Advanced', order: 1 },
                { name: 'Postman', category: 'Tools & DevOps', proficiency: 'Advanced', order: 2 },
                { name: 'Docker', category: 'Tools & DevOps', proficiency: 'Familiar', order: 3 },
                { name: 'AWS / Cloudinary', category: 'Tools & DevOps', proficiency: 'Proficient', order: 4 },
            ];
            await Technology.insertMany(initialTech);
            console.log('Seeded initial technologies');
        }

        // 4. Seed Default Experiences if none exist
        const experienceCount = await Experience.countDocuments();
        if (experienceCount === 0) {
            const initialExperiences = [
                {
                    company: 'Tech Innovations Inc.',
                    role: 'Full Stack JavaScript Developer',
                    period: '2024 – Present',
                    active: true,
                    location: 'Remote',
                    responsibilities: [
                        'Architected and deployed responsive full-stack web applications and microservices.',
                        'Optimized REST API endpoints and implemented in-memory caching to reduce latency.',
                        'Collaborated with cross-functional teams to build modular UI component libraries.'
                    ],
                    skills: ['JavaScript', 'React.js', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
                    order: 1,
                },
                {
                    company: 'Digital Solutions Lab',
                    role: 'Frontend Developer Intern',
                    period: '2023 – 2024',
                    active: false,
                    location: 'Remote',
                    responsibilities: [
                        'Built high-performance, accessible user interfaces from Figma design specifications.',
                        'Implemented responsive designs and state management workflows.',
                        'Participated in code reviews and test coverage expansion.'
                    ],
                    skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Git'],
                    order: 2,
                },
            ];
            await Experience.insertMany(initialExperiences);
            console.log('Seeded initial experiences');
        }

        // 5. Seed an approved initial review if none exist
        const reviewCount = await Review.countDocuments();
        if (reviewCount === 0) {
            await Review.create({
                name: 'Alex Morgan',
                company: 'Engineering Lead @ TechCorp',
                message: 'Delivered an exceptional full-stack platform with clean, maintainable code and stellar performance. Highly recommended!',
                rating: 5,
                approved: true,
            });
            console.log('Seeded default approved review');
        }

        console.log('Database seeding finished successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
