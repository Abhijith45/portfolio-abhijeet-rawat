import React, { useState } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema } from '../../utils/validation';
import { useReviews } from '../../hooks/useReviews';

const ReviewForm = () => {
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { submitReview } = useReviews();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(reviewSchema),
        defaultValues: { name: '', company: '', rating: 5, message: '' },
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            await submitReview(data);
            setSubmitStatus('success');
            reset();
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 5000);
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
        '& .MuiInputLabel-root': {
            color: '#00FF41',
            fontSize: '0.75rem',
            fontFamily: 'Fira Code, monospace',
            letterSpacing: '0.1em',
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#00FF41' },
        '& .MuiOutlinedInput-input': { color: '#fff', fontSize: '0.9rem' },
        '& .MuiFormHelperText-root': { color: '#ff4444' },
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                background: '#0a0a0a',
                border: '1px solid rgba(0,255,65,0.15)',
                borderRadius: '8px',
                p: { xs: 2.5, sm: 4 },
            }}
        >
            <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                <Grid size={{xs:12,sm:6}}>
                    <Typography
                        sx={{
                            color: '#00FF41',
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            fontFamily: 'Fira Code, monospace',
                            mb: 0.5,
                            letterSpacing: '0.1em',
                        }}
                    >
            // YOUR NAME
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="e.g. Jane Smith"
                        size="small"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={inputSx}
                    />
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Typography
                        sx={{
                            color: '#00FF41',
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            fontFamily: 'Fira Code, monospace',
                            mb: 0.5,
                            letterSpacing: '0.1em',
                        }}
                    >
            // DESIGNATION
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="e.g. CEO at TechCorp"
                        size="small"
                        {...register('company')}
                        error={!!errors.company}
                        helperText={errors.company?.message}
                        sx={inputSx}
                    />
                </Grid>
                <Grid size={{xs:12}}>
                    <Box sx={{ px: 0.5 }}>
                        <Typography
                            sx={{
                                color: '#00FF41',
                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                fontFamily: 'Fira Code, monospace',
                                mb: 1,
                                letterSpacing: '0.1em',
                            }}
                        >
              /* RATING (0.5 - 5.0) */
                        </Typography>
                        <Controller
                            name="rating"
                            control={control}
                            render={({ field }) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Slider
                                        {...field}
                                        min={0.5}
                                        max={5}
                                        step={0.5}
                                        valueLabelDisplay="auto"
                                        onChange={(_, value) => field.onChange(value)}
                                        sx={{
                                            color: '#00FF41',
                                            '& .MuiSlider-thumb': {
                                                '&:hover': { boxShadow: '0 0 0 8px rgba(0,255,65,0.16)' },
                                            },
                                            '& .MuiSlider-rail': { background: 'rgba(255,255,255,0.1)' },
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            color: '#00FF41',
                                            fontFamily: 'Fira Code, monospace',
                                            fontSize: '0.85rem',
                                            minWidth: '28px',
                                        }}
                                    >
                                        {field.value}
                                    </Typography>
                                </Box>
                            )}
                        />
                        {errors.rating && (
                            <Typography sx={{ color: '#ff4444', fontSize: '0.75rem', mt: 0.5 }}>
                                {errors.rating?.message}
                            </Typography>
                        )}
                    </Box>
                </Grid>
                <Grid size={{xs:12}}>
                    <Typography
                        sx={{
                            color: '#00FF41',
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            fontFamily: 'Fira Code, monospace',
                            mb: 0.5,
                            letterSpacing: '0.1em',
                        }}
                    >
            // YOUR REVIEW
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Share your experience working with me..."
                        {...register('message')}
                        error={!!errors.message}
                        helperText={errors.message?.message}
                        sx={inputSx}
                    />
                </Grid>

                {submitStatus === 'success' && (
                    <Grid size={{xs:12}}>
                        <Alert
                            severity="success"
                            sx={{
                                background: 'rgba(0,255,65,0.08)',
                                color: '#00FF41',
                                border: '1px solid rgba(0,255,65,0.2)',
                            }}
                        >
                            Review submitted! It will appear after approval.
                        </Alert>
                    </Grid>
                )}
                {submitStatus === 'error' && (
                    <Grid item xs={12}>
                        <Alert severity="error" sx={{ border: '1px solid rgba(255,68,68,0.2)' }}>
                            Failed to submit. Please try again.
                        </Alert>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        endIcon={
                            isSubmitting ? (
                                <CircularProgress size={16} sx={{ color: '#000' }} />
                            ) : (
                                <SendIcon />
                            )
                        }
                        sx={{
                            background: '#00FF41',
                            color: '#000',
                            fontWeight: 700,
                            fontFamily: 'Fira Code, monospace',
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            letterSpacing: '0.1em',
                            px: { xs: 3, sm: 4 },
                            py: 1.2,
                            '&:hover': { background: '#39FF14', boxShadow: '0 0 20px rgba(0,255,65,0.3)' },
                            '&:disabled': { background: 'rgba(0,255,65,0.3)', color: 'rgba(0,0,0,0.5)' },
                        }}
                    >
                        SUBMIT REVIEW ✦
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReviewForm;
