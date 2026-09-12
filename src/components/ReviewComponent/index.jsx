import React, { useState, useEffect, useCallback } from 'react';
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReviewForm from '../ReviewForm';
import { motion } from 'framer-motion';

/**
 * ReviewComponent — A reusable, self-contained review flow component.
 *
 * Props:
 * @param {boolean}  open             - Controls visibility of the success modal.
 * @param {function} onClose          - Called when the component wants to close (countdown end, manual close).
 * @param {string}   [redirectTo='/'] - Path to navigate to after countdown completes.
 * @param {number}   [countdownDuration=3] - Countdown duration in seconds before auto-redirect.
 * @param {string}   [successTitle]   - Custom success title text.
 * @param {string}   [successMessage] - Custom success body message.
 * @param {string}   [feedbackTitle]  - Custom feedback section title.
 * @param {string}   [feedbackDescription] - Custom feedback section description.
 * @param {function} [onReviewSubmitted] - Callback after a review is successfully submitted.
 */
const ReviewComponent = ({
    open = false,
    onClose,
    redirectTo = '/',
    countdownDuration = 3,
    successTitle,
    successMessage,
    feedbackTitle,
    feedbackDescription,
    onReviewSubmitted,
}) => {
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [countdown, setCountdown] = useState(countdownDuration);
    const [isTimerPaused, setIsTimerPaused] = useState(false);

    // Reset countdown whenever the component opens
    useEffect(() => {
        if (open) {
            setCountdown(countdownDuration);
            setIsTimerPaused(false);
            setShowReviewModal(false);
        }
    }, [open, countdownDuration]);

    // 3-second countdown timer for auto-navigation
    useEffect(() => {
        let interval = null;
        if (open && !showReviewModal && !isTimerPaused && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        if (onClose) onClose();
                        navigate(redirectTo);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [open, showReviewModal, isTimerPaused, countdown, navigate, redirectTo, onClose]);

    const handleOpenReview = useCallback(() => {
        setIsTimerPaused(true);
        setShowReviewModal(true);
    }, []);

    const handleCloseReview = useCallback(() => {
        setShowReviewModal(false);
    }, []);

    const handleReviewSuccess = useCallback(
        (data) => {
            if (onReviewSubmitted) onReviewSubmitted(data);
        },
        [onReviewSubmitted]
    );

    const handleManualClose = useCallback(() => {
        setIsTimerPaused(true);
        if (onClose) onClose();
    }, [onClose]);

    const handleSkipToHome = useCallback(() => {
        if (onClose) onClose();
        navigate(redirectTo);
    }, [onClose, navigate, redirectTo]);

    // Derived values
    const timerProgress = Math.max(0, Math.min(100, (countdown / countdownDuration) * 100));
    const isTimerActive = !isTimerPaused && !showReviewModal;

    const resolvedSuccessTitle = successTitle || "Transmission Successful";
    const resolvedSuccessMessage =
        successMessage ||
        "Thanks for reaching out! I've received your message and will review your project requirements and get back to you within 24 hours.";
    const resolvedFeedbackTitle = feedbackTitle || "Leave Your Valuable Feedback";
    const resolvedFeedbackDescription =
        feedbackDescription ||
        "Whether you explored my portfolio, reviewed my projects, or sent an inquiry, your rating and thoughts help me continuously refine my craft and developer experience.";

    return (
        <>
            {/* ─── SUCCESS MODAL ─── */}
            <Dialog
                maxWidth="md"
                hideBackdrop
                open={open}
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
                {/* TOP TIMER & NAVIGATION BAR */}
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
                    {/* Progress bar for countdown */}
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

                {/* CENTER HERO BODY */}
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
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {/* Countdown timer icon */}
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
                                mb: 2,
                                lineHeight: 1.15,
                            }}
                        >
                            {countdown}
                        </Typography>

                        {/* Success message */}
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
                    </motion.div>
                </Container>
            </Dialog>

            {/* ─── REVIEW FORM MODAL ─── */}
            <Dialog
                open={showReviewModal}
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
                    <Typography
                        sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 800,
                            color: '#ffffff',
                            fontSize: { xs: '1.15rem', sm: '1.35rem' },
                        }}
                    >
                        Provide Your Feedback
                    </Typography>
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
                    <ReviewForm onSuccess={handleReviewSuccess} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ReviewComponent;
