import React from 'react';
import { Card, CardContent, Box, Typography, Avatar, Rating } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { motion } from 'framer-motion';

const ReviewCard = ({ review }) => {
    const { name, company, message, rating = 5 } = review;

    const initials = name
        ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            style={{ height: '100%' }}
        >
            <Card
                sx={{
                    height: '100%',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                        border: '1px solid rgba(0,255,65,0.15)',
                    },
                    transition: 'all 0.3s ease',
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    {/* Quote icon + rating */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Rating
                            value={rating}
                            readOnly
                            precision={0.5}
                            size="small"
                            sx={{
                                '& .MuiRating-iconFilled': { color: '#00FF41' },
                                '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.15)' },
                                fontSize: '0.85rem',
                            }}
                        />
                        <FormatQuoteIcon
                            sx={{ color: 'rgba(0,255,65,0.2)', fontSize: '2rem', transform: 'rotate(180deg)' }}
                        />
                    </Box>

                    {/* Message */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.875rem',
                            lineHeight: 1.7,
                            fontStyle: 'italic',
                            mb: 3,
                        }}
                    >
                        "{message}"
                    </Typography>

                    {/* Author */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                background: 'rgba(0,255,65,0.15)',
                                border: '1px solid rgba(0,255,65,0.3)',
                                color: '#00FF41',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                fontFamily: 'Fira Code, monospace',
                            }}
                        >
                            {initials}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', lineHeight: 1.3 }}>
                                {name}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', lineHeight: 1 }}>
                                {company}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ReviewCard;
