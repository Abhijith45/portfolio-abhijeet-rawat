import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileProvider } from '../ProfileContext';
import SocialButtons from '../../components/SocialButtons';
import FloatingSocials from '../../components/FloatingSocials';
import { userApi } from '../../services/api';

vi.mock('../../services/api', () => ({
    userApi: {
        getProfile: vi.fn(),
        updateProfile: vi.fn(),
    },
    logger: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

describe('ProfileContext and Social Links Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all 4 social icons when all profile URLs are present', async () => {
        userApi.getProfile.mockResolvedValueOnce({
            data: {
                success: true,
                data: {
                    name: 'Abhijeet Rawat',
                    email: 'abhijeet@example.com',
                    mobileNumber: '919876543210',
                    resumeURL: 'https://resume.test',
                    githubURL: 'https://github.com/testuser',
                    linkedInURL: 'https://linkedin.com/in/testuser',
                    leetCodeURL: 'https://leetcode.com/testuser',
                    HackerRankURL: 'https://hackerrank.com/testuser',
                },
            },
        });

        render(
            <ProfileProvider>
                <SocialButtons />
            </ProfileProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/testuser');
            expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', 'https://linkedin.com/in/testuser');
            expect(screen.getByRole('link', { name: /leetcode/i })).toHaveAttribute('href', 'https://leetcode.com/testuser');
            expect(screen.getByRole('link', { name: /hackerrank/i })).toHaveAttribute('href', 'https://hackerrank.com/testuser');
        });
    });

    it('omits social icon if URL is missing or empty', async () => {
        userApi.getProfile.mockResolvedValueOnce({
            data: {
                success: true,
                data: {
                    name: 'Abhijeet Rawat',
                    email: 'abhijeet@example.com',
                    resumeURL: 'https://resume.test',
                    githubURL: 'https://github.com/testuser',
                    linkedInURL: '', // Missing
                    leetCodeURL: '', // Missing
                    HackerRankURL: 'https://hackerrank.com/testuser',
                },
            },
        });

        render(
            <ProfileProvider>
                <SocialButtons />
            </ProfileProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /hackerrank/i })).toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /leetcode/i })).not.toBeInTheDocument();
        });
    });

    it('renders WhatsApp floating link only when mobileNumber is valid', async () => {
        userApi.getProfile.mockResolvedValueOnce({
            data: {
                success: true,
                data: {
                    name: 'Abhijeet Rawat',
                    email: 'abhijeet@example.com',
                    mobileNumber: '919876543210',
                },
            },
        });

        render(
            <ProfileProvider>
                <FloatingSocials />
            </ProfileProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('link', { name: /chat on whatsapp/i })).toHaveAttribute('href', expect.stringContaining('919876543210'));
            expect(screen.getByRole('link', { name: /send email/i })).toHaveAttribute('href', 'mailto:abhijeet@example.com?subject=Portfolio%20Inquiry');
        });
    });

    it('does NOT render WhatsApp floating link when mobileNumber is absent', async () => {
        userApi.getProfile.mockResolvedValueOnce({
            data: {
                success: true,
                data: {
                    name: 'Abhijeet Rawat',
                    email: 'abhijeet@example.com',
                    mobileNumber: '',
                },
            },
        });

        render(
            <ProfileProvider>
                <FloatingSocials />
            </ProfileProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('link', { name: /send email/i })).toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /chat on whatsapp/i })).not.toBeInTheDocument();
        });
    });
});
