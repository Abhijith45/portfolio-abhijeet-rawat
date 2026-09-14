import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { logErrorToWebhook } from '../../services/logger';

/**
 * Default Cyberpunk-Themed Fallback UI for intercepted runtime errors.
 */
export const DefaultErrorFallback = ({ resetErrorBoundary }) => {
    const handleReload = () => {
        if (typeof window !== 'undefined' && window.location) {
            window.location.reload();
        }
    };

    const handleGoHome = () => {
        if (typeof window !== 'undefined' && window.location) {
            window.location.href = '/';
        }
    };

    return (
        <Box
            role="alert"
            aria-live="assertive"
            sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, sm: 4 },
                backgroundColor: '#000000',
                color: '#ffffff',
                fontFamily: '"Inter", sans-serif',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    maxWidth: 540,
                    width: '100%',
                    textAlign: 'center',
                    background: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 65, 0.08) 0%, rgba(13, 13, 13, 0.95) 75%)',
                    backgroundColor: '#0d0d0d',
                    border: '1px solid rgba(0, 255, 65, 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 0 35px rgba(0, 255, 65, 0.15), inset 0 0 15px rgba(0, 255, 65, 0.05)',
                    p: { xs: 4, sm: 5 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative Cyberpunk Top Stripe */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #00FF41 0%, #39FF14 50%, #00cc33 100%)',
                        boxShadow: '0 0 10px #00FF41',
                    }}
                />

                {/* Friendly Warning Icon */}
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 255, 65, 0.08)',
                        border: '1px solid rgba(0, 255, 65, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2.5,
                        boxShadow: '0 0 20px rgba(0, 255, 65, 0.15)',
                    }}
                >
                    <ErrorOutlineRoundedIcon sx={{ fontSize: '2rem', color: '#00FF41' }} />
                </Box>

                {/* Simple Main Heading */}
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        color: '#ffffff',
                        mb: 1.5,
                        fontSize: { xs: '1.5rem', sm: '1.85rem' },
                        lineHeight: 1.2,
                    }}
                >
                    Something Went Wrong
                </Typography>

                {/* Simple Human-Friendly Description */}
                <Typography
                    variant="body1"
                    sx={{
                        color: '#a0a0a0',
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        mb: 3.5,
                        lineHeight: 1.6,
                        maxWidth: 420,
                        mx: 'auto',
                    }}
                >
                    We encountered an unexpected issue while loading this page. Please try refreshing or return to the home page.
                </Typography>

                {/* Action Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 1.5,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={resetErrorBoundary}
                        startIcon={<RefreshRoundedIcon />}
                        sx={{
                            background: '#00FF41',
                            color: '#000000',
                            fontWeight: 700,
                            borderRadius: '6px',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            letterSpacing: '0.02em',
                            '&:hover': {
                                background: '#39FF14',
                                boxShadow: '0 0 20px rgba(0, 255, 65, 0.5)',
                            },
                        }}
                    >
                        Try Again
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleReload}
                        sx={{
                            borderColor: 'rgba(0, 255, 65, 0.4)',
                            color: '#ffffff',
                            fontWeight: 600,
                            borderRadius: '6px',
                            px: 2.5,
                            py: 1,
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: '#00FF41',
                                background: 'rgba(0, 255, 65, 0.08)',
                                boxShadow: '0 0 15px rgba(0, 255, 65, 0.2)',
                            },
                        }}
                    >
                        Reload Page
                    </Button>

                    <Button
                        variant="text"
                        onClick={handleGoHome}
                        startIcon={<HomeRoundedIcon sx={{ color: '#00FF41' }} />}
                        sx={{
                            color: '#a0a0a0',
                            fontWeight: 600,
                            borderRadius: '6px',
                            px: 2,
                            py: 1,
                            textTransform: 'none',
                            '&:hover': {
                                color: '#ffffff',
                                background: 'rgba(255, 255, 255, 0.05)',
                            },
                        }}
                    >
                        Back to Home
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

DefaultErrorFallback.propTypes = {
    error: PropTypes.object,
    errorInfo: PropTypes.object,
    resetErrorBoundary: PropTypes.func.isRequired,
};

/**
 * Production-grade Error Boundary class component.
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a resilient fallback UI instead of crashing.
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, errorInfo) {
        // Store componentStack in state for diagnostic inspection
        this.setState({ errorInfo });

        // Dispatch error to production webhook in fire-and-forget mode
        try {
            logErrorToWebhook({
                severity: 'ERROR',
                component: 'ErrorBoundary',
                stack: error?.stack || errorInfo?.componentStack || 'N/A',
                statusCode: 500,
                message: error?.message || 'React ErrorBoundary Intercepted Runtime Error',
            });
        } catch {
            // Never let logging failure disrupt error boundary fallback
        }

        // Invoke optional telemetry / logging callback
        if (typeof this.props.onError === 'function') {
            try {
                this.props.onError(error, errorInfo);
            } catch (err) {
                // Safeguard against errors inside the onError handler itself
                console.error('ErrorBoundary onError callback threw:', err);
            }
        }
    }

    handleReset = () => {
        if (typeof this.props.onReset === 'function') {
            try {
                this.props.onReset();
            } catch (err) {
                console.error('ErrorBoundary onReset callback threw:', err);
            }
        }

        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        const { hasError, error, errorInfo } = this.state;
        const { children, fallback } = this.props;

        if (hasError) {
            // 1. If fallback is a function / render prop
            if (typeof fallback === 'function') {
                return fallback({
                    error,
                    errorInfo,
                    resetErrorBoundary: this.handleReset,
                });
            }

            // 2. If fallback is a custom React Element
            if (React.isValidElement(fallback)) {
                return fallback;
            }

            // 3. Default fallback UI
            return (
                <DefaultErrorFallback
                    error={error}
                    errorInfo={errorInfo}
                    resetErrorBoundary={this.handleReset}
                />
            );
        }

        return children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node,
    fallback: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    onError: PropTypes.func,
    onReset: PropTypes.func,
};

export default ErrorBoundary;
