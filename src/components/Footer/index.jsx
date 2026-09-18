import React, { useState } from 'react';
import { Box, Container, Typography, Grid, IconButton, Tooltip, Button } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { SiLeetcode } from "react-icons/si";
import { FaHackerrank } from "react-icons/fa6";
import { useNavigate, useLocation } from 'react-router-dom';
import portfolioFavicon from '../../assets/portfolio_favicon.png';
import ReviewComponent from '../ReviewComponent';
import { motion } from 'framer-motion';
import { useProfile } from '../../context/ProfileContext';

const FOOTER_NAV = [
    { label: 'Projects', path: '/#projects', hash: 'projects' },
    { label: 'Skills', path: '/#skills', hash: 'skills' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
];

const Footer = () => {
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const { profile } = useProfile();
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLinkClick = (item) => {
        const { path, hash } = item;
        if (hash) {
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const el = document.getElementById(hash);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 350);
            } else {
                const el = document.getElementById(hash);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            navigate(path);
            window.scrollTo(0, 0);
        }
    };

    // Dynamically filter active social links based on profile
    const activeSocialLinks = [
        { id: 'github', icon: <GitHubIcon sx={{ fontSize: 18 }} />, label: 'GitHub', href: profile?.githubURL },
        { id: 'linkedin', icon: <LinkedInIcon sx={{ fontSize: 18 }} />, label: 'LinkedIn', href: profile?.linkedInURL },
        { id: 'leetcode', icon: <SiLeetcode style={{ fontSize: 16 }} />, label: 'LeetCode', href: profile?.leetCodeURL },
        { id: 'hackerrank', icon: <FaHackerrank style={{ fontSize: 17 }} />, label: 'HackerRank', href: profile?.HackerRankURL },
    ].filter((s) => s.href && typeof s.href === 'string' && s.href.trim().length > 0);

    return (
        <Box
            component="footer"
            sx={{
                position: 'relative',
                pt: { xs: 6, md: 8 },
                pb: { xs: 4, md: 5 },
                overflow: 'hidden',
            }}
        >
            {/* Ambient Cyber Light Glow */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0,255,65,0.6), transparent)',
                    filter: 'drop-shadow(0 0 8px rgba(0,255,65,0.8))',
                }}
            />

            <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 4, md: 4 } }}>
                {/* Upper Footer Grid */}
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start" sx={{ mb: { xs: 5, md: 6 } }}>
                    {/* Brand & Identity Column */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Logo + Name */}
                            <Box
                                onClick={scrollToTop}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.15,
                                    cursor: 'pointer',
                                    width: 'fit-content',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={portfolioFavicon}
                                    alt="Abhijeet Rawat logo"
                                    sx={{
                                        width: { xs: 28, sm: 32, md: 38, lg: 42 },
                                        height: 'auto',
                                    }}
                                />
                                <Box>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.95rem',
                                            fontWeight: 800,
                                            letterSpacing: '0.08em',
                                            color: '#ffffff',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {(profile?.name || 'ABHIJEET RAWAT').toUpperCase()}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.75rem',
                                            color: '#00FF41',
                                            letterSpacing: '0.12em',
                                        }}
                                    >
                                        &gt; Software Developer
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.65)',
                                    fontSize: '0.85rem',
                                    fontFamily: 'Inter, sans-serif',
                                    lineHeight: 1.6,
                                    maxWidth: '380px',
                                }}
                            >
                                Building full-stack web applications, backend services, integrations and practical business tools.
                            </Typography>

                            {/* Suggest Improvements text variant button */}
                            <Box sx={{ mt: 0.5 }}>
                                <Button
                                    variant="text"
                                    disableRipple
                                    onClick={() => setFeedbackOpen(true)}
                                    startIcon={<RateReviewOutlinedIcon sx={{ fontSize: 16 }} />}
                                    sx={{
                                        p: 0,
                                        minWidth: 0,
                                        color: '#00FF41',
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.04em',
                                        textTransform: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.15,
                                        background: 'transparent',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    Suggest Improvements
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Quick Navigation Links */}
                    <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#00FF41',
                                letterSpacing: '0.15em',
                                mb: 2,
                            }}
                        >
                            {'// NAVIGATION'}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                            {FOOTER_NAV.map((nav) => (
                                <Box
                                    key={nav.label}
                                    onClick={() => handleLinkClick(nav)}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontSize: '0.85rem',
                                        fontFamily: 'Inter, sans-serif',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.8,
                                        width: 'fit-content',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: '#00FF41',
                                            transform: 'translateX(4px)',
                                            '& .footer-arrow': { opacity: 1, transform: 'translateX(0)' },
                                        },
                                    }}
                                >
                                    <Typography
                                        component="span"
                                        className="footer-arrow"
                                        sx={{
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.75rem',
                                            color: '#00FF41',
                                            opacity: 0,
                                            transform: 'translateX(-4px)',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        &gt;
                                    </Typography>
                                    {nav.label}
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Connect & Social Profiles */}
                    {activeSocialLinks.length > 0 && (
                        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                            <Typography
                                sx={{
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: '#00FF41',
                                    letterSpacing: '0.15em',
                                    mb: 2,
                                }}
                            >
                                {'// SOCIAL PROFILE'}
                            </Typography>

                            {/* Social Buttons Grid */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
                                {activeSocialLinks.map((social) => (
                                    <Tooltip title={social.label} arrow key={social.label} placement="top">
                                        <motion.div whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <IconButton
                                                component="a"
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.label}
                                                sx={{
                                                    color: 'rgba(255,255,255,0.7)',
                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                    border: '1px solid rgba(0, 255, 65, 0.15)',
                                                    borderRadius: '6px',
                                                    p: 1.1,
                                                    transition: 'all 0.25s ease',
                                                    '&:hover': {
                                                        color: '#00FF41',
                                                        borderColor: '#00FF41',
                                                        background: 'rgba(0, 255, 65, 0.08)',
                                                        boxShadow: '0 0 14px rgba(0, 255, 65, 0.35)',
                                                    },
                                                }}
                                            >
                                                {social.icon}
                                            </IconButton>
                                        </motion.div>
                                    </Tooltip>
                                ))}
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Sub-Footer Divider & Copyright Row */}
                <Box
                    sx={{
                        pt: 3,
                        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Typography
                        sx={{
                            color: 'rgba(255, 255, 255, 0.45)',
                            fontSize: '0.72rem',
                            fontFamily: 'Fira Code, monospace',
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        © 2026 {profile?.name || 'Abhijeet Rawat'}. All rights reserved.
                    </Typography>

                    <Typography
                        sx={{
                            color: 'rgba(255, 255, 255, 0.35)',
                            fontSize: '0.7rem',
                            fontFamily: 'Fira Code, monospace',
                            textAlign: { xs: 'center', sm: 'right' },
                        }}
                    >
                        Built with curiosity, caffeine & too many tabs.
                    </Typography>
                </Box>
            </Container>

            {/* Suggest Improvements Feedback Modal using ReviewComponent */}
            <ReviewComponent
                open={feedbackOpen}
                onClose={() => setFeedbackOpen(false)}
                initialMode="review"
                feedbackTitle="Suggest Improvements"
                autoRedirect={false}
                redirectMessage="Thank you! Your suggestion and feedback have been submitted successfully."
            />
        </Box>
    );
};

export default Footer;
