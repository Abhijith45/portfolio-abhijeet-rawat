import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import useSEO from '../../hooks/useSEO';
import TechStackSection from '../../sections/TechStackSection';
import ExperienceTimeline from '../../sections/ExperienceTimeline';
import EducationSection from '../../sections/EducationSection';
import ReviewSection from '../../sections/ReviewSection';

const About = () => {
    useSEO({
        title: 'About Abhijeet Rawat — Full Stack Developer with 1.5+ Years Experience',
        description:
            'Learn about Abhijeet Rawat — Full Stack Developer based in Noida, India. 1.5+ years of professional experience with MERN stack, REST APIs, B2B SaaS, and automation systems. Explore his career timeline, education, and engineering philosophy.',
        canonical: 'https://abhijeet-rawat-portfolio.netlify.app/about',
        keywords:
            'Abhijeet Rawat About, Full Stack Developer Biography, MERN Developer Career, Software Engineer Noida India, Backend Developer Experience, Node.js React Developer Profile',
    });

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
                            {'// BIOGRAPHY'}
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
                                mb: 6,
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
                        {[
                            "I'm a software developer who likes building useful things.",
                            "My professional experience has mostly been around business applications, lead - generation systems, internal tools, APIs, integrations and automation.",
                            "I enjoy working where the requirements aren't perfectly defined - understanding the problem, figuring out how the pieces should work together, and turning that into software.",
                            "Outside of work, I build my own projects to experiment with technologies, architecture and ideas that I don't always get to explore professionally.",
                            "I'm still early in my career, and I don't pretend to know everything. I care about learning quickly, taking ownership and getting better with every system I build."
                        ].map((para, index) => (
                            <Typography
                                key={para.slice(0, 32)}
                                sx={{
                                    color: 'rgba(255,255,255,0.86)',
                                    fontSize: index === 0 ? { xs: '1rem', md: '1.5rem' } : { xs: '0.95rem', md: '1rem' },
                                    lineHeight: 1.5,
                                    maxWidth: { xs: '100%', sm: '80%', md: '75%' },
                                    mb: index === 0 ? 6 : 2.5,
                                    fontWeight: index === 0 ? 700 : 400
                                }}
                            >
                                {para}
                            </Typography>
                        ))}
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
