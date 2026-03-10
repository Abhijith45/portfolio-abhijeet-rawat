import React from 'react';
import { Card, CardContent, Box, Typography, Chip, IconButton, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
    const { title, description, techStack = [], github, demo, image } = project;

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ height: '100%' }}
        >
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': {
                        border: '1px solid rgba(0,255,65,0.25)',
                        boxShadow: '0 0 30px rgba(0,255,65,0.08)',
                    },
                    transition: 'all 0.3s ease',
                }}
            >
                {/* Image with responsive aspect ratio */}
                {image && (
                    <Box
                        sx={{
                            position: 'relative',
                            paddingTop: '52%', // 16:8.5 approx aspect ratio
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            component="img"
                            src={image}
                            alt={title}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.4s ease',
                                '&:hover': { transform: 'scale(1.05)' },
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '50%',
                                background: 'linear-gradient(transparent, #0a0a0a)',
                            }}
                        />
                    </Box>
                )}

                <CardContent sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '0.95rem', md: '1rem' },
                                color: '#ffffff',
                                flex: 1,
                                pr: 1,
                            }}
                        >
                            {title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                            {github && (
                                <IconButton
                                    component="a"
                                    href={github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#00FF41' }, p: 0.5 }}
                                >
                                    <GitHubIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                </IconButton>
                            )}
                            {demo && (
                                <IconButton
                                    component="a"
                                    href={demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#00FF41' }, p: 0.5 }}
                                >
                                    <OpenInNewIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.55)',
                            fontSize: { xs: '0.82rem', sm: '0.85rem' },
                            lineHeight: 1.6,
                            mb: 2,
                        }}
                    >
                        {description}
                    </Typography>

                    {/* Tech Tags */}
                    <Stack direction="row" flexWrap="wrap" gap={0.75}>
                        {techStack.map((tech) => (
                            <Chip
                                key={tech}
                                label={tech}
                                size="small"
                                sx={{
                                    background: 'rgba(0,255,65,0.08)',
                                    border: '1px solid rgba(0,255,65,0.2)',
                                    color: '#00FF41',
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.65rem',
                                    height: 20,
                                }}
                            />
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProjectCard;
