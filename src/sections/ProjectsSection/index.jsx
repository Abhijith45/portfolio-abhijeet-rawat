import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProjectCard from '../../components/ProjectCard';
import { projectsApi } from '../../services/api';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export const fallbackProjects = [
    {
        title: 'Vertex LMS',
        description: 'A full-stack learning platform exploring structured course content, learner progress, video discovery and AI-assisted search.',
        techStack: ['Next.js', 'React', 'Node.js', 'Sanity', 'Clerk', 'PostgreSQL', 'OpenAI'],
        github: 'https://github.com/abhijeet-rawat',
        demo: 'https://example.com',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop',
        longDescription: 'A full-stack learning platform exploring structured course content, learner progress, video discovery and AI-assisted search.',
        overview: 'A personal engineering project exploring how learning content can be structured, searched and navigated more effectively.',
    },
    {
        title: 'SyncWA',
        description: 'A WhatsApp CRM built around lead management and customer communication workflows.',
        techStack: ['React', 'Node.js', 'Express', 'WhatsApp API', 'PostgreSQL', 'Redis'],
        github: 'https://github.com/abhijeet-rawat',
        demo: 'https://example.com',
        image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&auto=format&fit=crop',
        longDescription: 'A WhatsApp CRM built around lead management and customer communication workflows.',
        overview: 'Extending a WhatsApp CRM into a broader lead-management platform with authentication, multi-client administration and CRM workflows.',
    },
    {
        title: 'Lead Generation Platform',
        description: 'A full-scale platform for managing and qualifying B2B leads with automated outreach capabilities.',
        techStack: ['React', 'Node.js', 'MongoDB', 'AWS'],
        github: 'https://github.com/abhijeet-rawat',
        demo: 'https://example.com',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop',
        overview: 'High-throughput lead ingestion pipeline connecting webhooks, scoring algorithms, and automated email nurturing sequences.',
    },
    {
        title: 'Analytics Dashboard',
        description: 'Real-time data visualization tool for monitoring server health and application performance metrics.',
        techStack: ['React.js', 'Tailwind CSS', 'D3.js', 'Redis'],
        github: 'https://github.com/abhijeet-rawat',
        demo: 'https://example.com',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop',
        overview: 'Sub-second real-time telemetry streaming architecture using WebSockets and Redis pub/sub channels.',
    },
    {
        title: 'CRM System',
        description: 'Custom CRM built for a logistics company to manage client interaction and B2B tracking.',
        techStack: ['Express', 'React.js', 'PostgreSQL'],
        github: 'https://github.com/abhijeet-rawat',
        demo: 'https://example.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop',
        overview: 'Role-based access control and live dispatch tracking built on top of relational database constraints.',
    },
    {
        title: 'Cyber HUD Telemetry Engine',
        description: 'Real-time telemetry and vector simulation dashboard built for IoT sensor arrays with WebSockets.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Docker'],
        github: 'https://github.com/abhijeet-rawat',
        demo: 'https://example.com',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop',
        overview: 'Low-latency canvas and SVG rendering loop capable of rendering 60fps sensor vectors without frame drops.',
    },
];

const ProjectsSection = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await projectsApi.getAll();
                if (res.data?.success && res.data?.data?.length > 0) {
                    setProjects(res.data.data);
                } else {
                    setProjects(fallbackProjects);
                }
            } catch (err) {
                console.warn('Using fallback project data:', err.message);
                setProjects(fallbackProjects);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Display max 6 on homepage
    const visibleProjects = projects.slice(0, 6);
    const hasMore = projects.length > 6;

    return (
        <Box id="projects" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
            {/* Constrained container maxWidth to 1200px matching Navbar & other sections */}
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <Typography
                        align="center"
                        sx={{
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            color: '#00FF41',
                            letterSpacing: '0.2em',
                            mb: 1.5,
                        }}
                    >
                        // SELECTED_WORKS //
                    </Typography>
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                            fontWeight: 800,
                            color: '#fff',
                            letterSpacing: '-0.02em',
                            mb: { xs: 4, md: 6 },
                        }}
                    >
                        Featured Projects
                    </Typography>
                </motion.div>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#00FF41' }} />
                    </Box>
                ) : (
                    <>
                        {/* 3-Column Responsive Grid matching Navbar width */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }}>
                                {visibleProjects.map((project, index) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project._id || index}>
                                        <motion.div variants={cardVariants} style={{ height: '100%' }}>
                                            <ProjectCard project={project} />
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>

                        {/* "View All" Button shown if more than 6 projects */}
                        {hasMore && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 5, md: 7 } }}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        onClick={() => navigate('/all-projects')}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            px: 3.5,
                                            py: 1.2,
                                            background: '#07080c',
                                            color: '#00FF41',
                                            border: '1px solid #00FF41',
                                            borderRadius: '6px',
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            boxShadow: '0 0 15px rgba(0, 255, 65, 0.15)',
                                            '&:hover': {
                                                background: '#00FF41',
                                                color: '#000',
                                                boxShadow: '0 0 25px rgba(0, 255, 65, 0.4)',
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        VIEW ALL PROJECTS ({projects.length})
                                    </Button>
                                </motion.div>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default ProjectsSection;
