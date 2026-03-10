import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useScrollTrigger,
    useTheme,
    useMediaQuery,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/#projects' },
    { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const scrolled = useScrollTrigger({
        disableHysteresis: true,
        threshold: 50,
    });

    const handleNavClick = (path) => {
        setDrawerOpen(false);
        if (path.includes('#')) {
            const [pagePath, hash] = path.split('#');
            if (location.pathname !== pagePath && pagePath !== '') {
                navigate(pagePath);
                setTimeout(() => {
                    const el = document.getElementById(hash);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            } else {
                navigate('/');
                setTimeout(() => {
                    const el = document.getElementById(hash);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            navigate(path);
            window.scrollTo(0, 0);
        }
    };

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: scrolled
                        ? 'rgba(0,0,0,0.95)'
                        : 'transparent',
                    backdropFilter: scrolled ? 'blur(10px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(0,255,65,0.1)' : 'none',
                    transition: 'all 0.3s ease',
                }}
            >
                <Toolbar sx={{ py: 1, maxWidth: '1200px', width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ flex: 1 }}
                    >
                        <Box
                            onClick={() => handleNavClick('/')}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                                width: 'fit-content',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 42,
                                    height: 28,
                                    borderRadius: '4px',
                                    background: '#00FF41',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                        color: '#000',
                                        fontFamily: 'Fira Code, monospace',
                                        lineHeight: 1,
                                    }}
                                >
                                    AR
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>

                    {/* Desktop Nav */}
                    {!isMobile && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.label}
                                        onClick={() => handleNavClick(item.path)}
                                        sx={{
                                            color: location.pathname === item.path ? '#00FF41' : 'rgba(255,255,255,0.7)',
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            letterSpacing: '0.05em',
                                            px: 2,
                                            '&:hover': { color: '#ffffff', background: 'transparent' },
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                                <Button
                                    variant="contained"
                                    href="/resume.pdf"
                                    download
                                    sx={{
                                        ml: 2,
                                        background: '#00FF41',
                                        color: '#000',
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        px: 2.5,
                                        py: 0.8,
                                        borderRadius: '4px',
                                        '&:hover': {
                                            background: '#39FF14',
                                            boxShadow: '0 0 20px rgba(0,255,65,0.4)',
                                        },
                                    }}
                                >
                                    Resume
                                </Button>
                            </Box>
                        </motion.div>
                    )}

                    {/* Mobile Menu Icon */}
                    {isMobile && (
                        <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#00FF41' }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        background: '#050505',
                        borderLeft: '1px solid rgba(0,255,65,0.15)',
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                        <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#fff' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton
                                    onClick={() => handleNavClick(item.path)}
                                    sx={{
                                        py: 1.5,
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        '&:hover': { background: 'rgba(0,255,65,0.05)' },
                                    }}
                                >
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 500,
                                            color: location.pathname === item.path ? '#00FF41' : '#fff',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, background: '#00FF41', color: '#000', fontWeight: 700 }}
                    >
                        Resume
                    </Button>
                </Box>
            </Drawer>

            {/* Spacer */}
            <Toolbar />
        </>
    );
};

export default Navbar;
