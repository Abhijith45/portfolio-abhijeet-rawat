import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Slider,
    Alert,
    CircularProgress,
    Grid,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema } from '../../utils/validation';
import { useReviews } from '../../hooks/useReviews';
import { motion } from 'framer-motion';

// Rating dots at 0.5 step increments from 0.0 to 5.0
const ratingMarks = [
    { value: 0 },
    { value: 0.5 },
    { value: 1 },
    { value: 1.5 },
    { value: 2 },
    { value: 2.5 },
    { value: 3 },
    { value: 3.5 },
    { value: 4 },
    { value: 4.5 },
    { value: 5 },
];

const ReviewForm = ({ onSuccess, redirectTo = '/', redirectDelay = 2000 }) => {
    const navigate = useNavigate();
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isThrottled, setIsThrottled] = useState(false);
    const { submitReview } = useReviews();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(reviewSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            designation: '',
            rating: 0,
            message: '',
        },
    });

    const values = watch();

    const isNameValid = !errors.name && Boolean(values.name && values.name.trim().length >= 2);
    const isEmailValid = !errors.email && Boolean(values.email && values.email.trim().length >= 5 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()));
    const isDesignationValid = !errors.designation && Boolean(values.designation && values.designation.trim().length >= 2);
    const isMessageValid = !errors.message && Boolean(values.message && values.message.trim().length >= 10);

    // Auto-navigate to home page 2 seconds after successful submission
    useEffect(() => {
        let timer;
        if (submitStatus === 'success') {
            timer = setTimeout(() => {
                navigate(redirectTo);
            }, redirectDelay);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [submitStatus, navigate, redirectTo, redirectDelay]);

    const onSubmit = async (data) => {
        if (isThrottled || isSubmitting) return;

        // Throttling: immediately disable to prevent duplicate clicks
        setIsThrottled(true);
        setIsSubmitting(true);

        try {
            const reviewPayload = {
                name: data.name.trim(),
                email: data.email.trim(),
                company: data.designation.trim(),
                designation: data.designation.trim(),
                rating: Number(data.rating),
                message: data.message.trim(),
            };

            await submitReview(reviewPayload);
            setSubmitStatus('success');
            reset();

            if (onSuccess) {
                onSuccess(reviewPayload);
            }
        } catch (err) {
            console.error('Failed to submit review:', err);
            setSubmitStatus('error');
            // Re-enable after throttle cool-off so user can retry
            setTimeout(() => {
                setIsThrottled(false);
                setSubmitStatus(null);
            }, 3000);
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

    const labelSx = {
        color: '#ffffff',
        fontSize: { xs: '0.68rem', sm: '0.75rem' },
        fontFamily: 'Fira Code, monospace',
        mb: 0.8,
        letterSpacing: '0.1em',
        display: 'block',
    };

    // If submission was successful, replace the form with the centered success feedback message
    if (submitStatus === 'success') {
        return (
            <Box
                sx={{
                    minHeight: { xs: 320, sm: 400 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    py: 4,
                    px: 2,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <CheckCircleOutlineIcon
                        sx={{
                            fontSize: { xs: 60, sm: 76 },
                            color: '#00FF41',
                            mb: 2.5,
                            filter: 'drop-shadow(0 0 16px rgba(0, 255, 65, 0.6))',
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 800,
                            color: '#ffffff',
                            fontSize: { xs: '1.4rem', sm: '1.85rem' },
                            letterSpacing: '-0.02em',
                            mb: 1.5,
                        }}
                    >
                        Thank you for your feedback
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.78rem', sm: '0.88rem' },
                            color: 'rgba(255, 255, 255, 0.65)',
                            letterSpacing: '0.06em',
                        }}
                    >
                        Redirecting to Home in 2 seconds...
                    </Typography>
                </motion.div>
            </Box>
        );
    }

    const isButtonDisabled = !isValid || isSubmitting || isThrottled;

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
                p: { xs: 0.5, sm: 1 },
            }}
        >
            <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                {/* 1. NAME */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelSx}>
                        01. YOUR NAME
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="e.g. Jane Smith"
                        size="small"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={getInputStyles(!!errors.name, isNameValid)}
                    />
                </Grid>

                {/* 2. EMAIL */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelSx}>
                        02. YOUR EMAIL
                    </Typography>
                    <TextField
                        fullWidth
                        type="email"
                        placeholder="e.g. jane@company.com"
                        size="small"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={getInputStyles(!!errors.email, isEmailValid)}
                    />
                </Grid>

                {/* 3. DESIGNATION */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelSx}>
                        03. DESIGNATION
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="e.g. CEO at TechCorp / Engineering Lead"
                        size="small"
                        {...register('designation')}
                        error={!!errors.designation}
                        helperText={errors.designation?.message}
                        sx={getInputStyles(!!errors.designation, isDesignationValid)}
                    />
                </Grid>

                {/* 4. RATING */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ px: 0.5 }}>
                        <Typography sx={labelSx}>
                            04. RATING
                        </Typography>
                        <Controller
                            name="rating"
                            control={control}
                            render={({ field }) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                                    <Slider
                                        value={typeof field.value === 'number' ? field.value : 0}
                                        min={0}
                                        max={5}
                                        step={0.5}
                                        marks={ratingMarks}
                                        valueLabelDisplay="auto"
                                        onChange={(_, value) => field.onChange(value)}
                                        sx={{
                                            color: '#00FF41',
                                            py: 2,
                                            '& .MuiSlider-thumb': {
                                                width: 12,
                                                height: 12,
                                                backgroundColor: '#00FF41',
                                                boxShadow: '0 0 10px rgba(0, 255, 65, 0.6)',
                                                '&:hover, &.Mui-focusVisible': {
                                                    boxShadow: '0 0 0 8px rgba(0, 255, 65, 0.2)',
                                                },
                                            },
                                            '& .MuiSlider-track': {
                                                backgroundColor: '#00FF41',
                                                height: 5,
                                                borderRadius: 3,
                                                border: 'none',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                height: 5,
                                                borderRadius: 3,
                                                opacity: 1,
                                            },
                                            '& .MuiSlider-mark': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                height: 7,
                                                width: 7,
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                transform: 'translate(-50%, -50%)',
                                                top: '50%',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: '#00FF41',
                                                    transform: 'translate(-50%, -50%) scale(1.3)',
                                                },
                                                '&.MuiSlider-markActive': {
                                                    backgroundColor: '#000000',
                                                    border: '1.5px solid #00FF41',
                                                },
                                            },
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            color: '#00FF41',
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            minWidth: '3rem',
                                            textAlign: 'right',
                                        }}
                                    >
                                        {Number(field.value || 0).toFixed(1)}
                                    </Typography>
                                </Box>
                            )}
                        />
                        {errors.rating && (
                            <Typography sx={{ color: '#ff4444', fontSize: '0.72rem', fontFamily: 'Fira Code, monospace', mt: 0.5 }}>
                                {errors.rating?.message}
                            </Typography>
                        )}
                    </Box>
                </Grid>

                {/* 5. MESSAGE */}
                <Grid size={{ xs: 12 }}>
                    <Typography sx={labelSx}>
                        05. YOUR REVIEW
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Share your experience working with me (minimum 10 characters)..."
                        {...register('message')}
                        error={!!errors.message}
                        helperText={errors.message?.message}
                        sx={getInputStyles(!!errors.message, isMessageValid)}
                    />
                </Grid>

                {/* ERROR ALERT */}
                {submitStatus === 'error' && (
                    <Grid size={{ xs: 12 }}>
                        <Alert
                            severity="error"
                            sx={{
                                border: '1px solid rgba(255, 68, 68, 0.3)',
                                background: 'rgba(255, 68, 68, 0.08)',
                                color: '#ff7777',
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.8rem',
                            }}
                        >
                            Failed to submit review. Please try again.
                        </Alert>
                    </Grid>
                )}

                {/* SUBMIT BUTTON */}
                <Grid size={{ xs: 12 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isButtonDisabled}
                        endIcon={
                            isSubmitting ? (
                                <CircularProgress size={16} sx={{ color: '#000' }} />
                            ) : (
                                <SendIcon />
                            )
                        }
                        sx={{
                            background: '#00FF41',
                            color: '#000000',
                            fontWeight: 700,
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            letterSpacing: '0.1em',
                            px: { xs: 3.5, sm: 4.5 },
                            py: 1.2,
                            borderRadius: '4px',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                                background: '#39FF14',
                                boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)',
                            },
                            '&:disabled': {
                                background: 'rgba(0,255,65,0.2)',
                                color: 'rgba(255, 255, 255, 0.45)',
                                cursor: 'not-allowed',
                            },
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReviewForm;
