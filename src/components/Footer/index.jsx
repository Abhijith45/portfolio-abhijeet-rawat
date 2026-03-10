import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton, Divider } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { motion } from 'framer-motion';

const SOCIAL_LINKS = [
    { icon: <LinkedInIcon fontSize="small" />, label: 'LinkedIn', href: 'https://linkedin.com/in/abhijeet-rawat' },
    { icon: <GitHubIcon fontSize="small" />, label: 'GitHub', href: 'https://github.com/abhijeet-rawat' },
    { icon: null, label: 'LeetCode', href: 'https://leetcode.com/abhijeet-rawat', text: 'LC' },
    { icon: null, label: 'HackerRank', href: 'https://hackerrank.com/abhijeet-rawat', text: 'HR' },
];

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                background: 'none',
                py: { xs: 3, md: 4 },
                mt: 0,
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                {/* Main row */}
                <Grid container rowGap={2.5}>
                    <Grid size={{xs:12,sm:4}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,justifyContent:{xs:'center',sm:'flex-start'} }}>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '4px',
                                background: '#00FF41',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.6rem',
                                    fontWeight: 800,
                                    color: '#000',
                                    fontFamily: 'Fira Code, monospace',
                                }}
                            >
                                AR
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                color: '#00FF41',
                                textTransform: 'uppercase',
                            }}
                        >
                            Abhijeet Rawat
                        </Typography>
                    </Box>
                    </Grid>
                    <Grid size={{xs:12,sm:4}}>
                        <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent:'center',
                            gap: { xs: 2, sm: 3 },
                        }}
                    >
                        {['Home', 'About', 'Contact'].map((link) => (
                            <Link
                                key={link}
                                href="#"
                                underline="none"
                                sx={{
                                    color: 'rgba(255,255,255,0.4)',
                                    fontSize: '0.7rem',
                                    fontFamily: 'Inter, sans-serif',
                                    letterSpacing: '0.05em',
                                    '&:hover': { color: '#ffffff' },
                                    transition: 'color 0.2s',
                                }}
                            >
                                {link}
                            </Link>
                        ))}
                    </Box>
                    </Grid>
                    <Grid size={{xs:12,sm:4}}>
                        <Typography
                        sx={{
                            color: 'rgba(255,255,255,0.35)',
                            fontSize: '0.7rem',
                            fontFamily: 'Fira Code, monospace',
                            whiteSpace: 'nowrap',
                            textAlign: {xs:'center',sm:'right'}
                        }}
                    >
                        © 2024 AR_DIV.
                    </Typography>
                    </Grid>
                </Grid>

                {/* Social Icons Row */}
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.25)', my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                    {SOCIAL_LINKS.map((social) => (
                        <motion.div key={social.label} whileHover={{ y: -4, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                                component="a"
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                sx={{
                                    color: 'rgba(255,255,255,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '4px',
                                    width: 36,
                                    height: 36,
                                    fontSize: '0.7rem',
                                    fontFamily: 'Fira Code, monospace',
                                    fontWeight: 700,
                                    '&:hover': {
                                        color: '#00FF41',
                                        borderColor: '#00FF41',
                                        background: 'rgba(0,255,65,0.05)',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                {social.icon || social.text}
                            </IconButton>
                        </motion.div>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
