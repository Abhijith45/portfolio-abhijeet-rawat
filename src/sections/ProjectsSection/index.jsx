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

const ProjectsSection = () => {
    const [projects, setProjects] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const fetchProjects = async () => {
            try {
                const res = await projectsApi.getFeatured();
                if (isMounted) {
                    if (res.data?.success && res.data?.data && res.data.data.length > 0) {
                        setProjects(res.data.data);
                        setHasMore(Boolean(res.data.hasMore));
                    } 
                }
            } catch (err) {
                console.warn('Using fallback project data:', err.message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchProjects();

        return () => {
            isMounted = false;
        };
    }, []);

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
                        // MY WORK //
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
                                {projects.map((project, index) => (
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
                                        VIEW ALL 
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
