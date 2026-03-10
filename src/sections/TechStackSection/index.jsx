import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const techData = {
    Frontend: ['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    Backend: ['Node.js', 'Express', 'GraphQL', 'Python / FastAPI'],
    Database: ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma ORM'],
    Tools: ['Git / GitHub', 'Docker', 'AWS / Vercel', 'Postman'],
};

const TechStackSection = () => {
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
            /* TECH STACK */
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
                        Tools of Trade
                    </Typography>
                </motion.div>

                <Grid container spacing={{ xs: 3, md: 5 }}>
                    {Object.entries(techData).map(([category, items], i) => (
                        <Grid size={{xs:6,md:3}} key={category}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: { xs: '0.62rem', sm: '0.7rem' },
                                        color: 'rgba(255,255,255,0.35)',
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        mb: 2,
                                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                                        pb: 1,
                                    }}
                                >
                                    {category}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {items.map((item, j) => (
                                        <motion.div
                                            key={item}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 + j * 0.05 + 0.2 }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 4,
                                                        height: 4,
                                                        borderRadius: '50%',
                                                        background: '#00FF41',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                <Typography
                                                    sx={{
                                                        color: 'rgba(255,255,255,0.65)',
                                                        fontSize: { xs: '0.78rem', sm: '0.85rem' },
                                                        fontFamily: 'Inter, sans-serif',
                                                        '&:hover': { color: '#ffffff' },
                                                        transition: 'color 0.2s',
                                                        cursor: 'default',
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    ))}
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default TechStackSection;
