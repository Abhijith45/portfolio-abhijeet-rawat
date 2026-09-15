import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { authApi } from '../../services/api';

vi.mock('../../services/api', () => ({
    authApi: {
        getMe: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
    },
    logger: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

// Test consumer component to trigger actions
const TestConsumer = () => {
    const { user, loading, login, logout } = useAuth();

    if (loading) return <div>Loading Auth...</div>;

    return (
        <div>
            <div data-testid="user-status">{user ? `Logged in: ${user.name}` : 'Logged Out'}</div>
            <button
                onClick={() => login('admin@portfolio.dev', 'password123')}
                data-testid="login-btn"
            >
                Login
            </button>
            <button onClick={() => logout()} data-testid="logout-btn">
                Logout
            </button>
        </div>
    );
};

describe('AuthContext Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.sessionStorage.clear();
    });

    it('initializes with active session when getMe succeeds', async () => {
        window.sessionStorage.setItem('admin_token', 'initial_token');
        authApi.getMe.mockResolvedValueOnce({
            data: {
                success: true,
                user: { name: 'Admin Abhijeet', email: 'admin@portfolio.dev' },
            },
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByText('Loading Auth...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in: Admin Abhijeet');
        });
    });

    it('clears sessionStorage and sets user to null when getMe fails', async () => {
        window.sessionStorage.setItem('admin_token', 'expired_token');
        authApi.getMe.mockRejectedValueOnce(new Error('Session expired'));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user-status')).toHaveTextContent('Logged Out');
            expect(window.sessionStorage.getItem('admin_token')).toBeNull();
        });
    });

    it('logs in user and stores token into sessionStorage upon successful login', async () => {
        authApi.getMe.mockRejectedValueOnce(new Error('No session'));
        authApi.login.mockResolvedValueOnce({
            data: {
                success: true,
                token: 'jwt_secret_token_123',
                user: { name: 'Admin Abhijeet', email: 'admin@portfolio.dev' },
            },
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user-status')).toHaveTextContent('Logged Out');
        });

        fireEvent.click(screen.getByTestId('login-btn'));

        await waitFor(() => {
            expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in: Admin Abhijeet');
            expect(window.sessionStorage.getItem('admin_token')).toBe('jwt_secret_token_123');
        });
    });

    it('logs out user and removes token from sessionStorage', async () => {
        window.sessionStorage.setItem('admin_token', 'valid_token');
        authApi.getMe.mockResolvedValueOnce({
            data: {
                success: true,
                user: { name: 'Admin Abhijeet', email: 'admin@portfolio.dev' },
            },
        });
        authApi.logout.mockResolvedValueOnce({ data: { success: true } });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in: Admin Abhijeet');
        });

        fireEvent.click(screen.getByTestId('logout-btn'));

        await waitFor(() => {
            expect(screen.getByTestId('user-status')).toHaveTextContent('Logged Out');
            expect(window.sessionStorage.getItem('admin_token')).toBeNull();
        });
    });
});
