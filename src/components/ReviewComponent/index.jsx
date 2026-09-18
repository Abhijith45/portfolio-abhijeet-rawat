import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import TimerIcon from '@mui/icons-material/Timer';
import ReviewForm from '../ReviewForm';

/**
 * ReviewComponent — A reusable, self-contained review flow component.
 * Supports both post-contact countdown prompt mode ('countdown') and direct review mode ('review').
 */
const ReviewComponent = ({
    open = false,
    onClose,
    initialMode = 'countdown',
    redirectTo = '/',
    countdownDuration = 3,
    autoRedirect = true,
    redirectMessage,
    successTitle,
    successMessage,
    feedbackTitle,
    feedbackDescription,
    onReviewSubmitted,
}) => {
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(initialMode === 'review');
    const [countdown, setCountdown] = useState(countdownDuration);
    const [isTimerPaused, setIsTimerPaused] = useState(false);

    // Adjust state when open changes
    const [prevOpen, setPrevOpen] = useState(open);
    if (open !== prevOpen) {
        setPrevOpen(open);
        if (open) {
            setCountdown(countdownDuration);
            setIsTimerPaused(false);
            setShowReviewModal(initialMode === 'review');
        }
    }

    // Countdown timer for auto-navigation in countdown mode
    useEffect(() => {
        if (!open || initialMode === 'review' || showReviewModal || isTimerPaused) {
            return;
        }

        if (countdown <= 0) {
            // react-doctor-disable-next-line react-doctor/no-prop-callback-in-effect
            if (onClose) onClose();
            if (autoRedirect && redirectTo) {
                navigate(redirectTo);
            }
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [open, initialMode, showReviewModal, isTimerPaused, countdown, navigate, redirectTo, onClose, autoRedirect]);

    const handleOpenReview = useCallback(() => {
        setIsTimerPaused(true);
        setShowReviewModal(true);
    }, []);

    const handleCloseReview = useCallback(() => {
        setShowReviewModal(false);
        if (initialMode === 'review' && onClose) {
            onClose();
        }
    }, [initialMode, onClose]);

    const handleReviewSuccess = useCallback(
        (data) => {
            if (onReviewSubmitted) onReviewSubmitted(data);
            if (initialMode === 'review' && onClose) {
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        },
        [onReviewSubmitted, initialMode, onClose]
    );

    const handleManualClose = useCallback(() => {
        setIsTimerPaused(true);
        if (onClose) onClose();
    }, [onClose]);

    const timerProgress = Math.max(0, Math.min(100, (countdown / countdownDuration) * 100));
    const isTimerActive = !isTimerPaused && !showReviewModal;

    const resolvedSuccessTitle = successTitle || "Transmission Successful";
    const resolvedSuccessMessage =
        successMessage ||
        "Thanks for reaching out! I've received your message and will review your project requirements and get back to you within 24 hours.";
    const resolvedFeedbackTitle = feedbackTitle || (initialMode === 'review' ? "Suggest Improvements & Feedback" : "Leave Your Valuable Feedback");
    const resolvedFeedbackDescription =
        feedbackDescription ||
        "Whether you explored my portfolio, reviewed my projects, or sent an inquiry, your rating and thoughts help me continuously refine my craft and developer experience.";

    return (
        <>
            {/* ─── SUCCESS / COUNTDOWN MODAL (Only when initialMode !== 'review') ─── */}
            {initialMode !== 'review' && (
                <Dialog
                    maxWidth="md"
                    hideBackdrop
                    open={open && !showReviewModal}
                    onClose={(event, reason) => {
                        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
                        handleManualClose();
                    }}
                    PaperProps={{
                        sx: {
                            backgroundColor: '#000000',
                            backgroundImage:
                                'linear-gradient(rgba(0, 255, 64, 0.067) 1px, transparent 1px),linear-gradient(90deg, rgba(0, 255, 64, 0.088) 1px, transparent 1px)',
                            backgroundSize: '50px 50px',
                            color: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 0,
                            borderRadius: 2,
                            overflowY: 'auto',
                        },
                    }}
                >
                    {/* TOP TIMER BAR */}
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 'md',
                            position: 'sticky',
                            top: 0,
                            zIndex: 10,
                            background: 'black',
                            backdropFilter: 'blur(10px)',
                            borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
                        }}
                    >
                        <LinearProgress
                            variant="determinate"
                            value={timerProgress}
                            sx={{
                                height: { xs: 2, sm: 3, md: 4 },
                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#00FF41',
                                    boxShadow: '0 0 10px #00FF41',
                                    transition: 'transform 0.8s linear',
                                },
                            }}
                        />
                    </Box>

                    {/* HERO BODY */}
                    <Container
                        maxWidth="md"
                        sx={{
                            my: 'auto',
                            py: { xs: 4, md: 6 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <TimerIcon
                            sx={{
                                fontSize: { xs: 24, sm: 30, md: 40 },
                                color: isTimerActive ? '#00FF41' : '#ffb400',
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 100,
                                fontSize: { xs: '1.5rem', sm: '2.2rem', md: '2.8rem' },
                                letterSpacing: '-0.02em',
                                color: '#ffffff',
                                mt: 2,
                                mb: 1,
                                lineHeight: 1.15,
                            }}
                        >
                            {countdown}
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.8rem',
                                color: '#00FF41',
                                letterSpacing: '0.1em',
                                mb: 2,
                            }}
                        >
                            // {resolvedSuccessTitle.toUpperCase()}
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: { xs: '1rem', sm: '1.15rem' },
                                color: 'rgba(255, 255, 255, 0.82)',
                                lineHeight: 1.65,
                                maxWidth: 'md',
                                fontWeight: 300,
                                mb: 3.5,
                            }}
                        >
                            {resolvedSuccessMessage}
                        </Typography>

                        {/* FEEDBACK CALLOUT */}
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 800,
                                    color: '#ffffff',
                                    mb: 1,
                                    fontSize: { xs: '1.05rem', sm: '1.15rem' },
                                }}
                            >
                                {resolvedFeedbackTitle}
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    color: 'rgba(255, 255, 255, 0.65)',
                                    fontSize: { xs: '0.85rem', sm: '0.92rem' },
                                    lineHeight: 1.6,
                                    mb: 3,
                                    maxWidth: 'sm',
                                    mx: 'auto',
                                }}
                            >
                                {resolvedFeedbackDescription}
                            </Typography>

                            <Button
                                id="review-component-rate-btn"
                                variant="contained"
                                onClick={handleOpenReview}
                                startIcon={<StarIcon sx={{ color: '#000000 !important' }} />}
                                sx={{
                                    background: '#00FF41aa',
                                    color: '#000000',
                                    fontFamily: 'Fira Code, monospace',
                                    fontWeight: 800,
                                    fontSize: '0.88rem',
                                    letterSpacing: '0.12em',
                                    px: 4,
                                    py: 0.5,
                                    borderRadius: '6px',
                                    boxShadow: '0 0 1px rgba(0, 255, 65, 0.15)',
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        background: '#00FF41dd',
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                Rate Now
                            </Button>
                        </Box>
                    </Container>
                </Dialog>
            )}

            {/* ─── REVIEW FORM MODAL ─── */}
            <Dialog
                open={open && (initialMode === 'review' || showReviewModal)}
                onClose={handleCloseReview}
                maxWidth="md"
                fullWidth
                sx={{ zIndex: 1400 }}
                PaperProps={{
                    sx: {
                        backgroundColor: '#000000',
                        border: '1px solid rgba(0, 255, 65, 0.3)',
                        backgroundImage:
                            'linear-gradient(rgba(0, 255, 64, 0.067) 1px, transparent 1px),linear-gradient(90deg, rgba(0, 255, 64, 0.088) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                        borderRadius: '14px',
                        p: { xs: 1.5, sm: 2.5 },
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1,
                        pb: 2,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.72rem',
                                color: '#00FF41',
                                letterSpacing: '0.12em',
                                mb: 0.5,
                            }}
                        >
                            {'// VISITOR FEEDBACK & REVIEW'}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 800,
                                color: '#ffffff',
                                fontSize: { xs: '1.15rem', sm: '1.35rem' },
                            }}
                        >
                            {resolvedFeedbackTitle}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={handleCloseReview}
                        aria-label="Close review modal"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            '&:hover': {
                                color: '#00FF41',
                                borderColor: '#00FF41',
                                background: 'rgba(0, 255, 65, 0.08)',
                            },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>
                <DialogContent sx={{ p: 0 }}>
                    <ReviewForm
                        autoRedirect={autoRedirect}
                        redirectTo={redirectTo}
                        redirectMessage={redirectMessage}
                        onSuccess={handleReviewSuccess}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

ReviewComponent.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    initialMode: PropTypes.oneOf(['countdown', 'review']),
    redirectTo: PropTypes.string,
    countdownDuration: PropTypes.number,
    autoRedirect: PropTypes.bool,
    redirectMessage: PropTypes.string,
    successTitle: PropTypes.string,
    successMessage: PropTypes.string,
    feedbackTitle: PropTypes.string,
    feedbackDescription: PropTypes.string,
    onReviewSubmitted: PropTypes.func,
};

export default ReviewComponent;
