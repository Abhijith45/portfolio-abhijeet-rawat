import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ScrollToTop Component
 * 1. Ensures instantaneous scroll restoration on route change & smooth hash navigation.
 * 2. Renders a sticky global Scroll-to-Top button pinned at the bottom-right corner
 *    of the viewport, revealed only after 100vh of scrolling.
 */
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    // Route change & deep-link hash scrolling
    useEffect(() => {
        if (hash) {
            const targetId = hash.replace('#', '');
            const element = document.getElementById(targetId);

            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                const timeoutId = setTimeout(() => {
                    const el = document.getElementById(targetId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
                return () => clearTimeout(timeoutId);
            }
        } else {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant',
            });
        }
    }, [pathname, hash]);

    // Track scroll position: visible only after 100vh (window.scrollY >= window.innerHeight)
    useEffect(() => {
        let ticking = false;

        const checkScroll = () => {
            const scrollThreshold = window.innerHeight || 800;
            if (window.scrollY >= scrollThreshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        const onScroll = () => {
            if (!ticking) {
                if (typeof window.requestAnimationFrame === 'function') {
                    window.requestAnimationFrame(() => {
                        checkScroll();
                        ticking = false;
                    });
                } else {
                    checkScroll();
                    ticking = false;
                }
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        checkScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: { xs: 24, sm: 28, md: 32 },
                        right: { xs: 20, sm: 26, md: 32 },
                        zIndex: 1300,
                    }}
                >
                    <Tooltip title="Scroll to top" placement="left" arrow>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.6, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.6, y: 16 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            whileHover={{ scale: 1, y: 0 }}
                            whileTap={{ scale: 0.92 }}
                        >
                            <IconButton
                                onClick={scrollToTop}
                                aria-label="Scroll to top"
                                disableRipple
                                sx={{
                                    color: '#00FF41',
                                    background: 'rgba(7, 10, 8, 0.88)',
                                    border: '1px solid rgba(0, 255, 65, 0.45)',
                                    borderRadius: '50%',
                                    p: { xs: 1.1, sm: 1.25 },
                                    backdropFilter: 'blur(10px)',
                                    // boxShadow: '0 0 16px rgba(0, 255, 65, 0.25), 0 4px 20px rgba(0, 0, 0, 0.7)',
                                    // transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        background: '#00FF41',
                                        color: '#000000',
                                        borderColor: '#00FF41',
                                    },
                                }}
                            >
                                <KeyboardArrowUpIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
                            </IconButton>
                        </motion.div>
                    </Tooltip>
                </Box>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
