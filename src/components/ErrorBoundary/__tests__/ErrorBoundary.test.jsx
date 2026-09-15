import React, { useState } from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary, DefaultErrorFallback } from '../ErrorBoundary';

// Helper component that throws on demand
const ProblemChild = ({ shouldThrow = false, message = 'Crashing intentionally' }) => {
    if (shouldThrow) {
        throw new Error(message);
    }
    return <div data-testid="child-healthy">System Online</div>;
};

// Stateful component that can be toggled to recover
const RecoverableChild = ({ throwInitially = true }) => {
    const [hasError, setHasError] = useState(throwInitially);

    if (hasError) {
        return (
            <div>
                <button data-testid="fix-child-btn" onClick={() => setHasError(false)}>
                    Fix Error
                </button>
                <ProblemChild shouldThrow message="Component Failure Detected" />
            </div>
        );
    }

    return <div data-testid="child-recovered">Component Successfully Recovered</div>;
};

describe('ErrorBoundary - Production Grade Test Suite', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        // Suppress React's default error logging in console during expected error boundary tests
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        cleanup();
        consoleErrorSpy.mockRestore();
        vi.restoreAllMocks();
    });

    describe('1. Normal Rendering (No Error)', () => {
        it('renders child components cleanly when no error is thrown', () => {
            render(
                <ErrorBoundary>
                    <ProblemChild shouldThrow={false} />
                </ErrorBoundary>
            );

            expect(screen.getByTestId('child-healthy')).toBeInTheDocument();
            expect(screen.getByText('System Online')).toBeInTheDocument();
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });

    describe('2. Intercepting Errors & Default Fallback UI', () => {
        it('catches render error and displays the centered fallback UI without crashing', () => {
            render(
                <ErrorBoundary>
                    <ProblemChild shouldThrow message="Critical memory overflow simulation" />
                </ErrorBoundary>
            );

            // Alert container
            const alert = screen.getByRole('alert');
            expect(alert).toBeInTheDocument();

            // Simple user-friendly messaging
            expect(screen.getByText(/Something Went Wrong/i)).toBeInTheDocument();
            expect(screen.getByText(/We encountered an unexpected issue while loading this page/i)).toBeInTheDocument();

            // No technical badges or raw error messages
            expect(screen.queryByText(/RUNTIME_EXCEPTION_INTERCEPTED/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/SAFEGUARD ACTIVE/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/DIAGNOSTIC_MSG/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Critical memory overflow simulation/i)).not.toBeInTheDocument();

            // Action buttons
            expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Reload Page/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Back to Home/i })).toBeInTheDocument();

            // Unhealthy child must not be present
            expect(screen.queryByTestId('child-healthy')).not.toBeInTheDocument();
        });

        it('calls onError callback with error and errorInfo when an error occurs', () => {
            const onErrorMock = vi.fn();
            const testErrorMessage = 'Telemetry error tracking test';

            render(
                <ErrorBoundary onError={onErrorMock}>
                    <ProblemChild shouldThrow message={testErrorMessage} />
                </ErrorBoundary>
            );

            expect(onErrorMock).toHaveBeenCalledTimes(1);
            const [caughtError, caughtErrorInfo] = onErrorMock.mock.calls[0];
            expect(caughtError).toBeInstanceOf(Error);
            expect(caughtError.message).toBe(testErrorMessage);
            expect(caughtErrorInfo).toHaveProperty('componentStack');
        });

        it('gracefully handles an onError callback that throws without crashing boundary', () => {
            const throwingOnError = vi.fn().mockImplementation(() => {
                throw new Error('Logger service unavailable');
            });

            render(
                <ErrorBoundary onError={throwingOnError}>
                    <ProblemChild shouldThrow message="Child error" />
                </ErrorBoundary>
            );

            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText(/Something Went Wrong/i)).toBeInTheDocument();
        });
    });

    describe('3. Error Recovery and Reset Flow', () => {
        it('invokes onReset and resets the error boundary when Try Again is clicked', async () => {
            const user = userEvent.setup();
            const onResetMock = vi.fn();

            let shouldThrow = true;
            const DynamicComponent = () => {
                if (shouldThrow) {
                    throw new Error('Initial fault');
                }
                return <div data-testid="recovered-tree">Repaired Content</div>;
            };

            render(
                <ErrorBoundary onReset={onResetMock}>
                    <DynamicComponent />
                </ErrorBoundary>
            );

            // Verify error boundary caught error
            expect(screen.getByText(/Something Went Wrong/i)).toBeInTheDocument();

            // Fix the error condition before retrying
            shouldThrow = false;

            const tryAgainBtn = screen.getByRole('button', { name: /Try Again/i });
            await user.click(tryAgainBtn);

            expect(onResetMock).toHaveBeenCalledTimes(1);

            // Re-render occurs and healthy child is visible
            expect(screen.getByTestId('recovered-tree')).toBeInTheDocument();
            expect(screen.getByText('Repaired Content')).toBeInTheDocument();
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        it('handles exceptions inside onReset callback safely', async () => {
            const user = userEvent.setup();
            const throwingOnReset = vi.fn().mockImplementation(() => {
                throw new Error('Reset failed');
            });

            render(
                <ErrorBoundary onReset={throwingOnReset}>
                    <ProblemChild shouldThrow message="Transient glitch" />
                </ErrorBoundary>
            );

            const tryAgainBtn = screen.getByRole('button', { name: /Try Again/i });
            await user.click(tryAgainBtn);

            expect(throwingOnReset).toHaveBeenCalledTimes(1);
        });
    });

    describe('4. Custom Fallback Support', () => {
        it('renders custom React element when provided as fallback prop', () => {
            render(
                <ErrorBoundary
                    fallback={
                        <div data-testid="custom-fallback-box">
                            <h2>Custom Emergency Screen</h2>
                        </div>
                    }
                >
                    <ProblemChild shouldThrow message="Component crash" />
                </ErrorBoundary>
            );

            expect(screen.getByTestId('custom-fallback-box')).toBeInTheDocument();
            expect(screen.getByText('Custom Emergency Screen')).toBeInTheDocument();
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        it('renders custom render function receiving error and resetErrorBoundary', async () => {
            const user = userEvent.setup();
            let shouldThrow = true;

            const FallbackFn = ({ error, resetErrorBoundary }) => (
                <div data-testid="function-fallback">
                    <span>Captured: {error.message}</span>
                    <button onClick={resetErrorBoundary}>Custom Reset</button>
                </div>
            );

            const FlakyApp = () => {
                if (shouldThrow) {
                    throw new Error('Fatal socket disconnect');
                }
                return <div data-testid="reconnected">Socket Connected</div>;
            };

            render(
                <ErrorBoundary fallback={FallbackFn}>
                    <FlakyApp />
                </ErrorBoundary>
            );

            expect(screen.getByTestId('function-fallback')).toBeInTheDocument();
            expect(screen.getByText(/Captured: Fatal socket disconnect/i)).toBeInTheDocument();

            // Simulate fix and reset
            shouldThrow = false;
            await user.click(screen.getByRole('button', { name: /Custom Reset/i }));

            expect(screen.getByTestId('reconnected')).toBeInTheDocument();
            expect(screen.queryByTestId('function-fallback')).not.toBeInTheDocument();
        });
    });

    describe('5. Clean User-Facing UI (No Technical Jargon)', () => {
        it('does not expose technical stack traces or diagnostic error messages to visitors', () => {
            render(
                <ErrorBoundary>
                    <ProblemChild shouldThrow message="Sensitive Internal Error Stack Trace" />
                </ErrorBoundary>
            );

            expect(screen.getByText(/Something Went Wrong/i)).toBeInTheDocument();
            expect(screen.queryByText(/Sensitive Internal Error Stack Trace/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/RUNTIME_EXCEPTION_INTERCEPTED/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/DIAGNOSTIC_MSG/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/SAFEGUARD ACTIVE/i)).not.toBeInTheDocument();
        });
    });

    describe('6. Navigation & Reload Operations', () => {
        it('triggers window.location.reload when Reload Page is clicked', async () => {
            const user = userEvent.setup();
            const reloadMock = vi.fn();

            // Mock window.location.reload
            const originalLocation = window.location;
            delete window.location;
            window.location = { ...originalLocation, reload: reloadMock, href: '' };

            render(
                <ErrorBoundary>
                    <ProblemChild shouldThrow message="Crash reload test" />
                </ErrorBoundary>
            );

            const reloadBtn = screen.getByRole('button', { name: /Reload Page/i });
            await user.click(reloadBtn);

            expect(reloadMock).toHaveBeenCalledTimes(1);

            // Restore
            window.location = originalLocation;
        });

        it('navigates to "/" when Back to Home is clicked', async () => {
            const user = userEvent.setup();

            const originalLocation = window.location;
            delete window.location;
            window.location = { ...originalLocation, href: '/some-broken-page' };

            render(
                <ErrorBoundary>
                    <ProblemChild shouldThrow message="Crash home test" />
                </ErrorBoundary>
            );

            const homeBtn = screen.getByRole('button', { name: /Back to Home/i });
            await user.click(homeBtn);

            expect(window.location.href).toBe('/');

            // Restore
            window.location = originalLocation;
        });
    });

    describe('7. DefaultErrorFallback Component Direct Testing', () => {
        it('renders cleanly as a standalone component with centered friendly UI and reset callback', () => {
            const resetMock = vi.fn();
            const dummyError = new Error('Standalone error');

            render(
                <DefaultErrorFallback
                    error={dummyError}
                    errorInfo={{ componentStack: '\n    at DummyComponent' }}
                    resetErrorBoundary={resetMock}
                />
            );

            expect(screen.getByText(/Something Went Wrong/i)).toBeInTheDocument();
            expect(screen.queryByText(/Standalone error/i)).not.toBeInTheDocument();
            fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));
            expect(resetMock).toHaveBeenCalledTimes(1);
        });
    });
});
