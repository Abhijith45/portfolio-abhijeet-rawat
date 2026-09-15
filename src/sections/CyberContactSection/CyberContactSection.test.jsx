import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CyberContactSection from './index';
import ProfileContext from '../../context/ProfileContext';
import { queriesApi } from '../../services/api';

vi.mock('../../services/api', () => ({
    queriesApi: {
        submit: vi.fn(),
    },
}));

describe('CyberContactSection Component', () => {
    const mockProfileContext = {
        profile: {
            email: 'abhijeetrawat.dev@gmail.com',
            mobileNumber: '+919999999999',
            linkedInURL: 'https://linkedin.com',
            githubURL: 'https://github.com',
        },
        loading: false,
    };

    const renderWithContext = () =>
        render(
            <MemoryRouter>
                <ProfileContext.Provider value={mockProfileContext}>
                    <CyberContactSection />
                </ProfileContext.Provider>
            </MemoryRouter>
        );

    it('renders contact form fields correctly', () => {
        renderWithContext();

        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/example@provider.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Tell me about your vision/i)).toBeInTheDocument();
    });

    it('validates input and disables submit when fields are empty', () => {
        renderWithContext();

        const submitBtn = screen.getByRole('button', { name: /Submit/i });
        expect(submitBtn).toBeDisabled();
    });

    it('enables submit button and calls API on valid input', async () => {
        queriesApi.submit.mockResolvedValueOnce({
            data: { success: true, message: 'Message sent' },
        });

        renderWithContext();

        const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
        const emailInput = screen.getByPlaceholderText(/example@provider.com/i);
        const messageInput = screen.getByPlaceholderText(/Tell me about your vision/i);
        const submitBtn = screen.getByRole('button', { name: /Submit/i });

        fireEvent.change(nameInput, { target: { value: 'Jane Recruiter' } });
        fireEvent.change(emailInput, { target: { value: 'jane@techcorp.com' } });
        fireEvent.change(messageInput, { target: { value: 'Hello Abhijeet, we are excited to interview you for a Senior role!' } });

        await waitFor(() => {
            expect(submitBtn).not.toBeDisabled();
        });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(queriesApi.submit).toHaveBeenCalledWith({
                name: 'Jane Recruiter',
                email: 'jane@techcorp.com',
                message: 'Hello Abhijeet, we are excited to interview you for a Senior role!',
                subject: 'Enquiry Mail',
            });
        });
    });
});
