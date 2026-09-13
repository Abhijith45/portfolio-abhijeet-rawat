import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';

const FloatingSocials = () => {
    const email = 'abhijeetrawat.dev@gmail.com';
    const whatsappNumber = '+919999999999'; // Can be customized
    const whatsappMessage = encodeURIComponent('Hi Abhijeet, I saw your portfolio and would like to connect!');

    return (
        <Box
            sx={{
                position: 'fixed',
                left: { xs: 6, md: 8 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1200,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                gap: 1.5,
            }}
        >
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                whileHover={{ scale: 1.15, x: 4 }}
                whileTap={{ scale: 0.95 }}
            >
                <Tooltip title="Send Email" placement="right" arrow>
                    <IconButton
                        component="a"
                        disableRipple
                        href={`mailto:${email}?subject=Portfolio%20Inquiry`}
                        sx={{
                            backgroundColor: 'rgba(10, 10, 10, 0.85)',
                            color: '#00FF41',
                            border: '1px solid rgba(0, 255, 65, 0.4)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 15px rgba(0, 255, 65, 0.2)',
                            p: 1.2,
                            '&:hover': {
                                backgroundColor: '#00FF41',
                                color: '#000',
                                boxShadow: '0 0 20px rgba(0, 255, 65, 0.6)',
                            },
                            transition: 'all 0.15s ease-in-out',
                        }}
                    >
                        <EmailIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
                    </IconButton>
                </Tooltip>
            </motion.div>

            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.15, x: 4 }}
                whileTap={{ scale: 0.95 }}
            >
                <Tooltip title="Chat on WhatsApp" placement="right" arrow>
                    <IconButton
                        component="a"
                        disableRipple
                        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            backgroundColor: 'rgba(10, 10, 10, 0.85)',
                            color: '#00FF41',
                            border: '1px solid rgba(37, 211, 102, 0.4)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.2)',
                            p: 1.2,
                            '&:hover': {
                                backgroundColor: '#00FF41',
                                color: '#000',
                                boxShadow: '0 0 20px rgba(37, 211, 102, 0.6)',
                            },
                            transition: 'all 0.15s ease-in-out',
                        }}
                    >
                        <WhatsAppIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
                    </IconButton>
                </Tooltip>
            </motion.div>
        </Box>
    );
};

export default FloatingSocials;
