import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import ReviewComponent from '../../components/ReviewComponent';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '../../utils/validation';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { queriesApi } from '../../services/api';
import SendIcon from '@mui/icons-material/Send';

const socialButtons = [
    {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/abhijeet-rawat',
        icon: <LinkedInIcon sx={{ fontSize: 22 }} />,
    },
    {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/abhijeet-rawat',
        icon: <GitHubIcon sx={{ fontSize: 22 }} />,
    },
    {
        id: 'leetcode',
        label: 'LeetCode',
        href: 'https://leetcode.com/abhijeet-rawat',
        text: 'LC',
    },
    {
        id: 'hackerrank',
        label: 'HackerRank',
        href: 'https://hackerrank.com/abhijeet-rawat',
        text: 'HR',
    },
];

const CyberContactSection = () => {
    const [submitStatus, setSubmitStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleCopyEmail = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText('abhijeetrawat45@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: { name: '', email: '', message: '', subject: 'Enquiry Mail' },
    });

    const values = watch();

    const isNameValid = !errors.name && Boolean(values.name && values.name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(values.name));
    const isEmailValid = !errors.email && Boolean(values.email && values.email.trim().length >= 5 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()));
    const isMessageValid = !errors.message && Boolean(values.message && values.message.trim().length >= 10);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setSubmitStatus(null);
            setErrorMessage('');
            await queriesApi.submit({
                ...data,
                subject: data.subject || 'Enquiry Mail',
            });
            reset();
            setShowSuccessModal(true);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.errors?.[0]?.msg ||
                'Something went wrong. Please try again.';
            setErrorMessage(msg);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 6000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInputStyles = (hasError, isValidated) => {
        let borderColor = 'rgba(0, 255, 65, 0.2)';
        let bgColor = '#0a0a0a';

        if (hasError) {
            borderColor = 'rgba(255, 68, 68, 0.3)';
            bgColor = '#0a0a0a';
        } else if (isValidated) {
            borderColor = '#00ff41';
            bgColor = '#000000';
        }

        return {
            '& .MuiOutlinedInput-root': {
                backgroundColor: bgColor,
                borderRadius: '4px',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
                '& fieldset': {
                    borderColor: borderColor,
                    transition: 'border-color 0.2s ease',
                },
                '&:hover fieldset': {
                    borderColor: hasError ? 'rgba(255, 68, 68, 0.5)' : '#00ff41',
                },
                '&.Mui-focused': {
                    backgroundColor: '#000000',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#00ff41',
                    borderWidth: '1px',
                },
                '&.Mui-error': {
                    backgroundColor: '#0a0a0a',
                },
                '&.Mui-error fieldset': {
                    borderColor: 'rgba(255, 68, 68, 0.3)',
                },
                '&.Mui-error:hover fieldset': {
                    borderColor: 'rgba(255, 68, 68, 0.5)',
                },
                '&.Mui-error.Mui-focused': {
                    backgroundColor: '#000000',
                },
                '&.Mui-error.Mui-focused fieldset': {
                    borderColor: '#00ff41',
                },
            },
            '& .MuiInputLabel-root': {
                color: '#ffffff',
                fontSize: '0.75rem',
                fontFamily: 'Fira Code, monospace',
                letterSpacing: '0.1em',
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#00ff41' },
            '& .MuiOutlinedInput-input': {
                color: '#ffffff',
                fontSize: '0.9rem',
                '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.4)',
                    opacity: 1,
                },
            },
            '& .MuiFormHelperText-root': {
                color: '#ff4444',
                fontFamily: 'Fira Code, monospace',
                fontSize: '0.72rem',
                mt: 0.5,
            },
        };
    };

    return (
        <Box
            sx={{
                py: { xs: 3, md: 6 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 4, md: 5 } }}>
                <Grid container spacing={{ xs: 6, md: 8, lg: 10 }} alignItems="flex-start">
                    {/* LEFT COLUMN: Headings & Social Icons */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Mono Tag */}
                            <Typography
                                sx={{
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                    color: '#00FF41',
                                    letterSpacing: '0.15em',
                                    mb: 2.5,
                                    fontWeight: 500,
                                }}
                            >
                                // INITIALIZING CONTACT
                            </Typography>

                            {/* Big Bold Headline */}
                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
                                    fontWeight: 900,
                                    lineHeight: 1.08,
                                    letterSpacing: '-0.03em',
                                    color: '#ffffff',
                                    mb: 0.5,
                                }}
                            >
                                Let's build
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: { xs: '3rem', sm: '4.2rem', md: '5.2rem' },
                                    fontWeight: 900,
                                    lineHeight: 1.08,
                                    letterSpacing: '-0.03em',
                                    color: '#00FF41',
                                    mb: 5,
                                }}
                            >
                                something amazing.
                            </Typography>

                            {/* 4 Social / Coding Profile Icon Buttons */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {socialButtons.map((social) => (
                                    <IconButton
                                        key={social.id}
                                        component="a"
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        sx={{
                                            width: { xs: 48, sm: 52 },
                                            height: { xs: 48, sm: 52 },
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
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
                                        }}
                                    >
                                        {social.icon || (
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

                            {/* Email Display Below Social Icons */}
                            <Box sx={{ mt: { xs: 3.5, md: 4 } }}>
                                <Typography
                                    sx={{
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.72rem',
                                        color: '#00FF41',
                                        letterSpacing: '0.12em',
                                        mb: 1.2,
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.8,
                                    }}
                                >
                                    <Box component="span" sx={{ opacity: 0.7 }}>//</Box>
                                    Write email at
                                </Typography>

                                <Box
                                    component="a"
                                    href="mailto:abhijeetrawat45@gmail.com?subject=Enquiry%20Mail"
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        px: 2,
                                        py: 1.1,
                                        background: 'rgba(0, 255, 65, 0.03)',
                                        border: '1px solid rgba(0, 255, 65, 0.2)',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: '#ffffff',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
                                        '&:hover': {
                                            border: '1px solid #00FF41',
                                            background: 'rgba(0, 255, 65, 0.08)',
                                            boxShadow: '0 0 1px rgba(0, 255, 65, 0.25)',
                                            '& .email-icon': {
                                                color: '#00FF41',
                                                transform: 'scale(1.1)',
                                            }
                                        },
                                    }}
                                >
                                    <EmailIcon
                                        className="email-icon"
                                        sx={{
                                            fontSize: 20,
                                            color: 'rgba(0, 255, 65, 0.85)',
                                            transition: 'all 0.25s ease',
                                        }}
                                    />
                                    <Typography
                                        className="email-text"
                                        sx={{
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: { xs: '0.82rem', sm: '0.9rem' },
                                            fontWeight: 600,
                                            letterSpacing: '0.02em',
                                            color: '#ffffff',
                                            transition: 'color 0.25s ease',
                                        }}
                                    >
                                        abhijeetrawat45@gmail.com
                                    </Typography>

                                    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'} arrow placement="top">
                                        <IconButton
                                            size="small"
                                            onClick={handleCopyEmail}
                                            aria-label="Copy email address"
                                            sx={{
                                                ml: 0.5,
                                                p: 0.6,
                                                color: copied ? '#00FF41' : 'rgba(255, 255, 255, 0.5)',
                                                background: copied ? 'rgba(0, 255, 65, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                                borderRadius: '4px',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    color: '#00FF41',
                                                    background: 'rgba(0, 255, 65, 0.2)',
                                                },
                                            }}
                                        >
                                            {copied ? <CheckIcon sx={{ fontSize: 15 }} /> : <ContentCopyIcon sx={{ fontSize: 15 }} />}
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* RIGHT COLUMN: Status Card, Main Form, SLA & Security Notice */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                        >
                            {/* 1. Status: Availability Card */}
                            <Box
                                sx={{
                                    // background: '#07090f',
                                    border: '1px solid rgba(0, 255, 65, 0.18)',
                                    borderRadius: '10px',
                                    px: { xs: 1.25, sm: 1.5, md: 2 },
                                    py: { xs: 1, sm: 1.25 },
                                    mb: 2,
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.7rem',
                                        color: '#00FF41',
                                        letterSpacing: '0.12em',
                                        mb: 0.5,
                                        fontWeight: 600,
                                    }}
                                >
                                    /* STATUS: AVAILABILITY */
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                                        color: '#ffffff',
                                        lineHeight: 1.45,
                                    }}
                                >
                                    Currently open to freelance projects and full-time collaborations.
                                </Typography>
                            </Box>

                            {/* 2. Main Contact Form Card */}
                            <Box
                                component="form"
                                onSubmit={handleSubmit(onSubmit)}
                                sx={{
                                    // background: '#07090f',
                                    border: '1px solid rgba(0, 255, 65, 0.18)',
                                    borderRadius: '12px',
                                    px: { xs: 1.5, sm: 2, md: 2.5 },
                                    py: { xs: 1, sm: 1.5, md: 2.25 },
                                    mb: 2,
                                    boxShadow: '0 4px 25px rgba(0, 0, 0, 0.7)',
                                }}
                            >
                                {/* Field 01: Name */}
                                <Box sx={{ mb: 2.8 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.72rem',
                                            color: '#ffffff',
                                            letterSpacing: '0.1em',
                                            mb: 0.8,
                                            fontWeight: 600,
                                        }}
                                    >
                                        01. Your Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter your full name"
                                        size="small"
                                        disabled={isSubmitting}
                                        {...register('name')}
                                        onKeyDown={(e) => {
                                            if (
                                                e.ctrlKey || e.metaKey ||
                                                ['Backspace', 'Tab', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                                            ) {
                                                return;
                                            }
                                            if (!/^[a-zA-Z\s]$/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        slotProps={{
                                            htmlInput: {
                                                pattern: '[A-Za-z ]+',
                                                title: 'Only alphabets allowed',
                                            },
                                        }}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        sx={getInputStyles(!!errors.name, isNameValid)}
                                    />
                                </Box>

                                {/* Field 02: Email */}
                                <Box sx={{ mb: 2.8 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.72rem',
                                            color: '#ffffff',
                                            letterSpacing: '0.1em',
                                            mb: 0.8,
                                            fontWeight: 600,
                                        }}
                                    >
                                        02. Your Email Address
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="example@provider.com"
                                        size="small"
                                        type="email"
                                        disabled={isSubmitting}
                                        {...register('email')}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        sx={getInputStyles(!!errors.email, isEmailValid)}
                                    />
                                </Box>

                                {/* Field 03: Description */}
                                <Box sx={{ mb: 2.5 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.72rem',
                                            color: '#ffffff',
                                            letterSpacing: '0.1em',
                                            mb: 0.8,
                                            fontWeight: 600,
                                        }}
                                    >
                                        03. Your Message
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        placeholder="Tell me about your vision, goals, or requirements..."
                                        disabled={isSubmitting}
                                        {...register('message')}
                                        error={!!errors.message}
                                        helperText={errors.message?.message}
                                        sx={{ ...getInputStyles(!!errors.message, isMessageValid), py: 0.6 }}
                                    />
                                </Box>

                                {/* Submit Alerts */}
                                {submitStatus === 'error' && (
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mb: 2.5,
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        {errorMessage || 'Something went wrong. Please try again.'}
                                    </Alert>
                                )}

                                {/* Neon Green Submit Button with Circular Loader */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={!isValid || isSubmitting}
                                    sx={{
                                        background: (!isValid || isSubmitting) ? 'rgba(255, 255, 255, 0.08)' : '#00FF41',
                                        color: (!isValid || isSubmitting) ? 'rgba(255, 255, 255, 0.3)' : '#000000',
                                        fontFamily: 'Fira Code, monospace',
                                        fontWeight: 800,
                                        fontSize: '0.82rem',
                                        letterSpacing: '0.14em',
                                        py: 1,
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1.2,
                                        transition: 'all 0.25s ease',
                                        boxShadow: (!isValid || isSubmitting) ? 'none' : '0 0 8px rgba(0, 255, 65, 0.35)',
                                        cursor: (!isValid || isSubmitting) ? 'not-allowed' : 'pointer',
                                        '&:hover': {
                                            background: (!isValid || isSubmitting) ? 'rgba(255, 255, 255, 0.08)' : '#39FF14',
                                            boxShadow: (!isValid || isSubmitting) ? 'none' : '0 0 10px rgba(0, 255, 65, 0.6)',
                                            transform: (!isValid || isSubmitting) ? 'none' : 'translateY(-1px)',
                                        },
                                        '&.Mui-disabled': {
                                            background: 'rgba(255, 255, 255, 0.08)',
                                            color: 'rgba(255, 255, 255, 0.3)',
                                            cursor: 'not-allowed',
                                            pointerEvents: 'auto',
                                        },
                                    }}
                                    endIcon={!isSubmitting && <SendIcon />}
                                >
                                    {isSubmitting ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                            <CircularProgress size={18} sx={{ color: '#000000' }} thickness={5} />
                                        </Box>
                                    ) : (
                                        <>
                                            Submit
                                        </>
                                    )}
                                </Button>
                            </Box>

                            {/* 3. Reply SLA Indicator */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2, px: 0.5 }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: '#00FF41',
                                        boxShadow: '0 0 8px #00FF41',
                                        flexShrink: 0,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.75rem',
                                        color: '#00FF41',
                                        letterSpacing: '0.08em',
                                        fontWeight: 500,
                                    }}
                                >
                                    Usually replies within 24 hours.
                                </Typography>
                            </Box>

                            {/* 4. Security Disclaimer Card */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.05,
                                    px: {xs:1,sm:1.25,md:1.5},
                                    py: {xs:0.75,sm:0.85,md:1},
                                    background: 'rgba(0, 255, 65, 0.03)',
                                    border: '1px solid rgba(0, 255, 65, 0.1)',
                                    borderRadius: '8px',
                                }}
                            >
                                <SecurityIcon
                                    sx={{
                                        color: '#00FF41',
                                        fontSize: 20,
                                        flexShrink: 0,
                                        mt: 0.2,
                                        opacity: 0.85,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.55)',
                                        fontSize: '0.75rem',
                                        lineHeight: 1.6,
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    Your data is handled securely. I only use your email to respond to your inquiry and never
                                    share your details with third parties.
                                </Typography>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>


            {/* REUSABLE REVIEW COMPONENT — handles success modal, countdown, and review form */}
            <ReviewComponent
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                redirectTo="/"
                countdownDuration={5}
            />
        </Box>
    );
};

export default CyberContactSection;

