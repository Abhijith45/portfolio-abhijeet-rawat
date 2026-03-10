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
    Card,
    CardContent,
    IconButton,
    Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '../../utils/validation';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import ReviewSection from '../../sections/ReviewSection';
import ReviewForm from '../../components/ReviewForm';

const socialLinks = [
    {
        icon: <GitHubIcon />,
        label: 'GitHub',
        handle: 'View Source',
        href: 'https://github.com/abhijeet-rawat',
        description: 'Check out my code',
    },
    {
        icon: <LinkedInIcon />,
        label: 'LinkedIn',
        handle: 'Connect Professionally',
        href: 'https://linkedin.com/in/abhijeet-rawat',
        description: 'Professional Network',
    },
    {
        icon: null,
        text: 'LC',
        label: 'LeetCode',
        handle: 'Problem Solver',
        href: 'https://leetcode.com/abhijeet-rawat',
        description: 'Coding Challenges',
    },
    {
        icon: null,
        text: 'HR',
        label: 'HackerRank',
        handle: 'Track Record',
        href: 'https://hackerrank.com/abhijeet-rawat',
        description: 'Coding Badges',
    },
];

const Contact = () => {
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: '', email: '', message: '' },
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            // Simulate API call - connect to backend contact endpoint
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setSubmitStatus('success');
            reset();
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '4px',
            '& fieldset': { borderColor: 'rgba(0,255,65,0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(0,255,65,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#00FF41' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#00FF41' },
        '& .MuiOutlinedInput-input': { color: '#fff', fontSize: '0.9rem' },
        '& .MuiFormHelperText-root': { color: '#ff4444' },
    };

    return (
        <>
            {/* Hero */}
            <Box sx={{ pt: { xs: 4, md: 6 }, pb: 8 }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.75rem',
                                color: '#00FF41',
                                letterSpacing: '0.2em',
                                mb: 1.5,
                                opacity: 0.8,
                            }}
                        >
              // INITIALIZING CONTACT
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '3rem', md: '4.5rem' },
                                fontWeight: 800,
                                lineHeight: 1.1,
                                letterSpacing: '-0.03em',
                                mb: 0,
                            }}
                        >
                            Let's build
                        </Typography>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '3rem', md: '4.5rem' },
                                fontWeight: 800,
                                lineHeight: 1.1,
                                letterSpacing: '-0.03em',
                                color: '#00FF41',
                                mb: 5,
                            }}
                        >
                            something amazing.
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {/* Left: Contact Form */}
                        <Grid size={{xs:12,md:6}}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Box
                                    component="form"
                                    onSubmit={handleSubmit(onSubmit)}
                                    sx={{
                                        background: '#0a0a0a',
                                        border: '1px solid rgba(0,255,65,0.15)',
                                        borderRadius: '8px',
                                        p: 3,
                                    }}
                                >
                                    <Box sx={{ mb: 3 }}>
                                        <Typography sx={{ color: '#00FF41', fontSize: '0.7rem', fontFamily: 'Fira Code, monospace', mb: 0.5, letterSpacing: '0.1em' }}>
                                            01. YOUR NAME
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter your full name"
                                            size="small"
                                            {...register('name')}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            sx={inputSx}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography sx={{ color: '#00FF41', fontSize: '0.7rem', fontFamily: 'Fira Code, monospace', mb: 0.5, letterSpacing: '0.1em' }}>
                                            02. EMAIL ADDRESS
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="example@provider.com"
                                            size="small"
                                            type="email"
                                            {...register('email')}
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            sx={inputSx}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography sx={{ color: '#00FF41', fontSize: '0.7rem', fontFamily: 'Fira Code, monospace', mb: 0.5, letterSpacing: '0.1em' }}>
                                            03. PROJECT DESCRIPTION
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            placeholder="Tell me about your vision, goals, or requirements..."
                                            {...register('message')}
                                            error={!!errors.message}
                                            helperText={errors.message?.message}
                                            sx={inputSx}
                                        />
                                    </Box>

                                    {submitStatus === 'success' && (
                                        <Alert
                                            severity="success"
                                            sx={{ mb: 2, background: 'rgba(0,255,65,0.08)', color: '#00FF41', border: '1px solid rgba(0,255,65,0.2)' }}
                                        >
                                            Message sent! I'll get back to you within 24 hours.
                                        </Alert>
                                    )}
                                    {submitStatus === 'error' && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            Something went wrong. Please try again.
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        disabled={isSubmitting}
                                        endIcon={isSubmitting ? <CircularProgress size={16} sx={{ color: '#000' }} /> : <SendIcon />}
                                        sx={{
                                            background: '#00FF41',
                                            color: '#000',
                                            fontWeight: 700,
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.8rem',
                                            letterSpacing: '0.1em',
                                            py: 1.3,
                                            '&:hover': {
                                                background: '#39FF14',
                                                boxShadow: '0 0 25px rgba(0,255,65,0.35)',
                                            },
                                            '&:disabled': { background: 'rgba(0,255,65,0.3)', color: 'rgba(0,0,0,0.5)' },
                                        }}
                                    >
                                        SEND MESSAGE ▶
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt:2 }}>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: '#00FF41',
                                            boxShadow: '0 0 8px #00FF41',
                                            animation: 'pulse-green 2s infinite',
                                        }}
                                    />
                                    <Typography sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.75rem',
                                color: '#00FF41',
                                letterSpacing: '0.2em',
                                opacity: 0.8,
                            }}>
                                        Usually replies within 24 hours.
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Grid>

                        {/* Right: Status + Social Links */}
                        <Grid size={{xs:12,md:6}}>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {/* Status box */}
                                <Box
                                    sx={{
                                        background: '#0a0a0a',
                                        border: '1px solid rgba(0,255,65,0.25)',
                                        borderRadius: '8px',
                                        p: 3,
                                        mb: 3,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.7rem',
                                            color: '#00FF41',
                                            letterSpacing: '0.15em',
                                            mb: 1.5,
                                        }}
                                    >
                    /* STATUS: AVAILABILITY */
                                    </Typography>
                                    <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#fff', mb: 0.5 }}>
                                        Currently open to freelance projects and full-time collaborations.
                                    </Typography>
                                </Box>

                                {/* Social links grid */}
                                <Grid container spacing={2}>
                                    {socialLinks.map((social, i) => (
                                        <Grid size={{xs:6}} key={social.label}>
                                            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                                                <Card
                                                    component="a"
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        background: '#0a0a0a',
                                                        border: '1px solid rgba(255,255,255,0.07)',
                                                        borderRadius: '8px',
                                                        p: 2,
                                                        display: 'block',
                                                        textDecoration: 'none',
                                                        '&:hover': {
                                                            border: '1px solid rgba(0,255,65,0.25)',
                                                            background: 'rgba(0,255,65,0.03)',
                                                        },
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: '6px',
                                                            background: 'rgba(0,255,65,0.08)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#00FF41',
                                                            mb: 1.5,
                                                            fontSize: social.text ? '0.7rem' : 'inherit',
                                                            fontFamily: 'Fira Code, monospace',
                                                            fontWeight: 800,
                                                        }}
                                                    >
                                                        {social.icon || social.text}
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', lineHeight: 1.3 }}>
                                                        {social.label}
                                                    </Typography>
                                                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>
                                                        {social.handle}
                                                    </Typography>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Security note */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 1.5,
                                        mt: 2.5,
                                        p: 2,
                                        background: 'rgba(0,255,65,0.03)',
                                        border: '1px solid rgba(0,255,65,0.08)',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <SecurityIcon sx={{ color: 'rgba(0,255,65,0.5)', fontSize: 18, flexShrink: 0, mt: 0.2 }} />
                                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', lineHeight: 1.6 }}>
                                        Your data is handled securely. I only use your email to respond to your inquiry
                                        and never share your details with third parties.
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* What Clients Say */}
            <ReviewSection />

            {/* Post a Review */}
            <Box sx={{ py: 8 }}>
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                fontWeight: 700,
                                color: '#fff',
                                mb: 4,
                            }}
                        >
              /* Post a Review */
                        </Typography>
                    </motion.div>
                    <ReviewForm />
                </Container>
            </Box>
        </>
    );
};

export default Contact;
