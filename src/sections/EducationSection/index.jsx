import React from 'react';
import { Box, Container, Typography, Card, Grid } from '@mui/material';
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

// Cyberpunk Isometric Workstation & Education Illustration
const EducationGraphic = () => {
    return (
        <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '100%', maxWidth: '440px', margin: '0 auto', position: 'relative' }}
        >
            {/* Ambient Backlight Glow */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '20%',
                    width: '60%',
                    height: '60%',
                    background: 'radial-gradient(circle, rgba(0,255,65,0.18) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(40px)',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            <svg
                viewBox="0 0 500 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 1 }}
            >
                <defs>
                    <linearGradient id="cyberPlatform" x1="250" y1="260" x2="250" y2="400" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#0d1424" />
                        <stop offset="100%" stopColor="#04060c" />
                    </linearGradient>
                    <linearGradient id="cyberBorder" x1="100" y1="260" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#00FF41" />
                        <stop offset="50%" stopColor="rgba(0,255,65,0.2)" />
                        <stop offset="100%" stopColor="#00FF41" />
                    </linearGradient>
                    <linearGradient id="screenGrad" x1="160" y1="90" x2="340" y2="240" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#050e08" />
                        <stop offset="100%" stopColor="#08150c" />
                    </linearGradient>
                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Isometric Base Platform */}
                <polygon
                    points="250,250 450,330 250,410 50,330"
                    fill="url(#cyberPlatform)"
                    stroke="url(#cyberBorder)"
                    strokeWidth="2"
                />
                {/* Isometric Platform Thickness */}
                <polygon
                    points="50,330 250,410 250,422 50,342"
                    fill="#030509"
                    stroke="rgba(0,255,65,0.3)"
                    strokeWidth="1"
                />
                <polygon
                    points="450,330 250,410 250,422 450,342"
                    fill="#020306"
                    stroke="rgba(0,255,65,0.2)"
                    strokeWidth="1"
                />

                {/* Grid lines on base platform */}
                <line x1="150" y1="290" x2="350" y2="370" stroke="rgba(0,255,65,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="100" y1="310" x2="300" y2="390" stroke="rgba(0,255,65,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="350" y1="290" x2="150" y2="370" stroke="rgba(0,255,65,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="400" y1="310" x2="200" y2="390" stroke="rgba(0,255,65,0.15)" strokeWidth="1" strokeDasharray="4 4" />

                {/* Laptop Base (Keyboard) */}
                <polygon
                    points="250,240 370,285 250,330 130,285"
                    fill="#090d16"
                    stroke="rgba(0,255,65,0.5)"
                    strokeWidth="1.5"
                />
                {/* Trackpad */}
                <polygon points="250,290 280,302 250,314 220,302" fill="rgba(0,255,65,0.1)" stroke="rgba(0,255,65,0.3)" strokeWidth="1" />
                {/* Keyboard Grid */}
                <polygon points="250,248 340,282 250,300 160,282" fill="#05080e" stroke="rgba(0,255,65,0.2)" strokeWidth="1" />

                {/* Laptop Screen (Upright) */}
                <polygon
                    points="150,110 350,110 350,255 150,255"
                    fill="url(#screenGrad)"
                    stroke="#00FF41"
                    strokeWidth="2"
                    filter="url(#glowEffect)"
                />
                {/* Inner Screen Surface */}
                <rect x="156" y="116" width="188" height="133" fill="#040906" rx="4" />

                {/* Screen Header / Controls */}
                <rect x="156" y="116" width="188" height="16" fill="#07140b" />
                <circle cx="166" cy="124" r="3" fill="#ff5f56" />
                <circle cx="176" cy="124" r="3" fill="#ffbd2e" />
                <circle cx="186" cy="124" r="3" fill="#27c93f" />
                <text x="210" y="127" fill="rgba(0,255,65,0.6)" fontSize="7" fontFamily="monospace">engineering_core.js</text>

                {/* Terminal Lines on Screen */}
                <text x="168" y="146" fill="#00FF41" fontSize="9" fontFamily="monospace">&gt; B.Tech Computer Science</text>
                <text x="168" y="160" fill="rgba(255,255,255,0.85)" fontSize="8" fontFamily="monospace">const status = 'GRADUATED';</text>
                <text x="168" y="174" fill="rgba(0,255,65,0.7)" fontSize="8" fontFamily="monospace">skills: ['React', 'Node.js', 'DSA']</text>
                <text x="168" y="188" fill="#4ade80" fontSize="8" fontFamily="monospace">&gt; System: Compile Success (100%)</text>

                {/* Mini analytics bar chart on screen */}
                <rect x="170" y="210" width="12" height="26" fill="rgba(0,255,65,0.3)" rx="1" />
                <rect x="188" y="198" width="12" height="38" fill="#00FF41" rx="1" />
                <rect x="206" y="204" width="12" height="32" fill="rgba(0,255,65,0.6)" rx="1" />
                <rect x="224" y="192" width="12" height="44" fill="#00FF41" rx="1" />

                {/* Screen Camera Dot */}
                <circle cx="250" cy="113" r="2" fill="rgba(0,255,65,0.8)" />

                {/* Floating Graduation Cap */}
                <g transform="translate(60, 100)">
                    <polygon points="50,15 95,35 50,55 5,35" fill="#05070c" stroke="#00FF41" strokeWidth="2" filter="url(#glowEffect)" />
                    <path d="M25,45 L25,62 C25,74 75,74 75,62 L75,45" fill="#080e14" stroke="#00FF41" strokeWidth="1.5" />
                    <circle cx="50" cy="35" r="2.5" fill="#ffd700" />
                    <line x1="50" y1="35" x2="80" y2="48" stroke="#ffd700" strokeWidth="1.5" />
                    <circle cx="80" cy="50" r="2" fill="#ffd700" />
                </g>

                {/* Floating Code Badge (Right side) */}
                <g transform="translate(365, 120)">
                    <rect x="0" y="0" width="75" height="50" rx="8" fill="#0a0f1d" stroke="rgba(0,255,65,0.4)" strokeWidth="1.5" />
                    <text x="12" y="22" fill="#00FF41" fontSize="12" fontFamily="monospace">&lt;CS/IT&gt;</text>
                    <text x="12" y="38" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="monospace">AKTU '24</text>
                </g>

                {/* Floating Data Cylinder (Left base) */}
                <g transform="translate(85, 270)">
                    <ellipse cx="25" cy="10" rx="22" ry="7" fill="#09131d" stroke="#00FF41" strokeWidth="1.5" />
                    <path d="M3,10 L3,35 C3,42 47,42 47,35 L47,10" fill="#050b12" stroke="#00FF41" strokeWidth="1.5" />
                    <path d="M3,22 C3,29 47,29 47,22" stroke="rgba(0,255,65,0.4)" strokeWidth="1" />
                    <ellipse cx="25" cy="10" rx="14" ry="4" fill="rgba(0,255,65,0.15)" />
                </g>

                {/* Floating Cube (Right base) */}
                <g transform="translate(375, 275)">
                    <polygon points="25,5 45,16 25,27 5,16" fill="#08101a" stroke="#00FF41" strokeWidth="1.2" />
                    <polygon points="5,16 25,27 25,50 5,39" fill="#04080e" stroke="rgba(0,255,65,0.4)" strokeWidth="1" />
                    <polygon points="45,16 25,27 25,50 45,39" fill="#060c14" stroke="rgba(0,255,65,0.4)" strokeWidth="1" />
                </g>
            </svg>
        </motion.div>
    );
};

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
    return (
        <Box id="education" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
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
                        Education
                    </Typography>
                </motion.div>

                {/* Responsive 2-Column Layout */}
                <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} marginTop={3} alignItems="center">
                    {/* Left Column: 3D Isometric Workstation Illustration */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <EducationGraphic />
                        </Box>
                    </Grid>

                    {/* Right Column: Cyberpunk Styled Education Cards */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                            {educationList.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    whileHover={{ y: -5 }}
                                    style={{ height: '100%', display: 'flex' }}
                                >
                                    <Card
                                        sx={{
                                            width: '100%',
                                            background: 'none',
                                            border: '1px solid rgba(0, 255, 65, 0.18)',
                                            borderRadius: '8px',
                                            p: { xs: 2.5, sm: 3.2 },
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 255, 65, 0.04)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                border: '1px solid #00FF41',
                                                background: '#07080c',
                                                // boxShadow: '0 0 25px rgba(0, 255, 65, 0.28), inset 0 0 15px rgba(0, 255, 65, 0.05)',
                                                '& .hud-corner': {
                                                    borderColor: '#00FF41',
                                                    boxShadow: '0 0 8px #00FF41',
                                                },
                                                '& .education-icon-box': {
                                                    color: '#00FF41',
                                                    borderColor: '#00FF41'
                                                }
                                            },
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

                                        {/* 1. Cyberpunk Telemetry Top Header */}
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

                                        {/* 2. Main Icon & Academic Details */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: { xs: 2.2, sm: 3 },
                                                position: 'relative',
                                                zIndex: 2,
                                            }}
                                        >
                                            {/* Left Icon Box with HUD Chamfered Border */}
                                            <Box
                                                className="education-icon-box"
                                                sx={{
                                                    width: { xs: 54, sm: 62 },
                                                    height: { xs: 54, sm: 62 },
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
                                                        lineHeight: 1.25
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
                                                            transition: 'all 0.2s ease',
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
                                                        mt:1
                                                    }}
                                                >
                                                    {item.institution}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </motion.div>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default EducationSection;
