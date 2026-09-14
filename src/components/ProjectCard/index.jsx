import React, { useState } from 'react';
import { Card, CardContent, Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';
import ProjectModal from '../ProjectModal';

const ProjectCard = ({ project }) => {
    const [modalOpen, setModalOpen] = useState(false);
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
    } = project;

    const resolvedGithub = githubURL || github || '';
    const resolvedLive = liveURL || demo || '';
    const resolvedImage = imageURL || image || '';

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ height: '100%', display: 'flex' }}
        >
            <Card
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#07080c11',
                    border: '1px solid rgba(0, 255, 65, 0.1)',
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 15px rgba(0, 255, 65, 0.04)',
                    '&:hover': {
                        border: '1px solid #00FF41',
                        boxShadow: '0 0 25px rgba(0, 255, 65, 0.35), inset 0 0 15px rgba(0, 255, 65, 0.08)',
                        background: '#040508',
                        '& .project-media-container': {
                            // border: '1px solid #00FF41',
                        },
                        '& .project-title-text': {
                            color: '#00ff41'
                        },
                        '& .external-icon-link': {
                            color: 'rgba(255, 255, 255, 0.95)',
                            borderColor: 'rgba(255, 255, 255, 0.55)'
                        },
                    }
                }}
            >
                {/* Media Container with HUD Blueprint Grid & Targeting Corner Brackets */}
                <Box
                    className='project-media-container'
                    sx={{
                        p: 1,
                        position: 'relative',
                        // background: '#040508',
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '56%',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid rgba(0, 255, 65, 0.2)',
                            backgroundImage: `
                                linear-gradient(rgba(0, 255, 65, 0.07) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0, 255, 65, 0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '14px 14px',
                        }}
                    >
                        {/* HUD Targeting Corner Brackets */}
                        <Box
                            className="project-hud-crosshair"
                            sx={{
                                position: 'absolute',
                                top: 5,
                                left: 5,
                                width: 9,
                                height: 9,
                                borderTop: '2px solid rgba(0, 255, 65, 0.7)',
                                borderLeft: '2px solid rgba(0, 255, 65, 0.7)',
                                zIndex: 2,
                                opacity: 0.7,
                                transition: 'all 0.3s ease',
                            }}
                        />
                        <Box
                            className="project-hud-crosshair"
                            sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                width: 9,
                                height: 9,
                                borderTop: '2px solid rgba(0, 255, 65, 0.7)',
                                borderRight: '2px solid rgba(0, 255, 65, 0.7)',
                                zIndex: 2,
                                opacity: 0.7,
                                transition: 'all 0.3s ease',
                            }}
                        />
                        <Box
                            className="project-hud-crosshair"
                            sx={{
                                position: 'absolute',
                                bottom: 5,
                                left: 5,
                                width: 9,
                                height: 9,
                                borderBottom: '2px solid rgba(0, 255, 65, 0.7)',
                                borderLeft: '2px solid rgba(0, 255, 65, 0.7)',
                                zIndex: 2,
                                opacity: 0.7,
                                transition: 'all 0.3s ease',
                            }}
                        />
                        <Box
                            className="project-hud-crosshair"
                            sx={{
                                position: 'absolute',
                                bottom: 5,
                                right: 5,
                                width: 9,
                                height: 9,
                                borderBottom: '2px solid rgba(0, 255, 65, 0.7)',
                                borderRight: '2px solid rgba(0, 255, 65, 0.7)',
                                zIndex: 2,
                                opacity: 0.7,
                                transition: 'all 0.3s ease',
                            }}
                        />

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
                                    filter: 'contrast(1.05) brightness(0.92)',
                                    transition: 'transform 0.4s ease'
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
                                    fontSize: '0.75rem',
                                }}
                            >
                                [IMG_NOT_AVAILABLE]
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Card Content: Title, Links Header, Description, Tech Stack */}
                <CardContent
                    sx={{
                        flex: 1,
                        p: 1.1,
                        pt: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        {/* Title with GitHub and Live External link buttons on the right */}
                        <Box
                            sx={{
                                mb: 1.2,
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, mb: 1.2 }}>
                                {resolvedGithub && (
                                    <Tooltip title="View GitHub Repository" arrow placement="top">
                                        <IconButton
                                            component="a"
                                            href={resolvedGithub}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="small"
                                            className='external-icon-link'
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.65)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '4px',
                                                p: 0.6,
                                                '&:hover': {
                                                    color: '#00FF41',
                                                    borderColor: '#00FF41',
                                                    background: 'rgba(0, 255, 65, 0.08)',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <GitHubIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {resolvedLive && resolvedLive !== '#' && (
                                    <Tooltip title="Open Live Demo" arrow placement="top">
                                        <IconButton
                                            component="a"
                                            href={resolvedLive}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="small"
                                            className='external-icon-link'
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.65)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '4px',
                                                p: 0.6,
                                                '&:hover': {
                                                    color: '#00FF41',
                                                    borderColor: '#00FF41',
                                                    background: 'rgba(0, 255, 65, 0.08)',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <OpenInNewIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Tooltip title="Inspect Project Details" arrow placement="top">
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalOpen(true);
                                        }}
                                        size="small"
                                        className='external-icon-link'
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.65)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '4px',
                                            p: 0.6,
                                            '&:hover': {
                                                color: '#00FF41',
                                                borderColor: '#00FF41',
                                                background: 'rgba(0, 255, 65, 0.08)',
                                                boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <VisibilityIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography
                                variant="h6"
                                className="project-title-text"
                                sx={{
                                    color: '#ffffffbf',
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 800,
                                    fontSize: { xs: '1.05rem', md: '1.05rem' },
                                    letterSpacing: '0.035em',
                                    // textTransform: 'uppercase',
                                    lineHeight: 1.3,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {title}
                            </Typography>

                        </Box>

                        {/* Description */}
                        <Typography
                            sx={{
                                color: 'rgba(255, 255, 255, 0.65)',
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.78rem',
                                lineHeight: 1.65,
                                mb: 2,
                            }}
                        >
                            <Box component="span" sx={{ color: '#00FF41', fontWeight: 700, mr: 0.8 }}>
                                &gt;&gt;
                            </Box>
                            {description}
                        </Typography>
                    </Box>

                    {/* Tech Stack Chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {techStack.map((tech) => (
                            <Chip
                                key={tech}
                                label={tech}
                                size="small"
                                sx={{
                                    background: 'rgba(0, 255, 65, 0.05)',
                                    border: '1px solid rgba(0, 255, 65, 0.2)',
                                    color: '#00FF41',
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.65rem',
                                    height: 20,
                                    borderRadius: '3px',
                                    '&:hover': {
                                        background: 'rgba(0, 255, 65, 0.12)',
                                        borderColor: '#00FF41',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* Mac OS Window Project Detail Modal */}
            <ProjectModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                project={project}
            />
        </motion.div>
    );
};

export default ProjectCard;
