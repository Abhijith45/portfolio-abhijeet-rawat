import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { motion as m } from 'framer-motion';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const experiences = [
    {
        company: 'Tiger Education Services',
        role: 'JavaScript Developer',
        period: 'Feb 2025 – Present',
        active: true,
        responsibilities: [
            'Building MERN stack applications and educational platforms using Next.js and Node.js',
            'Improving platform performance by 40% through code splitting and asset optimization',
            'Implementing real-time quiz engines and student progress dashboards using WebSockets',
        ],
    },
    {
        company: 'Tiger Education Services',
        role: 'Web Developer Intern',
        period: 'Nov 2024 – Jan 2025',
        active: false,
        responsibilities: [
            'Developed responsive landing pages and UI components using Tailwind CSS',
            'Collaborated with the design team to translate Figma prototypes into functional code',
        ],
    },
];

const ExperienceTimeline = () => {
    return (
        <Box sx={{ py: { xs: 6, md: 8 } }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '1.6rem', md: '2.2rem' },
                            color: '#fff',
                            mb: { xs: 4, md: 5 },
                        }}
                    >
                        Experience
                    </Typography>
                </motion.div>

                <Box sx={{ position: 'relative', pl: { xs: 3.5, md: 4 } }}>
                    {/* Vertical line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: { xs: 9, md: 11 },
                            top: 0,
                            bottom: 0,
                            width: '1px',
                            background:
                                'linear-gradient(180deg, rgba(0,255,65,0.5) 0%, rgba(0,255,65,0.05) 100%)',
                        }}
                    />

                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                        >
                            <Box sx={{ mb: { xs: 5, md: 6 }, position: 'relative' }}>
                                {/* Dot */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: { xs: -23, md: -26.35 },
                                        top: 0,
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        background: exp.active ? '#00FF41' : 'rgba(0,255,65,0.2)',
                                        border: `2px solid ${exp.active ? '#00FF41' : 'rgba(0,255,65,0.3)'}`,
                                        boxShadow: exp.active ? '0 0 12px rgba(0,255,65,0.5)' : 'none',
                                    }}
                                />

                                {/* Header — stacked on mobile, row on sm+ */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        justifyContent: 'space-between',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        gap: { xs: 0.5, sm: 1 },
                                        mb: 0.5,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: { xs: '0.95rem', md: '1.05rem' },
                                            color: '#fff',
                                        }}
                                    >
                                        {exp.role}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: { xs: '0.72rem', sm: '0.78rem' },
                                            color: exp.active ? '#00FF41' : 'rgba(255,255,255,0.4)',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {exp.period}
                                    </Typography>
                                </Box>

                                <Typography
                                    sx={{
                                        color: 'rgba(255,255,255,0.45)',
                                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                        mb: 2,
                                    }}
                                >
                                    {exp.company}
                                </Typography>

                                {/* Responsibilities */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {exp.responsibilities.map((resp, i) => (
                                        <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                            <ChevronRightIcon
                                                sx={{
                                                    color: '#00FF41',
                                                    fontSize: { xs: 16, md: 18 },
                                                    flexShrink: 0,
                                                    mt: 0.15,
                                                }}
                                            />
                                            <Typography
                                                sx={{
                                                    color: 'rgba(255,255,255,0.6)',
                                                    fontSize: { xs: '0.83rem', md: '0.875rem' },
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {resp}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </motion.div>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default ExperienceTimeline;
