import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Card } from '@mui/material';
import { motion } from 'framer-motion';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { experiencesApi } from '../../services/api';
import useCacheSubscription from '../../hooks/useCacheSubscription';

// Fallback initial experiences if offline or during initial fetch
const fallbackExperiences = [
    {
        company: 'Tiger Education Services (Edhike)',
        role: 'JavaScript Developer',
        period: 'Feb 2025 – July 2026',
        active: false,
        location: 'Lucknow, India',
        responsibilities: [
            'Worked on internal applications, lead-generation websites, integrations and data workflows used across the business.',
            'Built and maintained features for lead collection, processing and distribution across client systems.',
            'Developed tools that connected internal workflows with client APIs, Google Sheets and other external services.',
            'Worked on web applications and internal CRM workflows for managing and distributing leads.',
            'Built automation around incoming leads, including routing logic and scheduled distribution requirements.',
            'Worked with Cloudflare, Firebase, Google Apps Script, logging systems and API integrations across multiple projects.'
        ],
        skills: ['JavaScript', 'React.js', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'WebSockets'],
    },
    {
        company: 'Tiger Education Services (Edhike)',
        role: 'Web Developer Intern',
        period: 'Nov 2024 – Jan 2025',
        active: false,
        location: 'Lucknow, India',
        responsibilities: [
            'Built responsive web pages and reusable UI components.',
            'Worked with the design team to translate Figma designs into functional interfaces.',
            'Implemented frontend functionality using JavaScript, HTML, CSS and Tailwind CSS.',
            'Supported website updates, debugging and integration work across company projects.'
        ],
        skills: ['HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript', 'Git', 'Responsive Design'],
    },
];

const ExperienceTimeline = () => {
    const [experiences, setExperiences] = useState(fallbackExperiences);
    const [activeCardIndex, setActiveCardIndex] = useState(-1);
    const cardRefs = useRef([]);

    // Fetch dynamic experiences from backend database
    const fetchExperiences = async () => {
        try {
            const res = await experiencesApi.getAll();
            if (res.data && res.data.data && res.data.data.length > 0) {
                setExperiences(res.data.data);
            }
        } catch (err) {
            console.warn('Using fallback experiences:', err.message);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    // Subscribe to cache invalidation / purge events
    useCacheSubscription('experiences', fetchExperiences);

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
    }, [experiences]);

    return (
        <Box id="experience" sx={{ py: { xs: 5, sm: 7, md: 10 }, position: 'relative' }}>
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
                        Work Experience
                    </Typography>
                </motion.div>

                {/* Alternating Zig-Zag Experience Cards Container */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 3.5, md: 5 },
                        width: '100%',
                    }}
                >
                    {experiences.map((exp, index) => {
                        const isActive = activeCardIndex === index;

                        return (
                            <Box
                                key={exp._id || (exp.company && exp.role ? `${exp.company}-${exp.role}` : exp.company) || exp.period}
                                ref={(el) => (cardRefs.current[index] = el)}
                                sx={{
                                    width: { xs: '100%', md: '58%' },
                                    alignSelf: {
                                        xs: 'center',
                                        md: index % 2 === 0 ? 'flex-start' : 'flex-end',
                                    },
                                    transition: 'transform 0.3s ease',
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
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
                                        {/* Telemetry Header Bar */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                                pb: 1.5,
                                                mb: 2,
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
                                                [ {exp.period} ]
                                            </Box>
                                        </Box>

                                        {/* Role, Company & Icon */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: { xs: 2, sm: 2.5 },
                                                mb: 2,
                                                position: 'relative',
                                                zIndex: 2,
                                            }}
                                        >
                                            {/* Icon Box */}
                                            <Box
                                                className="exp-icon-box"
                                                sx={{
                                                    width: { xs: 46, sm: 52 },
                                                    height: { xs: 46, sm: 52 },
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
                                                <WorkOutlineIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                                            </Box>

                                            <Box sx={{ flex: 1 }}>
                                                {/* Role Title */}
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'Inter, sans-serif',
                                                        fontSize: { xs: '1.05rem', sm: '1.25rem' },
                                                        fontWeight: 800,
                                                        color: '#fff',
                                                        letterSpacing: '0.02em',
                                                        textTransform: 'uppercase',
                                                        lineHeight: 1.25,
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {exp.role}
                                                </Typography>

                                                {/* Company Affiliation */}
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'Fira Code, monospace',
                                                        fontSize: { xs: '0.8rem', sm: '0.86rem' },
                                                        color: '#00FF41',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {`// COMPANY: ${exp.company}`}
                                                </Typography>

                                                {/* Location */}
                                                {exp.location && (
                                                    <Typography
                                                        sx={{
                                                            fontFamily: 'Fira Code, monospace',
                                                            fontSize: '0.72rem',
                                                            color: 'rgba(255, 255, 255, 0.55)',
                                                            mt: 0.3,
                                                        }}
                                                    >
                                                        LOCATION: {exp.location}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Responsibilities List */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1.2,
                                                mb: exp.skills && exp.skills.length > 0 ? 2.5 : 0,
                                                position: 'relative',
                                                zIndex: 2,
                                            }}
                                        >
                                            {(exp.responsibilities || exp.description || []).map((resp, rIdx) => (
                                                <Box
                                                    key={rIdx}
                                                    sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}
                                                >
                                                    <ChevronRightIcon
                                                        sx={{
                                                            color: '#00FF41',
                                                            fontSize: 18,
                                                            flexShrink: 0,
                                                            mt: '3px',
                                                        }}
                                                    />
                                                    <Typography
                                                        sx={{
                                                            color: 'rgba(255, 255, 255, 0.72)',
                                                            fontSize: { xs: '0.82rem', sm: '0.875rem' },
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        {resp}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>

                                        {/* Tech Stack Chips */}
                                        {exp.skills && exp.skills.length > 0 && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 0.8,
                                                    pt: 1.8,
                                                    borderTop: '1px dashed rgba(0, 255, 65, 0.14)',
                                                    position: 'relative',
                                                    zIndex: 2,
                                                }}
                                            >
                                                {exp.skills.map((skill, sIdx) => (
                                                    <Box
                                                        key={sIdx}
                                                        sx={{
                                                            fontFamily: 'Fira Code, monospace',
                                                            fontSize: '0.68rem',
                                                            color: 'rgba(255, 255, 255, 0.75)',
                                                            background: 'rgba(0, 255, 65, 0.04)',
                                                            border: '1px solid rgba(0, 255, 65, 0.2)',
                                                            borderRadius: '3px',
                                                            px: 0.9,
                                                            py: 0.25,
                                                            letterSpacing: '0.03em',
                                                        }}
                                                    >
                                                        [ {skill} ]
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
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

export default ExperienceTimeline;
