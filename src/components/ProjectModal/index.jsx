import React from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Chip,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

/**
 * ProjectModal - Mac OS Window styled project detail modal.
 *
 * Layout:
 * - Top header bar: Mac traffic control dots (red, yellow, green) on left, terminal title in center, close button on right.
 * - Body: 2-column layout (stacks on mobile):
 *    • Left side: high-res project preview image with cyber frame and HUD grid accents.
 *    • Right side:
 *       - Project title
 *       - Links row: [GitHub], [Live External / Demo] with cyberpunk button styling
 *       - Summary description
 *       - Built with / Tech Stack tags
 *       - Detailed overview / architectural takeaways
 */
const ProjectModal = ({ open, onClose, project }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (!project) return null;

    const {
        title,
        description,
        techStack = [],
        githubURL,
        github,
        liveURL,
        demo,
        imageURL,
        image,
        longDescription,
        engineeringOverview,
        overview,
    } = project;

    const resolvedGithub = githubURL || github || '';
    const resolvedLive = liveURL || demo || '';
    const resolvedImage = imageURL || image || '';
    const detailedDescription = description || longDescription || '';
    const architecturalNote =
        engineeringOverview ||
        overview ||
        (project.title === 'Vertex LMS'
            ? 'A personal engineering project exploring how learning content can be structured, searched and navigated more effectively.'
            : project.title === 'SyncWA'
            ? 'Extending a WhatsApp CRM into a broader lead-management platform with authentication, multi-client administration and CRM workflows.'
            : 'Engineered with a focus on scalable architecture, clean separation of concerns, and resilient real-world performance.');

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason === 'backdropClick') return;
                if (onClose) onClose(event, reason);
            }}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    background: '#040508',
                    border: '1px solid rgba(0, 255, 65, 0.3)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 255, 65, 0.15)',
                    backdropFilter: 'blur(16px)',
                    m: { xs: 1.5, sm: 2, md: 3 },
                },
            }}
        >
            {/* Mac OS Window Header Bar */}
            <Box
                sx={{
                    px: 2.5,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#0a0d14',
                    borderBottom: '1px solid rgba(0, 255, 65, 0.15)',
                }}
            >
                {/* Classic Mac 3 Control Dots */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        onClick={onClose}
                        role="button"
                        aria-label="Close window dot"
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: '#ff5f56',
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease',
                            '&:hover': { transform: 'scale(1.15)' },
                        }}
                    />
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: '#ffbd2e',
                        }}
                    />
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: '#27c93f',
                        }}
                    />
                </Box>

                {/* Window Terminal Header Title */}
                <Typography
                    sx={{
                        fontFamily: 'Fira Code, monospace',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.45)',
                        letterSpacing: '0.08em',
                        userSelect: 'none',
                    }}
                >
                    project_details.sh
                </Typography>

                {/* Close Button */}
                <IconButton
                    size="small"
                    onClick={onClose}
                    aria-label="Close modal"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        p: 0.5,
                        '&:hover': { color: '#00FF41', background: 'rgba(0, 255, 65, 0.08)' },
                    }}
                >
                    <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Box>

            {/* Modal Body: 2-Column Split Layout */}
            <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1.05fr 1.2fr' },
                        gap: { xs: 3, md: 4 },
                        alignItems: 'start',
                    }}
                >
                    {/* LEFT COLUMN: Project Image with HUD Framing */}
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                paddingTop: { xs: '60%', md: '75%' },
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid rgba(0, 255, 65, 0.25)',
                                background: '#020305',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
                            }}
                        >
                            {/* HUD Corner Reticles */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 6,
                                    left: 6,
                                    width: 10,
                                    height: 10,
                                    borderTop: '2px solid #00FF41',
                                    borderLeft: '2px solid #00FF41',
                                    zIndex: 3,
                                    pointerEvents: 'none',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 6,
                                    right: 6,
                                    width: 10,
                                    height: 10,
                                    borderTop: '2px solid #00FF41',
                                    borderRight: '2px solid #00FF41',
                                    zIndex: 3,
                                    pointerEvents: 'none',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 6,
                                    left: 6,
                                    width: 10,
                                    height: 10,
                                    borderBottom: '2px solid #00FF41',
                                    borderLeft: '2px solid #00FF41',
                                    zIndex: 3,
                                    pointerEvents: 'none',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 6,
                                    right: 6,
                                    width: 10,
                                    height: 10,
                                    borderBottom: '2px solid #00FF41',
                                    borderRight: '2px solid #00FF41',
                                    zIndex: 3,
                                    pointerEvents: 'none',
                                }}
                            />

                            {/* Image Component */}
                            {resolvedImage ? (
                                <Box
                                    component="img"
                                    src={resolvedImage}
                                    alt={title}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'rgba(0, 255, 65, 0.4)',
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    [NO_IMAGE_AVAILABLE]
                                </Box>
                            )}
                        </Box>

                        {/* Status Telemetry */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 1.5,
                                px: 0.5,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.7rem',
                                    color: '#00FF41',
                                    letterSpacing: '0.08em',
                                }}
                            >
                                {'// STATUS: VERIFIED_DEPLOYMENT'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        background: '#00FF41',
                                        boxShadow: '0 0 6px #00FF41',
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.68rem',
                                        color: 'rgba(255, 255, 255, 0.55)',
                                    }}
                                >
                                    ONLINE
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* RIGHT COLUMN: Project Details & Meta */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
                        {/* Title & Links Row */}
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                    mb: 1.5,
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: { xs: '1.4rem', sm: '1.7rem', md: '1.9rem' },
                                        fontWeight: 900,
                                        color: '#ffffff',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {title}
                                </Typography>

                                {/* Links: GitHub & Live External */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {resolvedGithub && (
                                        <Tooltip title="View GitHub Repository" arrow placement="top">
                                            <IconButton
                                                component="a"
                                                href={resolvedGithub}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="small"
                                                sx={{
                                                    color: '#ffffff',
                                                    border: '1px solid rgba(0, 255, 65, 0.25)',
                                                    borderRadius: '6px',
                                                    p: 0.8,
                                                    background: 'rgba(0, 255, 65, 0.04)',
                                                    transition: 'all 0.25s ease',
                                                    '&:hover': {
                                                        color: '#00FF41',
                                                        borderColor: '#00FF41',
                                                        background: 'rgba(0, 255, 65, 0.12)',
                                                        boxShadow: '0 0 14px rgba(0, 255, 65, 0.35)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                }}
                                            >
                                                <GitHubIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {resolvedLive && resolvedLive !== '#' && (
                                        <Tooltip title="Open Live Deployment" arrow placement="top">
                                            <IconButton
                                                component="a"
                                                href={resolvedLive}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="small"
                                                sx={{
                                                    color: '#ffffff',
                                                    border: '1px solid rgba(0, 255, 65, 0.25)',
                                                    borderRadius: '6px',
                                                    p: 0.8,
                                                    background: 'rgba(0, 255, 65, 0.04)',
                                                    transition: 'all 0.25s ease',
                                                    '&:hover': {
                                                        color: '#00FF41',
                                                        borderColor: '#00FF41',
                                                        background: 'rgba(0, 255, 65, 0.12)',
                                                        boxShadow: '0 0 14px rgba(0, 255, 65, 0.35)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                }}
                                            >
                                                <OpenInNewIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Box>

                            {/* Summary description */}
                            <Typography
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: { xs: '0.92rem', sm: '0.98rem' },
                                    color: 'rgba(255, 255, 255, 0.85)',
                                    lineHeight: 1.65,
                                }}
                            >
                                {detailedDescription}
                            </Typography>
                        </Box>

                        {/* Built with / Tech Stack Chips */}
                        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 2 }}>
                            <Typography
                                sx={{
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.72rem',
                                    color: '#00FF41',
                                    letterSpacing: '0.12em',
                                    mb: 1.2,
                                    fontWeight: 600,
                                }}
                            >
                                {'// BUILT WITH:'}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {techStack.map((tech) => (
                                    <Chip
                                        key={typeof tech === 'string' ? tech : (tech._id || tech.name)}
                                        label={typeof tech === 'string' ? tech : tech.name}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(0, 255, 65, 0.05)',
                                            border: '1px solid rgba(0, 255, 65, 0.2)',
                                            color: '#00FF41',
                                            fontSize: '0.72rem',
                                            fontFamily: 'Fira Code, monospace',
                                            fontWeight: 500,
                                            borderRadius: '4px',
                                            height: 24,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 255, 65, 0.12)',
                                                borderColor: '#00FF41',
                                                boxShadow: '0 0 10px rgba(0, 255, 65, 0.25)',
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Architectural Overview / Engineering Focus */}
                        <Box
                            sx={{
                                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                pt: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.72rem',
                                    color: '#00FF41',
                                    letterSpacing: '0.12em',
                                    mb: 1,
                                    fontWeight: 600,
                                }}
                            >
                                {'// ENGINEERING_OVERVIEW:'}
                            </Typography>
                            <Box
                                sx={{
                                    p: 1.5,
                                    background: 'rgba(0, 255, 65, 0.02)',
                                    border: '1px solid rgba(0, 255, 65, 0.12)',
                                    borderRadius: '6px',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '0.86rem',
                                        color: 'rgba(255, 255, 255, 0.72)',
                                        lineHeight: 1.65,
                                    }}
                                >
                                    {architecturalNote}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectModal;
