import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import TechStackSection from '../../sections/TechStackSection';
import ExperienceTimeline from '../../sections/ExperienceTimeline';
import EducationSection from '../../sections/EducationSection';
import ReviewSection from '../../sections/ReviewSection';

const About = () => {
    return (
        <>
            {/* Hero Section */}
            <Box sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.75rem',
                                color: '#00FF41',
                                letterSpacing: '0.2em',
                                mb: 1.5,
                                opacity: 0.8,
                            }}
                        >
                            // BIOGRAPHY
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '3rem', md: '4.5rem' },
                                fontWeight: 800,
                                lineHeight: 1.05,
                                letterSpacing: '-0.03em',
                                mb: 3,
                            }}
                        >
                            About{' '}
                            <Box component="span" sx={{ color: '#00FF41', fontStyle: 'italic' }}>
                                Me
                            </Box>
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Typography
                            sx={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: { xs: '0.95rem', md: '1rem' },
                                lineHeight: 1.8,
                                maxWidth: '640px',
                            }}
                        >
                            I am a JavaScript Developer specializing in building scalable web applications.
                            My journey started with a fascination for how the internet works, which evolved
                            into a career focused on performance, accessibility, and clean architecture.
                            I bridge the gap between complex backend logic and pixel-perfect user interfaces.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            {/* Experience Timeline */}
            <ExperienceTimeline />

            {/* Education Section */}
            <EducationSection />

        </>
    );
};

export default About;
