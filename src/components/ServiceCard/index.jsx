import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import ApiIcon from '@mui/icons-material/Api';
import BarChartIcon from '@mui/icons-material/BarChart';
import { motion } from 'framer-motion';

const iconMap = {
    web: <WebIcon sx={{ color: '#00FF41', fontSize: 28 }} />,
    api: <ApiIcon sx={{ color: '#00FF41', fontSize: 28 }} />,
    chart: <BarChartIcon sx={{ color: '#00FF41', fontSize: 28 }} />,
};

const ServiceCard = ({ service }) => {
    const { icon = 'web', title, description } = service;

    return (
        <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} style={{ height: '100%' }}>
            <Card
                sx={{
                    height: '100%',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    p: 0,
                    '&:hover': {
                        border: '1px solid rgba(0,255,65,0.2)',
                        boxShadow: '0 0 20px rgba(0,255,65,0.06)',
                    },
                    transition: 'all 0.3s ease',
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '8px',
                            background: 'rgba(0,255,65,0.08)',
                            border: '1px solid rgba(0,255,65,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        {iconMap[icon] || iconMap.web}
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff', mb: 1 }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7 }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ServiceCard;
