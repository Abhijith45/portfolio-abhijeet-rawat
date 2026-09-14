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
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = await User.create({
                name: 'Abhijeet Rawat',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                resumeURL: 'https://docs.google.com/document/d/1azXMe6AKB34DnnR3ogXqRry5aSpHL5IUCqf5qV7FqgA/edit?usp=sharing',
                githubURL: 'https://github.com/abhijeet-rawat',
                linkedInURL: 'https://linkedin.com/in/abhijeet-rawat',
                leetCodeURL: 'https://leetcode.com/abhijeet-rawat',
                HackerRankURL: 'https://hackerrank.com/abhijeet-rawat',
                mobileNumber: '+919999999999',
            });
            console.log(`Created default Admin User: ${adminEmail} / ${adminPassword}`);
        } else {
            // Update missing fields if needed
            let modified = false;
            if (!admin.resumeURL) { admin.resumeURL = 'https://docs.google.com/document/d/1azXMe6AKB34DnnR3ogXqRry5aSpHL5IUCqf5qV7FqgA/edit?usp=sharing'; modified = true; }
            if (!admin.githubURL) { admin.githubURL = 'https://github.com/abhijeet-rawat'; modified = true; }
            if (!admin.linkedInURL) { admin.linkedInURL = 'https://linkedin.com/in/abhijeet-rawat'; modified = true; }
            if (!admin.leetCodeURL) { admin.leetCodeURL = 'https://leetcode.com/abhijeet-rawat'; modified = true; }
            if (!admin.HackerRankURL) { admin.HackerRankURL = 'https://hackerrank.com/abhijeet-rawat'; modified = true; }
            if (!admin.mobileNumber) { admin.mobileNumber = '+919999999999'; modified = true; }
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
                    githubURL: 'https://github.com/abhijeet-rawat',
                    liveURL: 'https://example.com',
                    imageURL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop',
                    engineeringOverview: 'High-throughput lead ingestion pipeline connecting webhooks, scoring algorithms, and automated email nurturing sequences.',
                    isFeatured: true,
                },
                {
                    title: 'Analytics Dashboard',
                    description: 'Real-time data visualization tool for monitoring server health and application performance metrics.',
                    techStack: ['React.js', 'Tailwind CSS', 'D3.js', 'Redis'],
                    githubURL: 'https://github.com/abhijeet-rawat',
                    liveURL: 'https://example.com',
                    imageURL: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop',
                    engineeringOverview: 'Sub-second real-time telemetry streaming architecture using WebSockets and Redis pub/sub channels.',
                    isFeatured: true,
                },
                {
                    title: 'CRM System',
                    description: 'Custom CRM built for a logistics company to manage client interaction and B2B tracking.',
                    techStack: ['Express', 'React.js', 'PostgreSQL'],
                    githubURL: 'https://github.com/abhijeet-rawat',
                    liveURL: 'https://example.com',
                    imageURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop',
                    engineeringOverview: 'Role-based access control and live dispatch tracking built on top of relational database constraints.',
                    isFeatured: true,
                },
                {
                    title: 'Data Porting Automation Tool',
                    description: 'Automation tool for migrating legacy database records into modern, cloud-native structures.',
                    techStack: ['JavaScript', 'Python', 'Node.js'],
                    githubURL: 'https://github.com/abhijeet-rawat',
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
                { name: 'Material UI / Tailwind', category: 'Frontend', proficiency: 'Proficient', order: 4 },
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
                    company: 'Tiger Education Services (Edhike)',
                    role: 'JavaScript Developer',
                    period: 'Feb 2025 – July 2026',
                    active: false,
                    location: 'Lucknow, India',
                    responsibilities: [
                        'Worked on internal applications, lead-generation websites, integrations and data workflows used across the business.',
                        'Built and maintained features for lead collection, processing and distribution across client systems.',
                        'Developed tools that connected internal workflows with client APIs, Google Sheets and other external services.',
                        'Worked on web applications and internal CRM workflows for managing and distributing leads.',
                        'Built automation around incoming leads, including routing logic and scheduled distribution requirements.',
                        'Worked with Cloudflare, Firebase, Google Apps Script, logging systems and API integrations across multiple projects.'
                    ],
                    skills: ['JavaScript', 'React.js', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'WebSockets'],
                    order: 1,
                },
                {
                    company: 'Tiger Education Services (Edhike)',
                    role: 'Web Developer Intern',
                    period: 'Nov 2024 – Jan 2025',
                    active: false,
                    location: 'Lucknow, India',
                    responsibilities: [
                        'Built responsive web pages and reusable UI components.',
                        'Worked with the design team to translate Figma designs into functional interfaces.',
                        'Implemented frontend functionality using JavaScript, HTML, CSS and Tailwind CSS.',
                        'Supported website updates, debugging and integration work across company projects.'
                    ],
                    skills: ['HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript', 'Git', 'Responsive Design'],
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
                company: 'Tech Lead @ CloudScale',
                message: 'Abhijeet delivered an exceptional full-stack platform with clean, maintainable code and stellar performance. Highly recommended!',
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
