import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

// Standard mapping to official SimpleIcons / Devicon CDN slugs
const iconSlugMap = {
    'html5': 'html5',
    'html': 'html5',
    'css3': 'css',
    'css': 'css',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'react': 'react',
    'react.js': 'react',
    'reactjs': 'react',
    'next.js': 'nextdotjs',
    'next': 'nextdotjs',
    'nextjs': 'nextdotjs',
    'tailwind css': 'tailwindcss',
    'tailwind': 'tailwindcss',
    'material ui': 'mui',
    'mui': 'mui',
    'framer motion': 'framer',
    'framer': 'framer',
    'node.js': 'nodedotjs',
    'nodejs': 'nodedotjs',
    'node': 'nodedotjs',
    'express.js': 'express',
    'express': 'express',
    'rest apis': 'fastapi',
    'rest api': 'fastapi',
    'mongodb': 'mongodb',
    'mongo': 'mongodb',
    'postgresql': 'postgresql',
    'postgres': 'postgresql',
    'redis': 'redis',
    'docker': 'docker',
    'aws': 'amazonwebservices',
    'amazon web services': 'amazonwebservices',
    'cloudinary': 'cloudinary',
    'vercel': 'vercel',
    'git': 'git',
    'github': 'github',
    'postman': 'postman',
    'vite': 'vite',
    'npm': 'npm',
    'nest.js': 'nestjs',
    'nestjs': 'nestjs',
    'graphql': 'graphql',
    'python': 'python',
    'figma': 'figma',
};

export const getIconUrl = (name = '', customIcon = '') => {
    // 1. If an explicit image URL is provided (e.g. from Cloudinary or external link)
    if (customIcon && (customIcon.startsWith('http://') || customIcon.startsWith('https://') || customIcon.startsWith('/'))) {
        return customIcon;
    }

    // 2. Derive the slug
    const normalizedKey = (customIcon || name).trim().toLowerCase();
    const slug = iconSlugMap[normalizedKey] || normalizedKey.replace(/[^a-z0-9]/g, '');

    // Return official monochrome white SVG from SimpleIcons CDN
    return `https://cdn.simpleicons.org/${slug}/white`;
};

export const TechIcon = ({ name, icon, size = 42 }) => {
    const [hasError, setHasError] = useState(false);
    const iconSrc = getIconUrl(name, icon);

    if (hasError) {
        // Tier 3 Fallback: Sleek styled code badge
        const initials = name
            .split(/[\s.-]+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || '</>';

        return (
            <Box
                sx={{
                    width: size,
                    height: size,
                    borderRadius: '8px',
                    border: '1px solid rgba(0,255,65,0.4)',
                    background: 'rgba(0,255,65,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00FF41',
                    fontFamily: 'Fira Code, monospace',
                    fontWeight: 700,
                    fontSize: `${Math.max(size * 0.32, 11)}px`,
                    letterSpacing: '0.05em',
                    boxShadow: '0 0 10px rgba(0,255,65,0.1)',
                }}
            >
                {initials}
            </Box>
        );
    }

    return (
        <Box
            component="img"
            src={iconSrc}
            alt={name}
            onError={() => setHasError(true)}
            sx={{
                width: size,
                height: size,
                objectFit: 'contain',
                filter: 'brightness(0.9) contrast(1.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    filter: 'drop-shadow(0 0 8px rgba(0, 255, 65, 0.8)) brightness(1.2)',
                },
            }}
        />
    );
};

export default TechIcon;
