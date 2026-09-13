import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Card, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { experiencesApi } from '../../services/api';

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

// High-tech Cyberpunk Bag / Tactical Developer Pack Illustration
const CyberpunkBagGraphic = ({ customImage = null }) => {
    return (
        <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '100%', maxWidth: '440px', margin: '0 auto', position: 'relative' }}
        >
            {/* Ambient Cyber Backlight Glow */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '15%',
                    width: '70%',
                    height: '65%',
                    background: 'radial-gradient(circle, rgba(0,255,65,0.18) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(45px)',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            {customImage ? (
                <Box
                    component="img"
                    src={customImage}
                    alt="Tactical Developer Gear"
                    sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,255,65,0.3)',
                        boxShadow: '0 0 25px rgba(0,255,65,0.2)',
                        position: 'relative',
                        zIndex: 1,
                    }}
                />
            ) : (
                <svg
                    viewBox="0 0 460 460"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 1 }}
                >
                    <defs>
                        <linearGradient id="bagShell" x1="130" y1="120" x2="330" y2="400" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#0d1522" />
                            <stop offset="50%" stopColor="#080d17" />
                            <stop offset="100%" stopColor="#04060c" />
                        </linearGradient>
                        <linearGradient id="bagAccent" x1="160" y1="100" x2="300" y2="380" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#00FF41" />
                            <stop offset="100%" stopColor="rgba(0,255,65,0.15)" />
                        </linearGradient>
                        <linearGradient id="strapGrad" x1="160" y1="60" x2="300" y2="120" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#070a12" />
                            <stop offset="100%" stopColor="#0d1424" />
                        </linearGradient>
                        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Isometric Base Grid Platform */}
                    <polygon
                        points="230,340 400,390 230,440 60,390"
                        fill="#050810"
                        stroke="rgba(0, 255, 65, 0.2)"
                        strokeWidth="1.5"
                    />
                    <line x1="145" y1="365" x2="315" y2="415" stroke="rgba(0,255,65,0.12)" strokeDasharray="4 4" />
                    <line x1="315" y1="365" x2="145" y2="415" stroke="rgba(0,255,65,0.12)" strokeDasharray="4 4" />

                    {/* Top Carry Handle / Heavy Duty Strap */}
                    <path
                        d="M170,140 C170,80 290,80 290,140"
                        stroke="url(#strapGrad)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <path
                        d="M175,135 C175,90 285,90 285,135"
                        stroke="#00FF41"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        fill="none"
                    />

                    {/* Main Tactical Backpack Body */}
                    <path
                        d="M150,130 L310,130 L340,360 L120,360 Z"
                        fill="url(#bagShell)"
                        stroke="#00FF41"
                        strokeWidth="2"
                        filter="url(#neonGlow)"
                    />

                    {/* Front Flap / Compartment Shield */}
                    <polygon
                        points="160,150 300,150 320,280 140,280"
                        fill="#060a12"
                        stroke="rgba(0,255,65,0.4)"
                        strokeWidth="1.5"
                    />

                    {/* Cyberpunk Angular Seams & Vector Traces */}
                    <line x1="160" y1="150" x2="230" y2="220" stroke="rgba(0,255,65,0.3)" strokeWidth="1.5" />
                    <line x1="300" y1="150" x2="230" y2="220" stroke="rgba(0,255,65,0.3)" strokeWidth="1.5" />
                    <line x1="230" y1="220" x2="230" y2="280" stroke="#00FF41" strokeWidth="2" />

                    {/* Quick-Release Magnetic Tactical Buckles */}
                    <rect x="180" y="270" width="24" height="20" rx="3" fill="#0c181f" stroke="#00FF41" strokeWidth="1.5" />
                    <line x1="184" y1="280" x2="200" y2="280" stroke="#00FF41" strokeWidth="2" />
                    <rect x="256" y="270" width="24" height="20" rx="3" fill="#0c181f" stroke="#00FF41" strokeWidth="1.5" />
                    <line x1="260" y1="280" x2="276" y2="280" stroke="#00FF41" strokeWidth="2" />

                    {/* Lower Utility Pocket */}
                    <polygon
                        points="136,295 324,295 334,355 126,355"
                        fill="#09101b"
                        stroke="rgba(0,255,65,0.35)"
                        strokeWidth="1.5"
                    />

                    {/* MOLLE Laser-Cut Tactical Attachment Slots */}
                    <line x1="160" y1="312" x2="300" y2="312" stroke="rgba(0,255,65,0.4)" strokeWidth="3" strokeDasharray="14 10" />
                    <line x1="160" y1="326" x2="300" y2="326" stroke="rgba(0,255,65,0.4)" strokeWidth="3" strokeDasharray="14 10" />
                    <line x1="160" y1="340" x2="300" y2="340" stroke="rgba(0,255,65,0.4)" strokeWidth="3" strokeDasharray="14 10" />

                    {/* Side Compression Straps (Left & Right) */}
                    <path d="M140,180 L115,210 L130,240" stroke="#00FF41" strokeWidth="2.5" fill="none" />
                    <path d="M320,180 L345,210 L330,240" stroke="#00FF41" strokeWidth="2.5" fill="none" />

                    {/* Tactical Status OLED Display on Pocket */}
                    <rect x="185" y="170" width="90" height="38" rx="4" fill="#030806" stroke="#00FF41" strokeWidth="1.2" />
                    <text x="195" y="184" fill="#00FF41" fontSize="8" fontFamily="monospace" fontWeight="bold">
                        TACTICAL // 01
                    </text>
                    <text x="195" y="198" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="monospace">
                        PWR: 100% [OK]
                    </text>
                    <circle cx="265" cy="182" r="2.5" fill="#00FF41" />

                    {/* Floating Holographic Telemetry Tag (Left side) */}
                    <g transform="translate(45, 130)">
                        <rect x="0" y="0" width="86" height="48" rx="6" fill="#050a12" stroke="rgba(0,255,65,0.4)" strokeWidth="1.2" />
                        <text x="10" y="18" fill="#00FF41" fontSize="9" fontFamily="monospace">&lt;DEV_PACK&gt;</text>
                        <text x="10" y="32" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="monospace">WATERPROOF</text>
                        <text x="10" y="42" fill="rgba(0,255,65,0.8)" fontSize="6.5" fontFamily="monospace">ARMORED // 32L</text>
                    </g>

                    {/* Floating Battery Cyber Power Cell (Right side) */}
                    <g transform="translate(340, 230)">
                        <rect x="0" y="0" width="76" height="42" rx="6" fill="#070c17" stroke="#00FF41" strokeWidth="1.2" />
                        <text x="8" y="16" fill="#00FF41" fontSize="7.5" fontFamily="monospace">CORE_BATTERY</text>
                        {/* Power Bars */}
                        <rect x="8" y="24" width="10" height="10" rx="1" fill="#00FF41" />
                        <rect x="22" y="24" width="10" height="10" rx="1" fill="#00FF41" />
                        <rect x="36" y="24" width="10" height="10" rx="1" fill="#00FF41" />
                        <rect x="50" y="24" width="10" height="10" rx="1" fill="rgba(0,255,65,0.3)" />
                    </g>
                </svg>
            )}
        </motion.div>
    );
};

const ExperienceTimeline = ({ customImage = null }) => {
    const [experiences, setExperiences] = useState(fallbackExperiences);
    const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
    const [lineFillHeight, setLineFillHeight] = useState(0);
    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const nodeRefs = useRef([]);

    // Fetch dynamic experiences from backend database
    useEffect(() => {
        let isMounted = true;
        const fetchExperiences = async () => {
            try {
                const res = await experiencesApi.getAll();
                if (isMounted && res.data && res.data.data && res.data.data.length > 0) {
                    setExperiences(res.data.data);
                }
            } catch (err) {
                console.warn('Using fallback experiences:', err.message);
            }
        };

        fetchExperiences();
        return () => {
            isMounted = false;
        };
    }, []);

    // Mathematically synchronized 1:1 scroll tracking
    useEffect(() => {
        let ticking = false;

        const updateScrollHighlight = () => {
            if (!nodeRefs.current || nodeRefs.current.length === 0) return;

            const firstNode = nodeRefs.current[0];
            const lastNode = nodeRefs.current[nodeRefs.current.length - 1];
            if (!firstNode || !lastNode) return;

            const firstRect = firstNode.getBoundingClientRect();
            const lastRect = lastNode.getBoundingClientRect();

            // Center Y of first and last node relative to viewport
            const firstCenterY = firstRect.top + firstRect.height / 2;
            const lastCenterY = lastRect.top + lastRect.height / 2;

            // Reading focal point at 50% of viewport height
            const focalY = window.innerHeight * 0.5;

            // Total vertical distance between first and last node centers
            const totalDistance = Math.max(0, lastCenterY - firstCenterY);

            if (focalY < firstCenterY) {
                // Viewport has not reached first node yet
                setLineFillHeight(0);
                setActiveNodeIndex(-1);
                return;
            }

            // Exact 1:1 linear fill distance in pixels
            const fillPx = Math.min(Math.max(0, focalY - firstCenterY), totalDistance);
            setLineFillHeight(fillPx);

            // Node illuminates the EXACT instant the fill line tip touches its center
            let currentActive = 0;
            nodeRefs.current.forEach((el, idx) => {
                if (!el) return;
                const r = el.getBoundingClientRect();
                const nodeCenter = r.top + r.height / 2;
                if (focalY >= nodeCenter - 1) {
                    currentActive = idx;
                }
            });

            setActiveNodeIndex(currentActive);
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

    const scrollToNode = (index) => {
        const nodeEl = nodeRefs.current[index];
        if (!nodeEl) return;
        const rect = nodeEl.getBoundingClientRect();
        const targetScroll = window.scrollY + rect.top - window.innerHeight * 0.5 + rect.height / 2;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    return (
        <Box id="experience" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
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
                        // About My
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

                {/* 2-Column Grid: Left - Content (Time Track + Cards), Right - Bag Graphic / Image */}
                <Grid container spacing={{ xs: 5, md: 3, lg: 3 }} alignItems="flex-start">
                    {/* Left Column: Cyberpunk Time Track + Experience Cards */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box
                            ref={containerRef}
                            sx={{
                                position: 'relative',
                                pl: { xs: 4, sm: 5, md: 6 },
                            }}
                        >
                            {/* 1. Time Track Vertical Rail (Attached Image Styling) */}
                            {/* Background Muted Path */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: { xs: '12px', sm: '15px', md: '17px' },
                                    top: 18,
                                    bottom: 18,
                                    width: '3px',
                                    background: '#1a1d29', // Dark slate track as in user image
                                    borderRadius: '2px',
                                }}
                            />

                            {/* Dynamic Glowing Fill Path on Scroll */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: { xs: '12px', sm: '15px', md: '17px' },
                                    top: { xs: '26px', sm: '27px', md: '28px' },
                                    width: '3px',
                                    height: `${lineFillHeight}px`,
                                    background: '#00FF41',
                                    boxShadow: '0 0 4px #00FF41, 0 0 8px rgba(0, 255, 65, 0.6)',
                                    borderRadius: '2px',
                                    zIndex: 2,
                                    pointerEvents: 'none',
                                }}
                            />

                            {/* Experience Cards Stack */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4.5 }}>
                                {experiences.map((exp, index) => {
                                    const isActive = activeNodeIndex === index;
                                    const isPassed = activeNodeIndex >= index && activeNodeIndex !== -1;

                                    return (
                                        <Box
                                            key={exp._id || index}
                                            ref={(el) => (cardRefs.current[index] = el)}
                                            sx={{ position: 'relative' }}
                                        >
                                            {/* 2. Trapezium / Rhombus Time Track Node (Attached Image Style) */}
                                            <Box
                                                ref={(el) => (nodeRefs.current[index] = el)}
                                                onClick={() => scrollToNode(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    left: { xs: '-30px', sm: '-37px', md: '-41px' },
                                                    top: 16,
                                                    width: { xs: 20, sm: 22, md: 24 },
                                                    height: { xs: 20, sm: 22, md: 24 },
                                                    transform: 'rotate(45deg)',
                                                    cursor: 'pointer',
                                                    zIndex: 4,
                                                    transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
                                                    // Highlighting on scroll with fill color:
                                                    background: isPassed
                                                        ? '#00FF41' // Filled with neon green
                                                        : '#07090e', // Hollow dark center
                                                    border: '2px solid #00FF41',
                                                    boxShadow: isActive
                                                        ? '0 0 6px #00FF41, 0 0 12px rgba(0, 255, 65, 0.6)'
                                                        : isPassed
                                                        ? '0 0 4px #00FF41'
                                                        : '0 0 2px rgba(0, 255, 65, 0.35)',
                                                    '&:hover': {
                                                        boxShadow: '0 0 10px #00FF41',
                                                    },
                                                }}
                                            >
                                                {/* Inner Center Dot / Core when Active */}
                                                {isActive && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: '50%',
                                                            background: '#ffffff',
                                                            boxShadow: '0 0 1px #ffffff',
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            {/* 3. Cyberpunk Styled Experience Card */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                                whileHover={{ y: -4 }}
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
                                                            ? '0 0 25px rgba(0, 255, 65, 0.22), 0 4px 20px rgba(0, 0, 0, 0.8)'
                                                            : '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 255, 65, 0.04)',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        '&:hover': {
                                                            border: '1px solid #00FF41',
                                                            boxShadow:
                                                                '0 0 25px rgba(0, 255, 65, 0.28), inset 0 0 15px rgba(0, 255, 65, 0.05)',
                                                            // background: '#07080c',
                                                            '& .hud-corner': {
                                                                borderColor: '#00FF41',
                                                                boxShadow: '0 0 8px #00FF41',
                                                            },
                                                            '& .exp-icon-box': {
                                                                color: '#00FF41',
                                                                borderColor: '#00FF41'
                                                            },
                                                        },
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
                                                                background: 'rgba(0, 255, 65, 0.06)',
                                                                border: '1px solid rgba(0, 255, 65, 0.3)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#00FF41',
                                                                flexShrink: 0,
                                                                mt: 0.5,
                                                                boxShadow: '0 0 10px rgba(0, 255, 65, 0.08)',
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
                                                                // COMPANY: {exp.company}
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
                                                        {exp.responsibilities.map((resp, rIdx) => (
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
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            borderColor: '#00FF41',
                                                                            color: '#00FF41',
                                                                            background: 'rgba(0, 255, 65, 0.1)',
                                                                            boxShadow: '0 0 8px rgba(0, 255, 65, 0.3)',
                                                                        },
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
                        </Box>
                    </Grid>

                    {/* Right Column: Cyberpunk Bag Graphic (Image slot) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                            sx={{
                                position: { md: 'sticky' },
                                top: { md: '140px' },
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <CyberpunkBagGraphic customImage={customImage} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ExperienceTimeline;
