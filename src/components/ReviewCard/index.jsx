import React from 'react';
import { Card, CardContent, Box, Typography, Rating } from '@mui/material';
import { motion } from 'framer-motion';

const formatDate = (dateVal) => {
    if (!dateVal) return null;
    try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return null;
    }
};

const ReviewCard = ({ review, index = 1 }) => {
    const { name, company, message, rating = 5, createdAt, date } = review;
    const reviewDate = formatDate(createdAt || date);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ height: '100%', display: 'flex' }}
        >
            <Card
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'none',
                    border: '1px solid rgba(0, 255, 65, 0.18)',
                    borderRadius: '10px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 255, 65, 0.04)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        border: '1px solid #00FF41',
                        // boxShadow: '0 0 25px rgba(0, 255, 65, 0.28), inset 0 0 15px rgba(0, 255, 65, 0.05)',
                        '& .review-card-content-class': {
                            background: '#040508'
                        }
                    },
                }}
            >
                {/* 1. Mac OS Window Header Bar with only the 3 Mac Control Dots */}
                <Box
                    sx={{
                        px: 2,
                        py: 1.2,
                        display: 'flex',
                        alignItems: 'center',
                        background: '#040508',
                        borderBottom: '1px solid rgba(0, 255, 65, 0.12)',
                    }}
                >
                    {/* Mac 3 window control buttons (Red, Yellow, Green) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Box
                            className="mac-window-dot close"
                            sx={{
                                width: 11,
                                height: 11,
                                borderRadius: '50%',
                                background: '#ff5f56',
                                border: '1px solid rgba(255, 95, 86, 0.8)',
                                transition: 'box-shadow 0.2s ease',
                            }}
                        />
                        <Box
                            className="mac-window-dot minimize"
                            sx={{
                                width: 11,
                                height: 11,
                                borderRadius: '50%',
                                background: '#ffbd2e',
                                border: '1px solid rgba(255, 189, 46, 0.8)',
                                transition: 'box-shadow 0.2s ease',
                            }}
                        />
                        <Box
                            className="mac-window-dot maximize"
                            sx={{
                                width: 11,
                                height: 11,
                                borderRadius: '50%',
                                background: '#27c93f',
                                border: '1px solid rgba(39, 201, 63, 0.8)',
                                transition: 'box-shadow 0.2s ease',
                            }}
                        />
                    </Box>
                </Box>

                {/* 2. Review Content inside Mac Window */}
                <CardContent
                    className='review-card-content-class'
                    sx={{
                        flex: 1,
                        p: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        {/* Rating stars (0 to 5 with 0.5 steps) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Rating
                                value={typeof rating === 'number' ? rating : 5}
                                readOnly
                                precision={0.5}
                                size="medium"
                                sx={{
                                    '& .MuiRating-iconFilled': { color: '#00FF41' },
                                    '& .MuiRating-iconEmpty': { color: 'rgba(255, 255, 255, 0.15)' },
                                    fontSize: { xs: '0.95rem', sm: '1rem', md:'1.25rem' },
                                }}
                            />
                        </Box>

                        {/* Testimonial message with terminal quote prefix */}
                        <Typography
                            sx={{
                                color: 'rgba(255, 255, 255, 0.75)',
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.82rem',
                                lineHeight: 1.7,
                                mb: 3,
                            }}
                        >
                            <Box component="span" sx={{ color: '#00FF41', fontWeight: 700, mr: 0.8 }}>
                                &gt;&gt;
                            </Box>
                            {message}
                        </Typography>
                    </Box>

                    {/* Author Section with Post Date above Client Info */}
                    <Box
                        sx={{
                            pt: 1.5,
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.3,
                        }}
                    >
                        {/* Feedback Post Date (Light Font Weight) */}
                        {reviewDate && (
                            <Typography
                                sx={{
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.72rem',
                                    fontWeight: 300,
                                    color: '#00FF41a2',
                                    letterSpacing: '0.03em',
                                    mb: 1.25,
                                }}
                            >
                                {reviewDate}
                            </Typography>
                        )}

                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.92rem',
                                color: '#00FF41',
                                fontFamily: 'Inter, sans-serif',
                                letterSpacing: '0.02em',
                            }}
                        >
                            {name}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'rgba(255, 255, 255, 0.45)',
                                fontSize: '0.75rem',
                                fontFamily: 'Fira Code, monospace',
                            }}
                        >
                            {company}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ReviewCard;
