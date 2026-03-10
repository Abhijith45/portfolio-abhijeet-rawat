import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const trustIndicators = [
    'MERN Stack Developer',
    'API Integration Specialist',
    'SaaS & Automation Systems',
];

const HeroSection = () => {
    const navigate = useNavigate();

    const handleViewProjects = () => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Box
            sx={{
                minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
                display: 'flex',
                alignItems: 'center',
                pt: { xs: 5, sm: 6, md: 4 },
                pb: { xs: 6, md: 8 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Neon glow */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '-10%',
                    width: { xs: '200px', md: '500px' },
                    height: { xs: '200px', md: '500px' },
                    background: 'radial-gradient(circle, rgba(0,255,65,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                    {/* Left */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        {/* Code label */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: { xs: '0.65rem', sm: '0.85rem' },
                                    color: '#00FF41',
                                    letterSpacing: '0.095em',
                                    mb: { xs: 1.5, md: 2, lg: 3 },
                                    opacity: 0.8,
                                }}
                            >
                            // JavaScript Developer
                            </Typography>
                        </motion.div>

                        {/* Main heading */}
                        <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
                            {[
                                "Hi, I'm",
                                'Abhijeet Rawat.',
                            ].map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                                >
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            fontSize: {
                                                xs: '2.1rem',
                                                sm: '3rem',
                                                md: '3.6rem',
                                                lg: '4.2rem',
                                            },
                                            fontWeight: 800,
                                            lineHeight: 1.05,
                                            letterSpacing: '-0.03em',
                                            color: i === 1 ? 'transparent' : '#ffffff',
                                            width:'fit-content',
                                            background:
                                                i === 1
                                                    ? 'linear-gradient(90deg, #ffffff 0%, #00ff41 40%, #00ff41 60%, #4ef678 100%)'
                                                    : 'none',
                                            backgroundClip: i === 1 ? 'text' : 'none',
                                            WebkitBackgroundClip: i === 1 ? 'text' : 'none',
                                        }}
                                    >
                                        {line === 'web applications' ? (
                                            <>
                                                <span style={{ color: '#00FF41' }}>web applications</span>
                                            </>
                                        ) : (
                                            line
                                        )}
                                    </Typography>
                                </motion.div>
                            ))}
                            <Box mt={3}/>
                            {[
                                'I build scalable',
                                'web applications',
                                'to solve problems.',
                            ].map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                                >
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontSize: {
                                                xs: '2.1rem',
                                                sm: '3rem',
                                                md: '3rem',
                                                lg: '2.8rem',
                                            },
                                            fontWeight: 800,
                                            lineHeight: 1.05,
                                            letterSpacing: '-0.03em',
                                            color: i === 1 ? 'transparent' : '#ffffff',
                                            width:'fit-content',
                                            background:
                                                i === 1
                                                    ? 'linear-gradient(90deg, #ffffff 0%, #00ff41 40%, #00ff41 60%, #4ef678 100%)'
                                                    : 'none',
                                            backgroundClip: i === 1 ? 'text' : 'none',
                                            WebkitBackgroundClip: i === 1 ? 'text' : 'none',
                                        }}
                                    >
                                        {line === 'web applications' ? (
                                            <>
                                                <span style={{ color: '#00FF41' }}>web applications</span>
                                            </>
                                        ) : (
                                            line
                                        )}
                                    </Typography>
                                </motion.div>
                            ))}
                        </Box>

                        {/* Subtext */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <Typography
                                sx={{
                                    color: 'rgba(255,255,255,0.55)',
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                    lineHeight: 1.7,
                                    maxWidth: { xs: '100%', md: '500px' },
                                    mb: { xs: 3, md: 4 },
                                }}
                            >
                                Specializing in MERN stack applications that solve real business
                                problems through efficient architecture and seamless user
                                experiences.
                            </Typography>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: { xs: 1.5, sm: 2 },
                                    flexWrap: 'wrap',
                                    mb: { xs: 3, md: 4 },
                                }}
                            >
                                <Button
                                    onClick={handleViewProjects}
                                    variant="contained"
                                    disableRipple
                                    disableElevation
                                    sx={{
                                        background: '#00FF41',
                                        color: '#000',
                                        fontWeight: 700,
                                        fontSize: { xs: '0.82rem', md: '0.9rem' },
                                        px: { xs: 2.5, md: 3 },
                                        py: { xs: 1, md: 1.2 },
                                        '&:hover': {
                                            background: '#39FF14',
                                            boxShadow: '0 0 25px rgba(0,255,65,0.4)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    View Projects
                                </Button>
                                <Button
                                    disableRipple
                                    disableElevation
                                    onClick={() => navigate('/contact')}
                                    variant="outlined"
                                    sx={{
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.82rem', md: '0.9rem' },
                                        px: { xs: 2.5, md: 3 },
                                        py: { xs: 1, md: 1.2 },
                                        '&:hover': {
                                            borderColor: 'rgba(255,255,255,0.6)',
                                            background: 'rgba(255,255,255,0.04)',
                                        },
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Contact Me
                                </Button>
                            </Box>
                        </motion.div>

                        {/* Trust Indicators */}
                        {/* <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {trustIndicators.map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <CheckCircleIcon sx={{ color: '#00FF41', fontSize: { xs: 14, md: 16 }, flexShrink: 0 }} />
                                        <Typography
                                            sx={{
                                                color: 'rgba(255,255,255,0.6)',
                                                fontSize: { xs: '0.8rem', md: '0.85rem' },
                                                fontFamily: 'Fira Code, monospace',
                                            }}
                                        >
                                            {item}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </motion.div> */}
                    </Grid>

                    {/* Right: Code editor mockup — tablet+ only */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Box
                                sx={{
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(0,255,65,0.15)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 0 60px rgba(0,255,65,0.05)',
                                    display: { xs: 'none', md: 'block' },
                                }}
                            >
                                {/* Editor header */}
                                <Box
                                    sx={{
                                        background: '#111',
                                        px: 2,
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    {['#ff5f57', '#febc2e', '#28c840'].map((color, i) => (
                                        <Box
                                            key={i}
                                            sx={{ width: 10, height: 10, borderRadius: '50%', background: color }}
                                        />
                                    ))}
                                    <Typography
                                        sx={{
                                            ml: 2,
                                            color: 'rgba(255,255,255,0.3)',
                                            fontSize: '0.72rem',
                                            fontFamily: 'Fira Code, monospace',
                                        }}
                                    >
                                        developer.js
                                    </Typography>
                                </Box>

                                {/* Code content */}
                                <Box
                                    sx={{ p: 3, fontFamily: 'Fira Code, monospace', fontSize: '0.78rem', lineHeight: 2 }}
                                >
                                    {[
                                        { color: 'rgba(255,255,255,0.3)', content: '// Abhijeet Rawat' },
                                        { color: '#c792ea', content: 'const', rest: ' developer = {' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  name:', rest: " 'Abhijeet Rawat',", restColor: '#c3e88d' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  role:', rest: " 'JS Developer',", restColor: '#c3e88d' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  stack:', rest: " ['MERN', 'APIs'],", restColor: '#c3e88d' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  available:', rest: ' true,', restColor: '#00FF41' },
                                        { color: 'rgba(255,255,255,0.7)', content: '};' },
                                    ].map((line, i) => (
                                        <Box key={i} sx={{ display: 'flex' }}>
                                            <Typography
                                                sx={{
                                                    color: 'rgba(255,255,255,0.15)',
                                                    mr: 2,
                                                    fontSize: '0.68rem',
                                                    minWidth: '20px',
                                                    userSelect: 'none',
                                                }}
                                            >
                                                {i + 1}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: line.color,
                                                    fontFamily: 'Fira Code, monospace',
                                                    fontSize: '0.78rem',
                                                }}
                                            >
                                                {line.content}
                                                {line.rest && (
                                                    <span style={{ color: line.restColor || 'rgba(255,255,255,0.7)' }}>
                                                        {line.rest}
                                                    </span>
                                                )}
                                            </Typography>
                                        </Box>
                                    ))}
                                    <Box sx={{ display: 'flex', mt: 1 }}>
                                        <Typography
                                            sx={{
                                                color: 'rgba(255,255,255,0.15)',
                                                mr: 2,
                                                fontSize: '0.68rem',
                                                minWidth: '20px',
                                            }}
                                        >
                                            8
                                        </Typography>
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 14,
                                                background: '#00FF41',
                                                animation: 'pulse-green 1s infinite',
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;
