import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import ProjectCard from '../../components/ProjectCard';

const projects = [
    {
        title: 'Lead Generation Platform',
        description: 'A full-scale platform for managing and qualifying B2B leads with automated outreach capabilities.',
        techStack: ['React', 'Node.js', 'MongoDB', 'AWS'],
        github: 'https://github.com/abhijeet-rawat',
        demo: '#',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop',
    },
    {
        title: 'Analytics Dashboard',
        description: 'Real-time data visualization tool for monitoring server health and application performance metrics.',
        techStack: ['React.js', 'Tailwind CSS', 'D3.js', 'Redis'],
        github: 'https://github.com/abhijeet-rawat',
        demo: '#',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop',
    },
    {
        title: 'CRM System',
        description: 'Custom CRM built for a logistics company to manage client interaction and B2B tracking.',
        techStack: ['Express', 'React.js', 'PostgreSQL'],
        github: 'https://github.com/abhijeet-rawat',
        demo: '#',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop',
    },
    {
        title: 'Data Porting Automation Tool',
        description: 'Automation tool for migrating legacy database records into modern, cloud-native structures.',
        techStack: ['JavaScript', 'Python', 'Node.js'],
        github: 'https://github.com/abhijeet-rawat',
        demo: '#',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop',
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProjectsSection = () => {
    return (
        <Box id="projects" sx={{ py: { xs: 7, md: 10 } }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <Typography
                        sx={{
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            color: '#00FF41',
                            letterSpacing: '0.15em',
                            mb: 1,
                            opacity: 0.8,
                        }}
                    >
            // PROJECTS //
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.7rem', sm: '2rem', md: '2.5rem' },
                            fontWeight: 700,
                            color: '#fff',
                            mb: { xs: 4, md: 5 },
                        }}
                    >
                        Selected Works
                    </Typography>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                        {projects.map((project, index) => (
                            <Grid size={{xs:12,sm:6}} key={index}>
                                <motion.div variants={cardVariants} style={{ height: '100%' }}>
                                    <ProjectCard project={project} />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ProjectsSection;
