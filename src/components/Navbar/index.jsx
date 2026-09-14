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
import portfolioFavicon from '../../assets/portfolio_favicon.png';

const navItems = [
    { label: 'Work', path: '/#projects', hash: 'projects' },
    { label: 'Skills', path: '/#skills', hash: 'skills' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Scroll Spy for Home page hash sections (Work/Projects and Skills)
    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveSection('');
            return;
        }

        const handleScroll = () => {
            const sections = ['skills', 'projects'];
            const scrollPosition = window.scrollY + 200;

            for (const sectionId of sections) {
                const el = document.getElementById(sectionId);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(sectionId);
                        return;
                    }
                }
            }

            if (window.scrollY < 300) {
                setActiveSection('');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const scrolled = useScrollTrigger({
        disableHysteresis: true,
        threshold: 50,
    });

    const scrollToSection = (hash) => {
        const el = document.getElementById(hash);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleNavClick = (item) => {
        setDrawerOpen(false);
        const { path, hash } = item;

        if (hash) {
            if (location.pathname !== '/') {
                navigate(`/#${hash}`);
            } else {
                scrollToSection(hash);
            }
        } else {
            navigate(path);
        }
    };

    const isItemActive = (item) => {
        if (location.pathname === '/' && item.hash) {
            return activeSection === item.hash;
        }
        return !item.hash && location.pathname === item.path;
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
                            onClick={() => {
                                if (location.pathname !== '/') {
                                    navigate('/');
                                } else {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                                width: 'fit-content',
                            }}
                        >
                            <Box
                                component="img"
                                src={portfolioFavicon}
                                alt="Abhijeet Rawat logo"
                                sx={{
                                    width: { xs: 36, sm: 44, md: 52 },
                                    height: 'auto',
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    display: 'block',
                                }}
                            />
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
                                        variant='text'
                                        disableRipple
                                        key={item.label}
                                        onClick={() => handleNavClick(item)}
                                        sx={{
                                            color: isItemActive(item) ? '#00FF41' : 'rgba(255,255,255,0.7)',
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '0.85rem',
                                            fontWeight: isItemActive(item) ? 700 : 500,
                                            letterSpacing: '0.05em',
                                            px: 2,
                                            position: 'relative',
                                            '&:hover': { color: '#ffffff', background: 'transparent' },
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
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
                                    disableRipple
                                    onClick={() => handleNavClick(item)}
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
                                            fontWeight: isItemActive(item) ? 700 : 500,
                                            color: isItemActive(item) ? '#00FF41' : '#fff',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Spacer */}
            <Toolbar />
        </>
    );
};

export default Navbar;
