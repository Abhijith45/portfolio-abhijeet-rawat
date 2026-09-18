import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ProjectCard from '../../components/ProjectCard';
import { projectsApi } from '../../services/api';
import useSEO from '../../hooks/useSEO';
import useCacheSubscription from '../../hooks/useCacheSubscription';

const INITIAL_PROJECTS = 6;
const BATCH_SIZE = 3;

const fallbackProjects = [
    {
        _id: 'fb-1',
        title: 'Cyberpunk Portfolio & Admin Engine',
        description: 'Full-stack developer portfolio and management platform built with React and Node.js.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
        category: 'Full Stack',
        liveUrl: 'https://abhijeet-rawat-portfolio.netlify.app',
        githubUrl: 'https://github.com/Abhijith45/portfolio-abhijeet-rawat',
    },
    {
        _id: 'fb-2',
        title: 'Lead Distribution CRM',
        description: 'Enterprise workflow engine automating inbound lead capture, qualification, and routing.',
        technologies: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
        category: 'Backend & API',
        liveUrl: 'https://github.com/Abhijith45',
        githubUrl: 'https://github.com/Abhijith45',
    },
    {
        _id: 'fb-3',
        title: 'Dynamic Webhook Integration Hub',
        description: 'Serverless integration bridge processing incoming event streams and Google Sheets pipelines.',
        technologies: ['JavaScript', 'Webhooks', 'Google Apps Script', 'Node.js'],
        category: 'Automation & Scripts',
        liveUrl: 'https://github.com/Abhijith45',
        githubUrl: 'https://github.com/Abhijith45',
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const MotionDiv = motion.div;

const AllProjects = () => {
    useSEO({
        title: 'Projects — Abhijeet Rawat | Full Stack Developer Portfolio',
        description:
            'Explore the full portfolio of Abhijeet Rawat — Full Stack Developer. Projects include B2B SaaS platforms, lead generation systems, CRM tools, REST APIs, and automation built with React, Node.js, MongoDB, and Express.',
        canonical: 'https://abhijeet-rawat-portfolio.netlify.app/all-projects',
        keywords:
            'Full Stack Developer Portfolio Projects, React Projects, Node.js Projects, MERN Stack Projects, SaaS Projects India, Web Application Portfolio, Abhijeet Rawat Projects',
    });

    const [projects, setProjects] = useState(fallbackProjects);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(INITIAL_PROJECTS);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const sentinelRef = useRef(null);
    const navigate = useNavigate();

    const fetchAll = async () => {
        try {
            const res = await projectsApi.getAll();
            if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
                setProjects(res.data.data);
            }
        } catch (err) {
            console.error('Failed to load all projects:', err);
            setProjects(fallbackProjects);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAll();
    }, []);

    // Subscribe to cache invalidation / purge events
    useCacheSubscription('projects', fetchAll);

    // Function to load the next batch of 3 projects
    const loadNextBatch = useCallback(() => {
        if (loading || isLoadingMore || visibleCount >= projects.length) return;

        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, projects.length));
            setIsLoadingMore(false);
        }, 300);
    }, [loading, isLoadingMore, visibleCount, projects.length]);

    // IntersectionObserver for scroll-triggered pagination
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || loading || visibleCount >= projects.length) return;

        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting) {
                    loadNextBatch();
                }
            },
            {
                root: null,
                rootMargin: '160px',
                threshold: 0.1,
            }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loading, visibleCount, projects.length, loadNextBatch]);

    const visibleProjects = projects.slice(0, visibleCount);
    const hasMore = visibleCount < projects.length;

    return (
        <Box sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 8, md: 14 }, minHeight: '100vh', background: 'none' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Back button */}
                <Box sx={{ mb: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        disableRipple
                        disableElevation
                        variant="text"
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontFamily: 'Fira Code, monospace',
                            fontSize: '0.8rem',
                            letterSpacing: '0.05em',
                            '&:hover': { color: '#00FF41', background: 'transparent' },
                        }}
                    >
                        HOME
                    </Button>
                </Box>

                {/* Header */}
                <MotionDiv initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Typography
                        sx={{
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            color: '#00FF41',
                            letterSpacing: '0.2em',
                            mb: 0.75,
                        }}
                    >
                        // MY PROJECTS ({projects?.length})
                    </Typography>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            color: '#fff',
                            mb: 3,
                        }}
                    >
                        All Works &amp;{' '}
                        <Box component="span" sx={{ color: '#00FF41' }}>
                            Deployments
                        </Box>
                    </Typography>
                </MotionDiv>

                {/* 3-Column Projects Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                        <CircularProgress sx={{ color: '#00FF41' }} />
                    </Box>
                ) : (
                    <>
                        <MotionDiv
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key={visibleCount}
                        >
                            <Grid container spacing={{ xs: 2.5, sm: 3, md: 3 }}>
                                {visibleProjects.map((project, index) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project._id || index} data-testid="project-card-item">
                                        <MotionDiv variants={cardVariants} style={{ height: '100%' }}>
                                            <ProjectCard project={project} />
                                        </MotionDiv>
                                    </Grid>
                                ))}
                            </Grid>
                        </MotionDiv>

                        {/* Scroll Pagination Sentinel & Controls */}
                        {hasMore && (
                            <Box
                                ref={sentinelRef}
                                data-testid="scroll-sentinel"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pt: 6,
                                    pb: 2,
                                }}
                            >
                                {isLoadingMore ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CircularProgress size={22} sx={{ color: '#00FF41' }} />
                                        <Typography
                                            sx={{
                                                fontFamily: 'Fira Code, monospace',
                                                fontSize: '0.8rem',
                                                color: '#00FF41',
                                                letterSpacing: '0.1em',
                                            }}
                                        >
                                            FETCHING_NEXT_BATCH (+3)...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Button
                                        data-testid="load-more-btn"
                                        variant="outlined"
                                        onClick={loadNextBatch}
                                        endIcon={<KeyboardDoubleArrowDownIcon />}
                                        sx={{
                                            borderColor: 'rgba(0, 255, 65, 0.3)',
                                            color: '#00FF41',
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            letterSpacing: '0.08em',
                                            px: 3,
                                            py: 1,
                                            borderRadius: '4px',
                                            background: 'rgba(0, 0, 0, 0.4)',
                                            '&:hover': {
                                                borderColor: '#00FF41',
                                                background: 'rgba(0, 255, 65, 0.08)',
                                                boxShadow: '0 0 15px rgba(0, 255, 65, 0.2)',
                                            },
                                        }}
                                    >
                                        LOAD MORE PROJECTS (+3)
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* End of records banner */}
                        {!hasMore && projects.length > 0 && (
                            <Box
                                data-testid="all-projects-loaded-banner"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1.5,
                                    pt: 6,
                                    pb: 2,
                                    color: 'rgba(255, 255, 255, 0.5)',
                                }}
                            >
                                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#00FF41' }} />
                                <Typography
                                    sx={{
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.08em',
                                    }}
                                >
                                    // ALL ARCHIVES DEPLOYED [TOTAL: {projects.length} PROJECTS]
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default AllProjects;
