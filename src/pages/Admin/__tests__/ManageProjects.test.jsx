import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ManageProjects from '../ManageProjects';
import * as apiModule from '../../../services/api';

vi.mock('../../../services/api', () => ({
    projectsApi: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        uploadImage: vi.fn(),
        verifyUrl: vi.fn(),
    },
}));

describe('ManageProjects - 2-Part Multi-Step Form & Modern Admin UX', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        apiModule.projectsApi.getAll.mockResolvedValue({
            data: { success: true, data: [] },
        });
    });

    it('opens add project dialog and renders Step 1 fields', async () => {
        render(<ManageProjects />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /add project/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /add project/i }));

        expect(screen.getByText('Add New Project')).toBeInTheDocument();
        expect(screen.getByText(/PART 1 OF 2/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Project Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tech Stack/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/GitHub Repository URL/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Live Demo URL/i)).toBeInTheDocument();
    });

    it('validates Step 1 required fields and prevents advancing', async () => {
        render(<ManageProjects />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /add project/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole('button', { name: /add project/i }));

        // Click next with empty fields
        fireEvent.click(screen.getByRole('button', { name: /next: media & overview/i }));

        expect(screen.getByText(/Project title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Project description is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Please provide at least one technology/i)).toBeInTheDocument();
        expect(screen.getByText(/PART 1 OF 2/i)).toBeInTheDocument();
    });

    it('verifies URLs before proceeding to Step 2 and blocks if URL is unreachable', async () => {
        apiModule.projectsApi.verifyUrl.mockResolvedValueOnce({
            data: { success: false, accessible: false, message: 'Page not found (404)' },
        });

        render(<ManageProjects />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /add project/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole('button', { name: /add project/i }));

        fireEvent.change(screen.getByLabelText(/Project Title/i), { target: { value: 'Neural OS' } });
        fireEvent.change(screen.getByLabelText(/Description \*/i), { target: { value: 'A powerful cyberpunk distributed operating system' } });
        fireEvent.change(screen.getByLabelText(/Tech Stack/i), { target: { value: 'Rust, WebAssembly, React' } });
        fireEvent.change(screen.getByLabelText(/GitHub Repository URL/i), { target: { value: 'https://github.com/invalid/repo' } });

        fireEvent.click(screen.getByRole('button', { name: /next: media & overview/i }));

        await waitFor(() => {
            expect(apiModule.projectsApi.verifyUrl).toHaveBeenCalledWith('https://github.com/invalid/repo');
            expect(screen.getByText(/GitHub URL is not accessible/i)).toBeInTheDocument();
            expect(screen.getByText(/PART 1 OF 2/i)).toBeInTheDocument();
        });
    });

    it('advances to Step 2 when URLs are verified, disables upload if image URL is present, and submits payload', async () => {
        apiModule.projectsApi.verifyUrl.mockResolvedValue({
            data: { success: true, accessible: true, message: 'URL is accessible' },
        });
        apiModule.projectsApi.create.mockResolvedValue({
            data: { success: true, data: {} },
        });

        render(<ManageProjects />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /add project/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole('button', { name: /add project/i }));

        fireEvent.change(screen.getByLabelText(/Project Title/i), { target: { value: 'Quantum Ledger' } });
        fireEvent.change(screen.getByLabelText(/Description \*/i), { target: { value: 'Decentralized cryptographic transaction processor' } });
        fireEvent.change(screen.getByLabelText(/Tech Stack/i), { target: { value: 'Solidity, React, Node.js' } });
        fireEvent.change(screen.getByLabelText(/GitHub Repository URL/i), { target: { value: 'https://github.com/user/quantum-ledger' } });
        fireEvent.change(screen.getByLabelText(/Live Demo URL/i), { target: { value: 'https://quantum-ledger.example.com' } });

        fireEvent.click(screen.getByRole('button', { name: /next: media & overview/i }));

        await waitFor(() => {
            expect(screen.getByText(/PART 2 OF 2/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Engineering Overview/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Cover Image URL/i)).toBeInTheDocument();
        });

        // Enter Image URL
        const imageUrlInput = screen.getByLabelText(/Cover Image URL/i);
        fireEvent.change(imageUrlInput, { target: { value: 'https://images.example.com/cover.png' } });

        // Verify Upload button is disabled when URL is provided
        const uploadBtn = screen.getByRole('button', { name: /upload/i });
        expect(uploadBtn).toBeDisabled();

        // Fill engineering overview and toggle featured
        fireEvent.change(screen.getByLabelText(/Engineering Overview/i), {
            target: { value: 'Byzantine fault tolerance with sub-second finality.' },
        });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /create project/i }));

        await waitFor(() => {
            expect(apiModule.projectsApi.create).toHaveBeenCalledWith({
                title: 'Quantum Ledger',
                description: 'Decentralized cryptographic transaction processor',
                techStack: ['Solidity', 'React', 'Node.js'],
                githubURL: 'https://github.com/user/quantum-ledger',
                liveURL: 'https://quantum-ledger.example.com',
                imageURL: 'https://images.example.com/cover.png',
                engineeringOverview: 'Byzantine fault tolerance with sub-second finality.',
                isFeatured: true,
            });
        });
    });

    it('opens MUI ConfirmDeleteDialog for single item deletion and triggers delete API upon confirm', async () => {
        const mockProject = {
            _id: 'proj-123',
            title: 'Cyberpunk Matrix Engine',
            description: 'Real-time raytracing renderer',
            techStack: ['C++', 'OpenGL'],
            isFeatured: true,
        };

        apiModule.projectsApi.getAll.mockResolvedValue({
            data: { success: true, data: [mockProject] },
        });
        apiModule.projectsApi.delete.mockResolvedValue({
            data: { success: true },
        });

        render(<ManageProjects />);

        await waitFor(() => {
            expect(screen.getByText('Cyberpunk Matrix Engine')).toBeInTheDocument();
        });

        // Find the single delete icon button
        const deleteButtons = screen.getAllByRole('button');
        const trashBtn = deleteButtons.find((btn) => btn.querySelector('[data-testid="DeleteIcon"]'));
        expect(trashBtn).toBeDefined();
        fireEvent.click(trashBtn);

        // Verify ConfirmDeleteDialog is displayed
        await waitFor(() => {
            expect(screen.getByText(/Delete Project/i)).toBeInTheDocument();
            expect(screen.getByText(/Are you sure you want to permanently delete/i)).toBeInTheDocument();
        });

        // Click confirm in modal
        const confirmBtn = screen.getByRole('button', { name: /confirm delete/i });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(apiModule.projectsApi.delete).toHaveBeenCalledWith('proj-123');
        });
    });
});
