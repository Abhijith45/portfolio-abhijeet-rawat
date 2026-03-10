import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import ReviewCard from '../../components/ReviewCard';
import { useReviews } from '../../hooks/useReviews';
import CircularProgress from '@mui/material/CircularProgress';

const ReviewSection = () => {
    const { reviews, loading } = useReviews();

    return (
        <Box sx={{ py: { xs: 7, md: 10 } }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <Typography
                        sx={{
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            color: '#00FF41',
                            letterSpacing: '0.15em',
                            mb: 1,
                            opacity: 0.8,
                        }}
                    >
            /* CLIENT FEEDBACK */
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.7rem', sm: '2rem', md: '2.5rem' },
                            fontWeight: 700,
                            color: '#fff',
                            mb: { xs: 4, md: 5 },
                        }}
                    >
                        {/* context-sensitive title will come from parent, default: */}
                        What Clients Say
                    </Typography>
                </motion.div>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress sx={{ color: '#00FF41' }} />
                    </Box>
                ) : (
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {reviews.map((review, index) => (
                            <Grid size={{xs:12,sm:6,md:4}} key={review._id || index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.12, duration: 0.5 }}
                                    style={{ height: '100%' }}
                                >
                                    <ReviewCard review={review} />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default ReviewSection;
