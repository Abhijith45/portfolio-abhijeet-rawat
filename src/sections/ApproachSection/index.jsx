import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const steps = [
    {
        id: '01',
        title: 'UNDERSTAND',
        subtitle: 'What are we actually trying to solve?',
        description:
            'Before choosing a framework or database, I try to understand the actual problem, the people using the system and the constraints around it.',
        tags: ['USERS', 'REQUIREMENTS', 'CONSTRAINTS'],
    },
    {
        id: '02',
        title: 'BREAK IT DOWN',
        subtitle: 'Turn complexity into smaller problems.',
        description:
            'Complex systems fail in complex ways. I deconstruct large challenges into isolated modules, verifiable inputs, and clean data contracts before writing production logic.',
        tags: ['DECOMPOSITION', 'DATA FLOW', 'INTERFACE CONTRACTS'],
    },
    {
        id: '03',
        title: 'BUILD',
        subtitle: 'Choose the simplest architecture that fits.',
        description:
            'Avoid premature optimization. Pick the simplest stack, reliable patterns, and robust schemas that deliver value fast and scale predictably.',
        tags: ['ARCHITECTURE', 'SIMPLICITY', 'CLEAN CODE'],
    },
    {
        id: '04',
        title: 'DEBUG',
        subtitle: 'Find what breaks outside the happy path.',
        description:
            'Edge cases define reliability. I test failure modes, latency spikes, rate limits, and unauthenticated states to guarantee resilience under pressure.',
        tags: ['EDGE CASES', 'ERROR HANDLING', 'STRESS TESTING'],
    },
    {
        id: '05',
        title: 'OWN',
        subtitle: 'Ship it. Maintain it. Improve it.',
        description:
            'Software is living infrastructure. True engineering ownership means monitoring health metrics, listening to user feedback, and continuously optimizing.',
        tags: ['DEPLOYMENT', 'OBSERVABILITY', 'ITERATION'],
    },
];

const ApproachSection = () => {
    // Open the first item by default
    const [selectedId, setSelectedId] = useState('01');
    const [hoveredId, setHoveredId] = useState(null);

    // If a row is hovered, expand it; otherwise show selected row (or none if clicked again)
    const activeId = hoveredId !== null ? hoveredId : selectedId;

    const handleToggle = (id) => {
        setSelectedId((prev) => (prev === id ? null : id));
    };

    return (
        <Box
            component="section"
            id="approach"
            sx={{
                py: { xs: 8, sm: 10, md: 12 },
                position: 'relative',
                background: 'transparent',
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Section Header */}
                <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                color: '#00FF41',
                                letterSpacing: '0.2em',
                                mb: 1.5,
                                fontWeight: 500,
                            }}
                        >
                            // HOW I APPROACH PROBLEMS //
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: { xs: '1.6rem', sm: '2.2rem', md: '2.8rem' },
                                fontWeight: 900,
                                letterSpacing: '-0.02em',
                                lineHeight: 1.15,
                                color: '#ffffff',
                                textTransform: 'uppercase',
                            }}
                        >
                            I don't start with the code.{' '}
                            <Box
                                component="span"
                                sx={{
                                    display: { xs: 'inline', sm: 'inline' },
                                    color: '#00FF41',
                                    textShadow: '0 0 25px rgba(0,255,65,0.3)',
                                }}
                            >
                                I start with the problem.
                            </Box>
                        </Typography>
                    </motion.div>
                </Box>

                {/* Cyberpunk Accordion Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <Box
                        sx={{
                            background: 'transparent',
                            border: '1px solid rgba(0, 255, 65, 0.2)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        }}
                    >
                        {steps.map((step, idx) => {
                            const isExpanded = activeId === step.id;
                            const isHovered = hoveredId === step.id;
                            const isLast = idx === steps.length - 1;

                            return (
                                <Box
                                    key={step.id}
                                    onMouseEnter={() => setHoveredId(step.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    sx={{
                                        borderBottom: isLast ? 'none' : '1px solid rgba(0, 255, 65, 0.12)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: isExpanded
                                            ? 'rgba(0, 255, 65, 0.035)'
                                            : isHovered
                                            ? 'rgba(255, 255, 255, 0.02)'
                                            : 'transparent',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: '3px',
                                            background: '#00FF41',
                                            opacity: isExpanded ? 1 : isHovered ? 0.6 : 0,
                                            boxShadow: isExpanded ? '0 0 12px #00FF41' : 'none',
                                            transition: 'opacity 0.25s ease',
                                        },
                                    }}
                                >
                                    {/* Header Row — Clickable */}
                                    <Box
                                        onClick={() => handleToggle(step.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleToggle(step.id);
                                            }
                                        }}
                                        aria-expanded={isExpanded}
                                        sx={{
                                            py: { xs: 2.5, sm: 3, md: 3.5 },
                                            px: { xs: 2, sm: 3.5, md: 4.5 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            gap: 2,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3, md: 4 }, flex: 1, minWidth: 0 }}>
                                            {/* Step ID */}
                                            <Typography
                                                sx={{
                                                    fontFamily: 'Fira Code, monospace',
                                                    fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
                                                    fontWeight: 700,
                                                    color: isExpanded ? '#00FF41' : 'rgba(255, 255, 255, 0.4)',
                                                    letterSpacing: '0.05em',
                                                    transition: 'color 0.25s ease',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {step.id}
                                            </Typography>

                                            {/* Title & Subtitle Stack */}
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'baseline' }, gap: { xs: 0.5, md: 3 }, flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'Inter, sans-serif',
                                                        fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                                                        fontWeight: 800,
                                                        letterSpacing: '0.04em',
                                                        color: isExpanded ? '#ffffff' : isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                                                        textTransform: 'uppercase',
                                                        transition: 'color 0.25s ease',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {step.title}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontFamily: 'Fira Code, monospace',
                                                        fontSize: { xs: '0.78rem', sm: '0.85rem' },
                                                        color: 'rgba(255, 255, 255, 0.55)',
                                                        lineHeight: 1.4,
                                                    }}
                                                >
                                                    {step.subtitle}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Toggle Bracketed Icon [ + ] / [ − ] */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                fontFamily: 'Fira Code, monospace',
                                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                                fontWeight: 700,
                                                color: isExpanded ? '#00FF41' : 'rgba(255, 255, 255, 0.45)',
                                                border: `1px solid ${isExpanded ? 'rgba(0, 255, 65, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
                                                borderRadius: '6px',
                                                px: { xs: 1, sm: 1.5 },
                                                py: 0.5,
                                                background: isExpanded ? 'rgba(0, 255, 65, 0.08)' : 'transparent',
                                                transition: 'all 0.25s ease',
                                                flexShrink: 0,
                                                '&:hover': {
                                                    borderColor: '#00FF41',
                                                    color: '#00FF41',
                                                },
                                            }}
                                        >
                                            <Typography component="span" sx={{ fontSize: 'inherit', fontFamily: 'inherit' }}>[</Typography>
                                            {isExpanded ? (
                                                <RemoveIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />
                                            ) : (
                                                <AddIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />
                                            )}
                                            <Typography component="span" sx={{ fontSize: 'inherit', fontFamily: 'inherit' }}>]</Typography>
                                        </Box>
                                    </Box>

                                    {/* Expandable Revealed Content */}
                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                key="content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{
                                                    height: 'auto',
                                                    opacity: 1,
                                                    transition: {
                                                        height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                                                        opacity: { duration: 0.25, delay: 0.1 },
                                                    },
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                    transition: {
                                                        height: { duration: 0.25, ease: 'easeInOut' },
                                                        opacity: { duration: 0.15 },
                                                    },
                                                }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <Box
                                                    sx={{
                                                        pt: 0,
                                                        pb: { xs: 3, sm: 3.5 },
                                                        px: { xs: 2, sm: 3.5, md: 4.5 },
                                                        pl: { xs: 2, sm: 'calc(3.5rem + 16px)', md: 'calc(4.5rem + 24px)' },
                                                    }}
                                                >
                                                    {/* Breadcrumb / Tagline */}
                                                    <Typography
                                                        sx={{
                                                            fontFamily: 'Fira Code, monospace',
                                                            fontSize: { xs: '0.75rem', sm: '0.82rem' },
                                                            color: '#00FF41',
                                                            letterSpacing: '0.1em',
                                                            mb: 1.5,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {step.id} / {step.title}
                                                    </Typography>

                                                    {/* Paragraph Description */}
                                                    <Typography
                                                        sx={{
                                                            fontFamily: 'Inter, sans-serif',
                                                            fontSize: { xs: '0.9rem', sm: '0.98rem' },
                                                            color: 'rgba(255, 255, 255, 0.82)',
                                                            lineHeight: 1.7,
                                                            maxWidth: '750px',
                                                            mb: 2.5,
                                                        }}
                                                    >
                                                        {step.description}
                                                    </Typography>

                                                    {/* Bracketed Cyberpunk Tags [ USERS ] [ REQUIREMENTS ] [ CONSTRAINTS ] */}
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 1.5 } }}>
                                                        {step.tags.map((tag, tagIdx) => (
                                                            <Box
                                                                key={tagIdx}
                                                                sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    fontFamily: 'Fira Code, monospace',
                                                                    fontSize: { xs: '0.68rem', sm: '0.75rem' },
                                                                    fontWeight: 600,
                                                                    letterSpacing: '0.08em',
                                                                    color: '#00FF41',
                                                                    background: 'rgba(0, 255, 65, 0.05)',
                                                                    border: '1px solid rgba(0, 255, 65, 0.25)',
                                                                    borderRadius: '4px',
                                                                    px: 1.5,
                                                                    py: 0.6,
                                                                    transition: 'all 0.2s ease',
                                                                    '&:hover': {
                                                                        borderColor: '#00FF41',
                                                                        background: 'rgba(0, 255, 65, 0.12)',
                                                                        boxShadow: '0 0 12px rgba(0, 255, 65, 0.3)',
                                                                        transform: 'translateY(-1px)',
                                                                    },
                                                                }}
                                                            >
                                                                [ {tag} ]
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Box>
                            );
                        })}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ApproachSection;
