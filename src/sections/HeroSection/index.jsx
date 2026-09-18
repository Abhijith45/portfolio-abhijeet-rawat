import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import DownloadIcon from '@mui/icons-material/Download';
import SocialButtons from '../../components/SocialButtons';
import { useProfile } from '../../context/ProfileContext';

const trustIndicators = [
    'MERN Stack Developer',
    'API Integration Specialist',
    'SaaS & Automation Systems',
];

const HeroSection = () => {
    const navigate = useNavigate();
    const { profile } = useProfile();

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

            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 2.5, md: 3 } }}>
                <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
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
                                {'// Developer Portfolio'}
                            </Typography>
                        </motion.div>

                        {/* Main heading */}
                        <Box sx={{ mb: { xs: 2.5, sm: 3, md: 4, lg: 5 } }}>
                            <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontSize: {
                                                xs: '1.7rem',
                                                sm: '2rem',
                                                md: '2.5rem',
                                                lg: '3.2rem',
                                            },
                                            fontWeight: 800,
                                            lineHeight: 1.05,
                                            letterSpacing: '-0.03em',
                                            color: '#ffffff',
                                            width:'fit-content',
                                            background:'none',
                                            backgroundClip: 'none',
                                            WebkitBackgroundClip: 'none',
                                        }}
                                    >
                                        Hi, I'm
                                    </Typography>
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
                                            color:'transparent',
                                            width:'fit-content',
                                            background:'linear-gradient(90deg, #ffffff 0%, #00ff41 15%,#4ef678 45%, #00ff41 60%, #4ef678 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                        }}
                                    >
                                        Abhijeet Rawat
                                    </Typography>
                                </motion.div>
                            <Box mt={{ xs: 2.5, sm: 3, md: 4, lg: 5 }} />
                            {[
                                'I build software',
                                'for messy problems.',
                            ].map((line, i) => (
                                <motion.div
                                    key={line}
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
                                                lg: '2.6rem',
                                            },
                                            fontWeight: 800,
                                            lineHeight: 1.05,
                                            letterSpacing: '-0.03em',
                                            color: i === 1 ? 'transparent' : '#ffffff',
                                            width: 'fit-content',
                                            background:
                                                i === 1
                                                    ? 'linear-gradient(90deg, #ffffff 0%, #00ff41 25%, #00ff41 35%, #00ff41 100%)'
                                                    : 'none',
                                            backgroundClip: i === 1 ? 'text' : 'none',
                                            WebkitBackgroundClip: i === 1 ? 'text' : 'none',
                                        }}
                                    >
                                        {line === 'problems.' ? (
                                            <>
                                                <span style={{ color: '#00FF41' }}>problems.</span>
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
                                    color: 'rgba(255,255,255,0.95)',
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                    lineHeight: 1.7,
                                    maxWidth: { xs: '100%', md: '580px' },
                                    mb: { xs: 2.5, sm: 3, md: 4, lg: 5 }
                                }}
                            >
                                Full-stack developer with professional experience building web applications, backend 
                                services, integrations and internal business tools. I like building things that solve 
                                annoyingly practical problems.
                            </Typography>
                        </motion.div>

                        {/* Social / Coding Profile Icons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.85 }}
                        >
                            <Box sx={{ mb: { xs: 2.5, sm: 3, md: 4, lg: 5 } }}>
                                <SocialButtons />
                            </Box>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.95 }}
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
                                    disableRipple
                                    disableElevation
                                    onClick={() => navigate('/contact')}
                                    variant="outlined"
                                    startIcon={<EmailIcon sx={{ fontSize: { xs: 17, md: 19 }, color: '#00FF41' }} />}
                                    sx={{
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        color: '#fff',
                                        fontWeight: 500,
                                        fontSize: { xs: '0.82rem', md: '0.9rem' },
                                        px: { xs: 2.5, md: 3 },
                                        py: { xs: 0.65, md: 0.75 },
                                        '&:hover': {
                                            borderColor: '#00FF41',
                                            color: '#00FF41',
                                            background: 'rgba(0, 255, 65, 0.08)',
                                        },
                                        transition: 'all 0.25s ease',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Contact Me
                                </Button>
                                <Button
                                    disableRipple
                                    disableElevation
                                    component="a"
                                    href={profile?.resumeURL || "https://docs.google.com/document/d/1azXMe6AKB34DnnR3ogXqRry5aSpHL5IUCqf5qV7FqgA/edit?usp=sharing"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="contained"
                                    endIcon={<DownloadIcon sx={{ fontSize: { xs: 17, md: 19 } }} />}
                                    sx={{
                                        background: '#00FF41',
                                        color: '#000',
                                        fontWeight: 700,
                                        fontSize: { xs: '0.82rem', md: '0.9rem' },
                                        px: { xs: 2.5, md: 3 },
                                        py: { xs: 0.65, md: 0.75 },
                                        '&:hover': {
                                            background: '#39FF14',
                                            boxShadow: '0 0 5px rgba(0, 255, 65, 0.5)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.25s ease',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Resume
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
                                    {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
                                        <Box
                                            key={color}
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
                                    sx={{
                                        p: { xs: 2, sm: 2.5 },
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.78rem',
                                        lineHeight: 1.85,
                                    }}
                                >
                                    {[
                                        { color: 'rgba(255,255,255,0.3)', content: '// Abhijeet Rawat' },
                                        { color: '#c792ea', content: 'const', rest: ' developer = {' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  core:', rest: ' ["JavaScript", "React", "Node.js", "PostgreSQL", "REST APIs"],', restColor: '#c3e88d' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  frontend:', rest: ' ["React", "Next.js", "Tailwind CSS"],', restColor: '#c3e88d' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  backend:', rest: ' ["Node.js", "Express", "REST API"],', restColor: '#c3e88d' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  data:', rest: ' ["PostgreSQL", "MongoDB", "Firebase"],', restColor: '#c3e88d' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  integrations:', rest: ' ["Webhooks", "External APIs", "Google Apps Script"],', restColor: '#c3e88d' },
                                        { color: 'rgba(255,255,255,0.5)', content: '  engineering:', rest: ' ["Agile Methodologies", "Automation"],', restColor: '#c3e88d' },
                                        { color: 'rgba(255,255,255,0.7)', content: '};' },
                                    ].map((line, i) => (
                                        <Box key={line.content} sx={{ display: 'flex', alignItems: 'baseline' }}>
                                            <Typography
                                                sx={{
                                                    color: 'rgba(255,255,255,0.15)',
                                                    mr: 2,
                                                    fontSize: '0.68rem',
                                                    minWidth: '22px',
                                                    userSelect: 'none',
                                                    textAlign: 'right',
                                                    fontFamily: 'Fira Code, monospace',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {i + 1}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: line.color,
                                                    fontFamily: 'Fira Code, monospace',
                                                    fontSize: '0.78rem',
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                {line.content}
                                                {line.rest && (
                                                    <span style={{ color: line.restColor || 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {line.rest}
                                                    </span>
                                                )}
                                            </Typography>
                                        </Box>
                                    ))}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                        <Typography
                                            sx={{
                                                color: 'rgba(255,255,255,0.15)',
                                                mr: 2,
                                                fontSize: '0.68rem',
                                                minWidth: '22px',
                                                userSelect: 'none',
                                                textAlign: 'right',
                                                fontFamily: 'Fira Code, monospace',
                                            }}
                                        >
                                            10
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
