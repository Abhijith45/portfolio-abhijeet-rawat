import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ReviewCard from '../../components/ReviewCard';
import { useReviews } from '../../hooks/useReviews';

const fallbackReviews = [
    {
        name: 'Sarah Chen',
        company: 'VP of Engineering @ NexaCloud',
        message: 'Abhijeet engineered our core real-time telemetry dashboards with remarkable speed and precision. The code quality, security considerations, and UI responsiveness exceeded expectations.',
        rating: 5,
        createdAt: '2025-01-18T10:00:00Z',
    },
    {
        name: 'Marcus Vance',
        company: 'Founder @ CyberShift AI',
        message: 'Working with Abhijeet was a seamless experience. He translated complex product requirements into an intuitive, visually stunning cyberpunk web platform that our users adore.',
        rating: 4.5,
        createdAt: '2025-01-05T14:30:00Z',
    },
    {
        name: 'Elena Rostova',
        company: 'Product Lead @ DataOrbit',
        message: 'His mastery of React, state management, and backend microservices is top-tier. Always proactive with architectural optimizations and clean documentation.',
        rating: 5,
        createdAt: '2024-12-20T09:15:00Z',
    },
    {
        name: 'David Kim',
        company: 'CTO @ QuantumGrid Labs',
        message: 'One of the most reliable JavaScript engineers I have worked with. Delivered full-stack features ahead of schedule without cutting any corners on test coverage.',
        rating: 4.5,
        createdAt: '2024-11-28T16:45:00Z',
    },
    {
        name: 'Alex Morgan',
        company: 'Tech Lead @ CloudScale',
        message: 'Abhijeet delivered an exceptional full-stack platform with clean, maintainable code and stellar performance. Highly recommended!',
        rating: 5,
        createdAt: '2024-10-12T11:20:00Z',
    },
];

const ReviewSection = () => {
    const { reviews: fetchedReviews, loading } = useReviews();
    const [currentIndex, setCurrentIndex] = useState(0);

    const reviews = fetchedReviews && fetchedReviews.length > 0 ? fetchedReviews : fallbackReviews;
    const totalReviews = reviews.length;

    // Window of 3 reviews to display at a time
    const itemsPerPage = 3;
    const maxIndex = Math.max(0, totalReviews - itemsPerPage);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    };

    const visibleReviews = reviews.slice(currentIndex, currentIndex + itemsPerPage);

    return (
        <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Header with Title and Scroll < > buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'flex-end' },
                        justifyContent: 'space-between',
                        mb: { xs: 4, md: 5, lg: 8 },
                    }}
                >
                    <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                color: '#00FF41',
                                letterSpacing: '0.2em',
                                mb: 1,
                            }}
                        >
                            /* CLIENT FEEDBACK */
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                                fontWeight: 800,
                                color: '#fff',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            What Clients Say
                        </Typography>
                    </motion.div>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        mb: { xs: 4, md: 5 },
                    }}
                >
                    <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    {/* Navigation < > Buttons shown if more than 3 reviews */}
                    {totalReviews > 3 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <IconButton
                                onClick={handlePrev}
                                aria-label="Previous reviews"
                                sx={{
                                    color: '#00FF41',
                                    border: '1px solid rgba(0, 255, 65, 0.3)',
                                    background: 'rgba(0, 255, 65, 0.04)',
                                    borderRadius: '6px',
                                    p: 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: '#00FF41',
                                        color: '#000',
                                        borderColor: 'rgba(0, 255, 65, 0.3)'
                                    },
                                }}
                            >
                                <ChevronLeftIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                            <IconButton
                                onClick={handleNext}
                                aria-label="Next reviews"
                                sx={{
                                    color: '#00FF41',
                                    border: '1px solid rgba(0, 255, 65, 0.3)',
                                    background: 'rgba(0, 255, 65, 0.04)',
                                    borderRadius: '6px',
                                    p: 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: '#00FF41',
                                        color: '#000',
                                    },
                                }}
                            >
                                <ChevronRightIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Box>
                    )}
                    </motion.div>

                </Box>

                {/* Reviews Display Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#00FF41' }} />
                    </Box>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                        >
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, 1fr)',
                                        md: 'repeat(3, 1fr)',
                                    },
                                    gap: { xs: 2.5, sm: 3, md: 3.5 },
                                }}
                            >
                                {visibleReviews.map((review, index) => (
                                    <Box key={review._id || currentIndex + index} sx={{ height: '100%' }}>
                                        <ReviewCard review={review} index={currentIndex + index + 1} />
                                    </Box>
                                ))}
                            </Box>
                        </motion.div>
                    </AnimatePresence>
                )}
            </Container>
        </Box>
    );
};

export default ReviewSection;
