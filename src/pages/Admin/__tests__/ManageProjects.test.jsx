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
    apiCache: {
        clear: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
    },
}));

describe('ManageProjects - Admin Project Management UX & CRUD Operations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        apiModule.projectsApi.getAll.mockResolvedValue({
            data: { success: true, data: [] },
        });
    });

    describe('Add Project Flow', () => {
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

        it('advances to Step 2 when URLs are verified and creates project upon submission', async () => {
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

            // Fill engineering overview and submit
            fireEvent.change(screen.getByLabelText(/Engineering Overview/i), {
                target: { value: 'Byzantine fault tolerance with sub-second finality.' },
            });

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
                    isVisible: true,
                    order: 1,
                });
            });
        });
    });

    describe('Edit Project Flow & URL Lookup Optimization', () => {
        const mockExistingProject = {
            _id: 'proj-456',
            title: 'Hyperion AI Gateway',
            description: 'Intelligent multi-model inference router',
            techStack: ['Python', 'FastAPI', 'Redis'],
            githubURL: 'https://github.com/org/hyperion-ai',
            liveURL: 'https://hyperion.dev',
            imageURL: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            engineeringOverview: 'High-throughput token streaming with low latency fallback.',
            isFeatured: true,
        };

        it('skips URL verification lookup on Step 1 if URLs are unchanged during edit', async () => {
            apiModule.projectsApi.getAll.mockResolvedValue({
                data: { success: true, data: [mockExistingProject] },
            });

            render(<ManageProjects />);

            await waitFor(() => {
                expect(screen.getByText('Hyperion AI Gateway')).toBeInTheDocument();
            });

            // Click the card edit button
            const editBtn = screen.getByRole('button', { name: 'Edit project' });
            fireEvent.click(editBtn);

            expect(screen.getByText('Edit Project')).toBeInTheDocument();
            expect(screen.getByText(/PART 1 OF 2/i)).toBeInTheDocument();

            // Click Next without changing URLs
            fireEvent.click(screen.getByRole('button', { name: /next: media & overview/i }));

            // Should advance directly to Step 2 without calling verifyUrl
            await waitFor(() => {
                expect(screen.getByText(/PART 2 OF 2/i)).toBeInTheDocument();
            });
            expect(apiModule.projectsApi.verifyUrl).not.toHaveBeenCalled();
        });

        it('performs URL verification only for changed/modified URLs during edit', async () => {
            apiModule.projectsApi.getAll.mockResolvedValue({
                data: { success: true, data: [mockExistingProject] },
            });
            apiModule.projectsApi.verifyUrl.mockResolvedValue({
                data: { success: true, accessible: true, message: 'URL is accessible' },
            });
            apiModule.projectsApi.update.mockResolvedValue({
                data: { success: true, data: {} },
            });

            render(<ManageProjects />);

            await waitFor(() => {
                expect(screen.getByText('Hyperion AI Gateway')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole('button', { name: 'Edit project' }));

            // Modify only the live URL
            const liveUrlInput = screen.getByLabelText(/Live Demo URL/i);
            fireEvent.change(liveUrlInput, { target: { value: 'https://updated-hyperion.dev' } });

            fireEvent.click(screen.getByRole('button', { name: /next: media & overview/i }));

            await waitFor(() => {
                // Should verify the changed URL only, not the unchanged GitHub URL
                expect(apiModule.projectsApi.verifyUrl).toHaveBeenCalledTimes(1);
                expect(apiModule.projectsApi.verifyUrl).toHaveBeenCalledWith('https://updated-hyperion.dev');
                expect(screen.getByText(/PART 2 OF 2/i)).toBeInTheDocument();
            });

            // Save the updated project
            fireEvent.click(screen.getByRole('button', { name: /update project/i }));

            await waitFor(() => {
                expect(apiModule.projectsApi.update).toHaveBeenCalledWith('proj-456', expect.objectContaining({
                    title: 'Hyperion AI Gateway',
                    liveURL: 'https://updated-hyperion.dev',
                    githubURL: 'https://github.com/org/hyperion-ai',
                }));
            });
        });
    });

    describe('Card Image Container UX & Direct Image Editing', () => {
        it('renders persistent empty space with styled "Add Image" button when project has no image, and opens Step 2 directly', async () => {
            const projectWithoutImage = {
                _id: 'proj-no-img',
                title: 'Headless CMS Core',
                description: 'API-only CMS architecture',
                techStack: ['Node.js', 'PostgreSQL'],
                imageURL: '',
            };

            apiModule.projectsApi.getAll.mockResolvedValue({
                data: { success: true, data: [projectWithoutImage] },
            });

            render(<ManageProjects />);

            await waitFor(() => {
                expect(screen.getByText('Headless CMS Core')).toBeInTheDocument();
            });

            // Verify "Add Image" button is rendered
            const addImageBtn = screen.getByRole('button', { name: /add image/i });
            expect(addImageBtn).toBeInTheDocument();

            // Clicking "Add Image" opens dialog directly at Step 2 (Media, Overview & Visibility)
            fireEvent.click(addImageBtn);

            expect(screen.getByText('Edit Project')).toBeInTheDocument();
            expect(screen.getByText(/PART 2 OF 2/i)).toBeInTheDocument();
            expect(screen.getByText(/Step 2: Media, Overview & Visibility/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Cover Image URL/i)).toBeInTheDocument();
        });

        it('renders top-right pencil icon button on existing image, and opens Step 2 directly', async () => {
            const projectWithImage = {
                _id: 'proj-with-img',
                title: 'Cyberpunk Portal',
                description: 'Futuristic portfolio engine',
                techStack: ['React', 'MUI'],
                imageURL: 'https://images.example.com/matrix.jpg',
            };

            apiModule.projectsApi.getAll.mockResolvedValue({
                data: { success: true, data: [projectWithImage] },
            });

            render(<ManageProjects />);

            await waitFor(() => {
                expect(screen.getByText('Cyberpunk Portal')).toBeInTheDocument();
            });

            // Verify the image is rendered with img tag
            const imgElement = screen.getByRole('img', { name: 'Cyberpunk Portal' });
            expect(imgElement).toBeInTheDocument();
            expect(imgElement).toHaveAttribute('src', 'https://images.example.com/matrix.jpg');

            // Verify the pencil button on top-right of image is present
            const changeImageBtn = screen.getByRole('button', { name: 'Change project image' });
            expect(changeImageBtn).toBeInTheDocument();

            // Clicking the pencil button opens dialog directly at Step 2
            fireEvent.click(changeImageBtn);

            expect(screen.getByText('Edit Project')).toBeInTheDocument();
            expect(screen.getByText(/PART 2 OF 2/i)).toBeInTheDocument();
            expect(screen.getByText(/IMAGE UPLOADED/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /remove \/ change image/i })).toBeInTheDocument();
        });

        it('displays HIDDEN badge on project card when isVisible is false', async () => {
            const hiddenProject = {
                _id: 'proj-hidden',
                title: 'Stealth Protocol',
                description: 'Private unlisted project',
                techStack: ['Rust'],
                isVisible: false,
            };

            apiModule.projectsApi.getAll.mockResolvedValue({
                data: { success: true, data: [hiddenProject] },
            });

            render(<ManageProjects />);

            await waitFor(() => {
                expect(screen.getByText('Stealth Protocol')).toBeInTheDocument();
            });

            expect(screen.getByText('HIDDEN')).toBeInTheDocument();
        });
    });

    describe('Delete Project Functionality', () => {
        it('opens ConfirmDeleteDialog for single item deletion and deletes project upon confirm', async () => {
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

            // Click single project delete button
            const deleteBtn = screen.getByRole('button', { name: 'Delete project' });
            fireEvent.click(deleteBtn);

            // Verify ConfirmDeleteDialog is displayed
            await waitFor(() => {
                expect(screen.getByText(/Delete Project\?/i)).toBeInTheDocument();
                expect(screen.getByText(/Are you sure you want to permanently delete/i)).toBeInTheDocument();
            });

            // Confirm delete
            const confirmBtn = screen.getByRole('button', { name: /confirm delete/i });
            fireEvent.click(confirmBtn);

            await waitFor(() => {
                expect(apiModule.projectsApi.delete).toHaveBeenCalledWith('proj-123');
            });
        });

        it('handles batch selection and bulk deletion of multiple projects', async () => {
            const mockProjects = [
                { _id: 'proj-1', title: 'Alpha App', description: 'Alpha Desc', techStack: ['React'] },
                { _id: 'proj-2', title: 'Beta App', description: 'Beta Desc', techStack: ['Vue'] },
            ];

            apiModule.projectsApi.getAll.mockResolvedValue({
                data: { success: true, data: mockProjects },
            });
            apiModule.projectsApi.delete.mockResolvedValue({
                data: { success: true },
            });

            render(<ManageProjects />);

            await waitFor(() => {
                expect(screen.getByText('Alpha App')).toBeInTheDocument();
                expect(screen.getByText('Beta App')).toBeInTheDocument();
            });

            // Select both checkboxes
            const checkboxes = screen.getAllByRole('checkbox');
            fireEvent.click(checkboxes[0]);
            fireEvent.click(checkboxes[1]);

            // Batch toolbar should appear
            await waitFor(() => {
                expect(screen.getByText(/2 OF 2 PROJECTS SELECTED/i)).toBeInTheDocument();
            });

            // Click batch delete button in toolbar
            const batchDeleteBtn = screen.getByRole('button', { name: /delete selected \(2\)/i });
            fireEvent.click(batchDeleteBtn);

            // Confirm batch delete modal
            await waitFor(() => {
                expect(screen.getByText(/Delete Selected Projects\?/i)).toBeInTheDocument();
            });

            const confirmBtn = screen.getByRole('button', { name: /confirm delete/i });
            fireEvent.click(confirmBtn);

            await waitFor(() => {
                expect(apiModule.projectsApi.delete).toHaveBeenCalledWith('proj-1');
                expect(apiModule.projectsApi.delete).toHaveBeenCalledWith('proj-2');
            });
        });
    });

    describe('Order Management & Collision Detection UX', () => {
        it('auto-fills order with maxOrder + 1 when adding a project, and shows collision warning when duplicate typed', async () => {
            const existingProjects = [
                { _id: 'p1', title: 'First Proj', order: 1, techStack: ['React'] },
                { _id: 'p2', title: 'Second Proj', order: 2, techStack: ['Node'] },
            ];

            apiModule.projectsApi.getAll.mockResolvedValue({
                data: { success: true, data: existingProjects },
            });

            render(<ManageProjects />);

            await waitFor(() => {
                expect(screen.getByText('First Proj')).toBeInTheDocument();
                expect(screen.getByText('#1')).toBeInTheDocument();
                expect(screen.getByText('#2')).toBeInTheDocument();
            });

            // Open Add Project dialog
            fireEvent.click(screen.getByRole('button', { name: /add project/i }));

            // Order field should be pre-filled with maxOrder + 1 = 3
            const orderInput = screen.getByLabelText(/Sort Order/i);
            expect(orderInput).toHaveValue(3);

            // Change order to 1 (conflicts with 'First Proj')
            fireEvent.change(orderInput, { target: { value: '1' } });

            // Warning message should be visible
            expect(screen.getByText(/Order #1 is currently held by "First Proj"/i)).toBeInTheDocument();
        });
    });
});
