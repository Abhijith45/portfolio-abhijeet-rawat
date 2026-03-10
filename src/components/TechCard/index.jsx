import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const TechCard = ({ category, icon, items }) => {
    return (
        <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.25 }}>
            <Card
                sx={{
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    '&:hover': {
                        border: '1px solid rgba(0,255,65,0.2)',
                    },
                    transition: 'all 0.3s ease',
                }}
            >
                <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '6px',
                                background: 'rgba(0,255,65,0.08)',
                                border: '1px solid rgba(0,255,65,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                            }}
                        >
                            {icon}
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                            {category}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {items.map((item) => (
                            <Typography
                                key={item}
                                sx={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '0.82rem',
                                    fontFamily: 'Fira Code, monospace',
                                }}
                            >
                                {item}
                                {items.indexOf(item) < items.length - 1 && (
                                    <span style={{ color: 'rgba(0,255,65,0.4)', marginLeft: '2px' }}>,</span>
                                )}
                            </Typography>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default TechCard;
