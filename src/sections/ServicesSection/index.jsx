import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import ServiceCard from '../../components/ServiceCard';

const services = [
    {
        icon: 'web',
        title: 'Web Application Development',
        description: 'Custom-built MERN stack solutions built for scale, performance, and reliability. From SaaS platforms to internal tools.',
    },
    {
        icon: 'api',
        title: 'API Integration',
        description: 'Seamlessly integrating third-party solutions from REST to GraphQL, connecting, and legacy system modernizations.',
    },
    {
        icon: 'chart',
        title: 'Analytics Dashboards',
        description: 'Transforming complex data into actionable insights through intuitive visualization and real-time metrics.',
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ServicesSection = () => {
    return (
        <Box sx={{ py: { xs: 5, sm: 6, md: 9 } }}>
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
                        {'/* WHAT I CAN HELP YOU WITH */'}
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
                        Services & Expertise
                    </Typography>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {services.map((service) => (
                            <Grid size={{xs:12,sm:6,md:4}} key={service.title || service.id}>
                                <motion.div variants={cardVariants}>
                                    <ServiceCard service={service} />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ServicesSection;
