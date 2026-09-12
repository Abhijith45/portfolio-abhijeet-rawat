import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProjectCard from '../../components/ProjectCard';
import { projectsApi } from '../../services/api';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const AllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchAll = async () => {
            try {
                const res = await projectsApi.getAll();
                if (res.data?.success && res.data?.data) {
                    setProjects(res.data.data);
                }
            } catch (err) {
                console.error('Failed to load all projects:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    return (
        <Box sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 14 }, minHeight: '100vh', background: '#050505' }}>
            {/* Constrained container maxWidth to lg matching Navbar */}
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Back button */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontFamily: 'Fira Code, monospace',
                            fontSize: '0.8rem',
                            letterSpacing: '0.05em',
                            '&:hover': { color: '#00FF41', background: 'transparent' },
                        }}
                    >
                        RETURN_TO_BASE // HOME
                    </Button>
                </Box>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Typography
                        sx={{
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            color: '#00FF41',
                            letterSpacing: '0.2em',
                            mb: 1,
                        }}
                    >
                        // ARCHIVE // DIRECTORY_LISTING
                    </Typography>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem' },
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            color: '#fff',
                            mb: 2,
                        }}
                    >
                        All Works &amp;{' '}
                        <Box component="span" sx={{ color: '#00FF41' }}>
                            Deployments
                        </Box>
                    </Typography>
                    <Typography
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                            maxWidth: '700px',
                            lineHeight: 1.7,
                            mb: { xs: 5, md: 7 },
                        }}
                    >
                        Comprehensive index of client systems, open source architectures, and full-stack deployments. Total records indexed: {projects.length}.
                    </Typography>
                </motion.div>

                {/* 3-Column Projects Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                        <CircularProgress sx={{ color: '#00FF41' }} />
                    </Box>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Grid container spacing={{ xs: 2.5, sm: 3, md: 3 }}>
                            {projects.map((project, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project._id || index}>
                                    <motion.div variants={cardVariants} style={{ height: '100%' }}>
                                        <ProjectCard project={project} />
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                )}
            </Container>
        </Box>
    );
};

export default AllProjects;
