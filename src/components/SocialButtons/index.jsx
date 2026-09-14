import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { FaLinkedin, FaGithub, FaHackerrank } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import { useProfile } from '../../context/ProfileContext';

/**
 * Reusable SocialButtons component.
 * Dynamically displays only active, non-empty social & coding profile links from profile context.
 *
 * Props:
 * - buttons: optional list of button definitions to override
 * - sx: additional container styles
 * - buttonSx: additional button styles
 * - iconSize: icon size override
 * - buttonSize: size of square button
 */
const SocialButtons = ({
    buttons = null,
    sx = {},
    buttonSx = {},
    buttonSize,
    iconSize = 22,
}) => {
    const { profile } = useProfile();

    // Derive active button definitions from profile context if custom buttons not provided
    const resolvedButtons = buttons || [
        {
            id: 'linkedin',
            label: 'LinkedIn',
            href: profile?.linkedInURL,
            icon: <FaLinkedin style={{ fontSize: iconSize }} />,
        },
        {
            id: 'github',
            label: 'GitHub',
            href: profile?.githubURL,
            icon: <FaGithub style={{ fontSize: iconSize }} />,
        },
        {
            id: 'leetcode',
            label: 'LeetCode',
            href: profile?.leetCodeURL,
            icon: <SiLeetcode style={{ fontSize: iconSize - 2 }} />,
        },
        {
            id: 'hackerrank',
            label: 'HackerRank',
            href: profile?.HackerRankURL,
            icon: <FaHackerrank style={{ fontSize: iconSize - 2 }} />,
        },
    ];

    // Filter out buttons that have no valid link
    const activeButtons = resolvedButtons.filter(
        (b) => b && typeof b.href === 'string' && b.href.trim().length > 0
    );

    if (activeButtons.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 2, md: 3 },
                flexWrap: 'wrap',
                ...sx,
            }}
        >
            {activeButtons.map((social) => (
                <IconButton
                    key={social.id}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                        width: buttonSize || { xs: 30, sm: 36, md: 42 },
                        height: buttonSize || { xs: 30, sm: 36, md: 42 },
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 255, 65, 0.18)',
                        color: 'rgba(255, 255, 255, 0.85)',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                            borderColor: '#00FF41',
                            color: '#00FF41',
                            background: 'rgba(0, 255, 65, 0.08)',
                            boxShadow: '0 0 16px rgba(0, 255, 65, 0.35)',
                            transform: 'translateY(-3px)',
                        },
                        ...buttonSx,
                    }}
                >
                    {social.icon ? (
                        social.icon
                    ) : (
                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.95rem',
                                fontWeight: 800,
                                letterSpacing: '0.04em',
                                color: 'inherit',
                            }}
                        >
                            {social.text}
                        </Typography>
                    )}
                </IconButton>
            ))}
        </Box>
    );
};

export default SocialButtons;
