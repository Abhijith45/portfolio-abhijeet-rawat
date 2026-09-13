import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import { FaHackerrank } from "react-icons/fa6";

export const DEFAULT_SOCIAL_BUTTONS = [
    {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/abhijeet-rawat',
        icon: <FaLinkedin sx={{ fontSize: 22 }} />,
    },
    {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/abhijeet-rawat',
        icon: <FaGithub sx={{ fontSize: 22 }} />,
    },
    {
        id: 'leetcode',
        label: 'LeetCode',
        href: 'https://leetcode.com/abhijeet-rawat',
        icon: <SiLeetcode sx={{ fontSize: 20 }}/>,
    },
    {
        id: 'hackerrank',
        label: 'HackerRank',
        href: 'https://hackerrank.com/abhijeet-rawat',
        icon: <FaHackerrank sx={{ fontSize: 20 }} />,
    },
];

/**
 * Reusable SocialButtons component.
 * Renders social & coding profile icon buttons with cyberpunk hover effects.
 *
 * Props:
 * - buttons: optional list of button definitions (defaults to DEFAULT_SOCIAL_BUTTONS)
 * - sx: additional container styles
 * - buttonSx: additional button styles
 * - iconSize: icon size override (e.g. 22 or 20)
 * - buttonSize: size of the square button (e.g. { xs: 44, sm: 48 } or { xs: 48, sm: 52 })
 */
const SocialButtons = ({
    buttons = DEFAULT_SOCIAL_BUTTONS,
    sx = {},
    buttonSx = {},
    buttonSize,
    iconSize = 22,
}) => {
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
            {buttons.map((social) => (
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
                        React.cloneElement(social.icon, {
                            sx: {
                                fontSize: iconSize,
                                ...social.icon.props?.sx,
                            },
                        })
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
