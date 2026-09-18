import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Card } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';

// Student SVG Icon with clean cyber vector lines
const StudentIcon = ({ size = 28 }) => (
    <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 16 16"
        height={size}
        width={size}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"></path>
        <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"></path>
    </svg>
);

const educationList = [
    {
        recordId: 'SYS_EDU_#01',
        degree: 'Bachelor of Technology',
        stream: 'Computer Science & Engineering',
        institution: 'Dr APJ Abdul Kalam Technical University, Lucknow',
        duration: '2020 – 2024',
        status: 'GRADUATED // HONORS',
        skills: ['DSA & Algorithms', 'System Architecture', 'Operating Systems', 'Computer Networks'],
        icon: <SchoolIcon sx={{ fontSize: { xs: 26, sm: 30 } }} />,
    },
    {
        recordId: 'SYS_EDU_#02',
        degree: 'Higher Secondary School',
        stream: null,
        institution: 'Swarnim Public School, Lucknow',
        duration: '2018 – 2020',
        status: 'COMPLETED // CBSE',
        skills: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
        icon: <StudentIcon size={26} />,
    },
];

const EducationSection = () => {
    const [activeCardIndex, setActiveCardIndex] = useState(-1);
    const cardRefs = useRef([]);

    // Viewport Center Scroll Tracking: highlight closest card in center of viewport
    useEffect(() => {
        let ticking = false;

        const updateScrollHighlight = () => {
            const focalY = window.innerHeight * 0.5;
            let closestIndex = -1;
            let minDistance = Infinity;

            cardRefs.current.forEach((el, idx) => {
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(focalY - cardCenter);

                // Only evaluate if card is visible within the viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = idx;
                    }
                }
            });

            setActiveCardIndex(closestIndex);
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateScrollHighlight();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        // Initial evaluation
        updateScrollHighlight();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <Box id="education" sx={{ py: { xs: 5, sm: 7, md: 10 }, position: 'relative' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Section Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <Typography
                        align="center"
                        sx={{
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            color: '#00FF41',
                            letterSpacing: '0.2em',
                            mb: 1.5,
                        }}
                    >
                        {'// About My'}
                    </Typography>
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                            fontWeight: 800,
                            color: '#fff',
                            letterSpacing: '-0.02em',
                            mb: { xs: 4, md: 6 },
                        }}
                    >
                        Education
                    </Typography>
                </motion.div>

                {/* Education Cards Stack */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 3.5, md: 4.5 },
                        alignItems: 'center',
                        width: { xs: '100%', sm: '85%', md: '65%' },
                        mx: 'auto',
                    }}
                >
                    {educationList.map((item, index) => {
                        const isActive = activeCardIndex === index;

                        return (
                            <Box
                                key={item._id || item.degree || item.institution}
                                ref={(el) => (cardRefs.current[index] = el)}
                                sx={{ width: '100%' }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    style={{ width: '100%' }}
                                >
                                    <Card
                                        sx={{
                                            width: '100%',
                                            background: 'none',
                                            border: isActive
                                                ? '1px solid #00FF41'
                                                : '1px solid rgba(0, 255, 65, 0.18)',
                                            borderRadius: '8px',
                                            p: { xs: 2.5, sm: 3.2 },
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: isActive
                                                ? '0 0 25px rgba(0, 255, 65, 0.28), inset 0 0 15px rgba(0, 255, 65, 0.05), 0 4px 20px rgba(0, 0, 0, 0.8)'
                                                : '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 255, 65, 0.04)',
                                            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                        }}
                                    >
                                        {/* Atmospheric Subtle Bottom Gradient */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: '60%',
                                                background:
                                                    'radial-gradient(ellipse at 50% 100%, rgba(0, 255, 65, 0.08) 0%, transparent 70%)',
                                                pointerEvents: 'none',
                                            }}
                                        />

                                        {/* Cyberpunk Telemetry Top Header */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                                pb: 1.5,
                                                mb: 2.5,
                                                borderBottom: '1px solid rgba(0, 255, 65, 0.12)',
                                                position: 'relative',
                                                zIndex: 2,
                                            }}
                                        >
                                            {/* Duration Badge */}
                                            <Box
                                                sx={{
                                                    fontFamily: 'Fira Code, monospace',
                                                    fontSize: '0.72rem',
                                                    color: '#00FF41',
                                                    background: 'rgba(0, 255, 65, 0.07)',
                                                    border: '1px solid rgba(0, 255, 65, 0.3)',
                                                    borderRadius: '4px',
                                                    px: 1.2,
                                                    py: 0.25,
                                                    letterSpacing: '0.06em',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                [ {item.duration} ]
                                            </Box>
                                        </Box>

                                        {/* Main Icon & Academic Details */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: { xs: 2.2, sm: 3 },
                                                position: 'relative',
                                                zIndex: 2,
                                            }}
                                        >
                                            {/* Left Icon Box */}
                                            <Box
                                                className="education-icon-box"
                                                sx={{
                                                    width: { xs: 54, sm: 62 },
                                                    height: { xs: 54, sm: 62 },
                                                    borderRadius: '8px',
                                                    background: isActive ? 'rgba(0, 255, 65, 0.12)' : 'rgba(0, 255, 65, 0.06)',
                                                    border: isActive ? '1px solid #00FF41' : '1px solid rgba(0, 255, 65, 0.3)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#00FF41',
                                                    flexShrink: 0,
                                                    mt: 0.5,
                                                    boxShadow: isActive ? '0 0 12px rgba(0, 255, 65, 0.35)' : '0 0 10px rgba(0, 255, 65, 0.08)',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                }}
                                            >
                                                {item.icon}
                                            </Box>

                                            {/* Content Block */}
                                            <Box sx={{ flex: 1 }}>
                                                {/* Degree / School Title */}
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'Inter, sans-serif',
                                                        fontSize: { xs: '1.05rem', sm: '1.25rem' },
                                                        fontWeight: 800,
                                                        color: '#fff',
                                                        letterSpacing: '0.02em',
                                                        textTransform: 'uppercase',
                                                        lineHeight: 1.25,
                                                    }}
                                                >
                                                    {item.degree}
                                                </Typography>

                                                {/* Stream with Terminal Prompt Indicator */}
                                                {item.stream && (
                                                    <Box
                                                        className="cyber-stream-tag"
                                                        sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontFamily: 'Fira Code, monospace',
                                                                fontSize: '0.78rem',
                                                                color: '#00FF41',
                                                                fontWeight: 600,
                                                                letterSpacing: '0.04em',
                                                            }}
                                                        >
                                                            {item.stream}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {/* Institution / University */}
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'Fira Code, monospace',
                                                        fontSize: { xs: '0.8rem', sm: '0.86rem' },
                                                        color: 'rgba(255, 255, 255, 0.72)',
                                                        lineHeight: 1.6,
                                                        mt: 0.8,
                                                    }}
                                                >
                                                    {item.institution}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
};

export default EducationSection;
