import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';
import { useProfile } from '../../context/ProfileContext';

const FloatingSocials = () => {
    const { profile } = useProfile();
    const email = profile?.email || '';
    const mobileNumber = profile?.mobileNumber || '';
    const cleanMobile = mobileNumber.replace(/[^0-9]/g, '');
    const hasWhatsApp = Boolean(cleanMobile && cleanMobile.length >= 7);
    const hasEmail = Boolean(email && email.includes('@'));

    const whatsappMessage = encodeURIComponent(
        `Hi ${profile?.name || 'Abhijeet'}, I saw your portfolio and would like to connect!`
    );

    // If neither email nor mobile is configured, don't render floating container
    if (!hasEmail && !hasWhatsApp) {
        return null;
    }

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
            {hasEmail && (
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
                            aria-label="Send Email"
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
            )}

            {hasWhatsApp && (
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.15, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Tooltip title="Chat on WhatsApp" placement="right" arrow>
                        <IconButton
                            component="a"
                            disableRipple
                            href={`https://wa.me/${cleanMobile}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Chat on WhatsApp"
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
            )}
        </Box>
    );
};

export default FloatingSocials;
