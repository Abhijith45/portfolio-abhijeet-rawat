const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Technology = require('./models/Technology');
const Resume = require('./models/Resume');
const Review = require('./models/Review');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas for seeding');

        // 1. Seed Admin User
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@abhijeetrawat.dev';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = await User.create({
                name: 'Abhijeet Rawat',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
            });
            console.log(`Created default Admin User: ${adminEmail} / ${adminPassword}`);
        } else {
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
                    github: 'https://github.com/abhijeet-rawat',
                    demo: 'https://example.com',
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop',
                    featured: true,
                    order: 1,
                },
                {
                    title: 'Analytics Dashboard',
                    description: 'Real-time data visualization tool for monitoring server health and application performance metrics.',
                    techStack: ['React.js', 'Tailwind CSS', 'D3.js', 'Redis'],
                    github: 'https://github.com/abhijeet-rawat',
                    demo: 'https://example.com',
                    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop',
                    featured: true,
                    order: 2,
                },
                {
                    title: 'CRM System',
                    description: 'Custom CRM built for a logistics company to manage client interaction and B2B tracking.',
                    techStack: ['Express', 'React.js', 'PostgreSQL'],
                    github: 'https://github.com/abhijeet-rawat',
                    demo: 'https://example.com',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop',
                    featured: true,
                    order: 3,
                },
                {
                    title: 'Data Porting Automation Tool',
                    description: 'Automation tool for migrating legacy database records into modern, cloud-native structures.',
                    techStack: ['JavaScript', 'Python', 'Node.js'],
                    github: 'https://github.com/abhijeet-rawat',
                    demo: 'https://example.com',
                    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop',
                    featured: true,
                    order: 4,
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

        // 4. Seed Resume link if none exist
        const resumeCount = await Resume.countDocuments();
        if (resumeCount === 0) {
            await Resume.create({
                title: 'Abhijeet Rawat - Full Stack Developer Resume',
                downloadUrl: 'https://drive.google.com/file/d/1Jlh8BsV3HuVy_DcsrTtsPv3e0-iaLOZa/view',
                driveFileId: '1Jlh8BsV3HuVy_DcsrTtsPv3e0-iaLOZa',
                version: '1.0',
                isActive: true,
            });
            console.log('Seeded default resume metadata');
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
