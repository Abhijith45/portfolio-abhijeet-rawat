import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { technologiesApi } from '../../services/api';
import TechIcon from '../../components/TechIcon';
import useCacheSubscription from '../../hooks/useCacheSubscription';

const categories = [
    'Frontend & UI',
    'Backend & Runtime',
    'Database & Cache',
    'DevOps, Cloud & Storage',
    'Version Control & Dev Tools',
];

const fallbackTechByCategory = {
    'Frontend & UI': [
        { name: 'React', icon: 'react' },
        { name: 'Next.js', icon: 'nextjs' },
        { name: 'JavaScript', icon: 'javascript' },
        { name: 'HTML5', icon: 'html5' },
        { name: 'CSS3', icon: 'css3' },
        { name: 'Material UI', icon: 'mui' },
        { name: 'Tailwind CSS', icon: 'tailwind' },
        { name: 'Framer Motion', icon: 'framer' },
        { name: 'Redux', icon: 'redux' },
    ],
    'Backend & Runtime': [
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Express.js', icon: 'express' },
        { name: 'REST APIs', icon: 'fastapi' },
        { name: 'JWT Auth', icon: 'jwt' },
    ],
    'Database & Cache': [
        { name: 'MongoDB', icon: 'mongodb' },
        { name: 'Mongoose', icon: 'mongoose' },
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'MySQL', icon: 'mysql' },
        { name: 'Firebase', icon: 'firebase' },
    ],
    'DevOps, Cloud & Storage': [
        { name: 'Docker', icon: 'docker' },
        { name: 'Cloudinary', icon: 'cloudinary' },
        { name: 'Render', icon: 'render' },
        { name: 'Netlify', icon: 'netlify' },
        { name: 'Vercel', icon: 'vercel' },
    ],
    'Version Control & Dev Tools': [
        { name: 'Git', icon: 'git' },
        { name: 'GitHub', icon: 'github' },
        { name: 'Postman', icon: 'postman' },
        { name: 'Vite', icon: 'vite' },
        { name: 'npm', icon: 'npm' },
    ],
};

const TechStackSection = () => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [techByCategory, setTechByCategory] = useState(fallbackTechByCategory);
    const [loading, setLoading] = useState(true);

    const fetchTech = async () => {
        try {
            const res = await technologiesApi.getAll();
            if (res.data?.success && res.data?.data?.length > 0) {
                const grouped = {};
                categories.forEach((cat) => (grouped[cat] = []));

                res.data.data.forEach((item) => {
                    const cat = item.category || 'Frontend & UI';
                    if (!grouped[cat]) grouped[cat] = [];
                    grouped[cat].push({
                        name: item.name,
                        icon: item.icon || item.name.toLowerCase(),
                    });
                });
                setTechByCategory(grouped);
            }
        } catch (err) {
            console.warn('Using fallback tech items:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTech();
    }, []);

    // Subscribe to cache invalidation / purge events
    useCacheSubscription('technologies', fetchTech);

    const currentItems = techByCategory[selectedCategory] || [];

    return (
        <Box id="skills" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
            <span id="tech-stack" style={{ position: 'absolute', top: 0 }} />
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                {/* Header */}
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
                        /* TECH STACK */
                    </Typography>
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                            fontWeight: 800,
                            color: '#fff',
                            letterSpacing: '-0.02em',
                            mb: { xs: 2, md: 3 },
                        }}
                    >
                        Tools of Trade
                    </Typography>
                </motion.div>

                {/* Category Pill Buttons matching attached UI */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: { xs: 1, sm: 1.5 },
                        mb: { xs: 2, md: 3 },
                    }}
                >
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <Button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                sx={{
                                    px: { xs: 1.8, sm: 2.6 },
                                    py: { xs: 0.8, sm: 1 },
                                    borderRadius: '8px',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: { xs: '0.75rem', sm: '0.82rem' },
                                    fontWeight: 600,
                                    letterSpacing: '0.03em',
                                    textTransform: 'none',
                                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)',
                                    background: isSelected ? 'rgba(0,255,65,0.08)' : '#0a0a0a',
                                    border: isSelected ? '1px solid #00FF41' : '1px solid rgba(255,255,255,0.18)',
                                    boxShadow: isSelected ? '0 0 15px rgba(0,255,65,0.3)' : 'none',
                                    transition: 'all 0.25s ease-in-out',
                                    '&:hover': {
                                        background: isSelected ? 'rgba(0,255,65,0.15)' : 'rgba(255,255,255,0.05)',
                                        border: isSelected ? '1px solid #00FF41' : '1px solid rgba(255,255,255,0.4)',
                                        color: '#fff',
                                    },
                                }}
                            >
                                {cat}
                            </Button>
                        );
                    })}
                </Box>

                {/* Tech Icons Wall Showcase matching screenshot */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: '#00FF41' }} />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            // background: '#0a0a0a',
                            // border: '1px solid rgba(255,255,255,0.08)',
                            // borderRadius: '12px',
                            p: { xs: 2, sm: 2.5, md: 3 },
                            // boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                            overflow: 'hidden',
                        }}
                    >

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCategory}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                            >
                                <Grid container spacing={{ xs: 3, sm: 4, md: 4 }} justifyContent="center">
                                    {currentItems.map((item, index) => (
                                        <Grid
                                            size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
                                            key={item.name}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.25, delay: index * 0.04 }}
                                                whileHover={{ y: -6 }}
                                                style={{ width: '100%', maxWidth: '140px' }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: { xs: 1, sm: 1.5 },
                                                        borderRadius: '10px',
                                                        border: '1px solid transparent',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            background: 'rgba(255,255,255,0.03)',
                                                            border: '1px solid rgba(0,255,65,0.2)',
                                                            '& .tech-icon-img': {
                                                                filter: 'drop-shadow(0 0 10px rgba(0,255,65,0.58)) brightness(1.2)',
                                                                transform: 'scale(1.08)',
                                                            },
                                                            '& .tech-icon-label': {
                                                                color: '#00FF41',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        className="tech-icon-img"
                                                        sx={{
                                                            width: { xs: 40, sm: 48, md: 56 },
                                                            height: { xs: 40, sm: 48, md: 56 },
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            mb: 1.5,
                                                            transition: 'all 0.3s ease',
                                                        }}
                                                    >
                                                        <TechIcon name={item.name} icon={item.icon} size={42} />
                                                    </Box>
                                                    <Typography
                                                        className="tech-icon-label"
                                                        sx={{
                                                            color: 'rgba(255,255,255,0.75)',
                                                            fontFamily: 'Inter, sans-serif',
                                                            fontSize: { xs: '0.78rem', sm: '0.85rem' },
                                                            fontWeight: 500,
                                                            textAlign: 'center',
                                                            transition: 'color 0.25s ease',
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                </Box>
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </motion.div>
                        </AnimatePresence>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default TechStackSection;
