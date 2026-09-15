import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProjectsSection from '../index';
import * as apiModule from '../../../services/api';

// Mock the projectsApi
vi.mock('../../../services/api', () => ({
    projectsApi: {
        getAll: vi.fn(),
        getFeatured: vi.fn(),
    },
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderProjectsSection = () => {
    return render(
        <BrowserRouter>
            <ProjectsSection />
        </BrowserRouter>
    );
};

describe('ProjectsSection - Production Grade Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('1. Loading & Initial Rendering', () => {
        it('renders null initially while fetching projects', () => {
            // Keep promise pending
            apiModule.projectsApi.getFeatured.mockReturnValue(new Promise(() => {}));
            const { container } = renderProjectsSection();

            expect(container.firstChild).toBeNull();
            expect(screen.queryByText('// MY WORK //')).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { level: 2, name: /Featured Projects/i })).not.toBeInTheDocument();
        });

        it('renders section title and subtitle correctly after loading with projects', async () => {
            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: {
                    success: true,
                    count: 1,
                    hasMore: false,
                    data: [{ _id: 'p1', title: 'Test Project', description: 'Test Desc', techStack: ['React'] }],
                },
            });
            renderProjectsSection();

            await waitFor(() => {
                expect(screen.getByText('// MY WORK //')).toBeInTheDocument();
            });

            expect(screen.getByRole('heading', { level: 2, name: /Featured Projects/i })).toBeInTheDocument();
        });
    });

    describe('2. Data Fetching & Conditional Visibility (> 0 projects)', () => {
        it('renders dynamic projects returned from API', async () => {
            const mockDbProjects = [
                {
                    _id: 'proj-1',
                    title: 'Quantum Cloud Engine',
                    description: 'A high-throughput distributed microservice telemetry platform.',
                    techStack: ['Go', 'Docker', 'Kubernetes'],
                    github: 'https://github.com/test/quantum',
                    demo: 'https://quantum.demo.com',
                    image: 'https://images.unsplash.com/photo-test-1',
                },
                {
                    _id: 'proj-2',
                    title: 'Neural Core AI',
                    description: 'Autonomous neural network model training pipeline orchestrator.',
                    techStack: ['Python', 'PyTorch', 'FastAPI'],
                    github: 'https://github.com/test/neural',
                    demo: 'https://neural.demo.com',
                    image: 'https://images.unsplash.com/photo-test-2',
                },
            ];

            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: { success: true, count: 2, hasMore: false, data: mockDbProjects },
            });

            renderProjectsSection();

            await waitFor(() => {
                expect(screen.getByText('Quantum Cloud Engine')).toBeInTheDocument();
                expect(screen.getByText('Neural Core AI')).toBeInTheDocument();
            });

            expect(
                screen.getByText(/A high-throughput distributed microservice telemetry platform\./i)
            ).toBeInTheDocument();
            expect(screen.getByText('Kubernetes')).toBeInTheDocument();
            expect(screen.getByText('PyTorch')).toBeInTheDocument();
        });

        it('does NOT render component (renders null) when API returns 0 projects', async () => {
            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: { success: true, count: 0, hasMore: false, data: [] },
            });

            const { container } = renderProjectsSection();

            await waitFor(() => {
                expect(screen.queryByText('// MY WORK //')).not.toBeInTheDocument();
            });

            expect(container.firstChild).toBeNull();
            expect(screen.queryByText('Vertex LMS')).not.toBeInTheDocument();
        });

        it('does NOT render component (renders null) when API call rejects with error', async () => {
            apiModule.projectsApi.getFeatured.mockRejectedValueOnce(new Error('Database offline'));

            const { container } = renderProjectsSection();

            await waitFor(() => {
                expect(screen.queryByText('// MY WORK //')).not.toBeInTheDocument();
            });

            expect(container.firstChild).toBeNull();
            expect(screen.queryByText('Vertex LMS')).not.toBeInTheDocument();
        });
    });

    describe('3. Pagination & Project Limiting', () => {
        it('displays top 6 featured projects returned by the backend', async () => {
            const sixProjects = Array.from({ length: 6 }, (_, i) => ({
                _id: `proj-${i + 1}`,
                title: `Project #${i + 1}`,
                description: `Description for project item #${i + 1} with enough content length.`,
                techStack: ['React', 'Node.js'],
                github: 'https://github.com/test',
                demo: 'https://demo.com',
            }));

            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: { success: true, count: 6, hasMore: true, data: sixProjects },
            });

            renderProjectsSection();

            await waitFor(() => {
                expect(screen.getByText('Project #1')).toBeInTheDocument();
                expect(screen.getByText('Project #6')).toBeInTheDocument();
            });
        });

        it('shows "VIEW ALL" button when hasMore is true from backend', async () => {
            const sixProjects = Array.from({ length: 6 }, (_, i) => ({
                _id: `proj-${i + 1}`,
                title: `Project #${i + 1}`,
                description: `Description for project item #${i + 1}`,
                techStack: ['React'],
            }));

            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: { success: true, count: 6, hasMore: true, data: sixProjects },
            });

            renderProjectsSection();

            const viewAllBtn = await screen.findByRole('button', {
                name: /VIEW ALL/i,
            });
            expect(viewAllBtn).toBeInTheDocument();

            // Clicking navigates to '/all-projects'
            fireEvent.click(viewAllBtn);
            expect(mockNavigate).toHaveBeenCalledWith('/all-projects');
        });

        it('does NOT show "VIEW ALL" button when hasMore is false from backend', async () => {
            const fourProjects = Array.from({ length: 4 }, (_, i) => ({
                _id: `proj-${i + 1}`,
                title: `Project #${i + 1}`,
                description: `Description for project item #${i + 1}`,
                techStack: ['React'],
            }));

            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: { success: true, count: 4, hasMore: false, data: fourProjects },
            });

            renderProjectsSection();

            await waitFor(() => {
                expect(screen.getByText('Project #4')).toBeInTheDocument();
            });

            expect(screen.queryByRole('button', { name: /VIEW ALL/i })).not.toBeInTheDocument();
        });
    });

    describe('4. Interactive Card Features & Project Details Modal', () => {
        it('renders project links (GitHub and Demo) with security rel attributes', async () => {
            const singleProject = [
                {
                    _id: 'p-1',
                    title: 'Secure Link Test App',
                    description: 'Testing link attributes for security and accessibility.',
                    techStack: ['TypeScript', 'Vite'],
                    github: 'https://github.com/abhijeet-rawat/secure-app',
                    demo: 'https://secure-app.demo.io',
                    image: 'https://images.unsplash.com/photo-test',
                },
            ];

            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: { success: true, count: 1, hasMore: false, data: singleProject },
            });

            renderProjectsSection();

            await waitFor(() => {
                expect(screen.getByText('Secure Link Test App')).toBeInTheDocument();
            });

            const ghLink = screen.getByLabelText(/View GitHub Repository/i);
            expect(ghLink).toHaveAttribute('href', 'https://github.com/abhijeet-rawat/secure-app');
            expect(ghLink).toHaveAttribute('target', '_blank');
            expect(ghLink).toHaveAttribute('rel', 'noopener noreferrer');

            const demoLink = screen.getByLabelText(/Open Live Demo/i);
            expect(demoLink).toHaveAttribute('href', 'https://secure-app.demo.io');
            expect(demoLink).toHaveAttribute('target', '_blank');
            expect(demoLink).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('opens ProjectModal on clicking eye icon and displays architectural details', async () => {
            const modalProject = [
                {
                    _id: 'modal-proj-1',
                    title: 'Vertex LMS',
                    description: 'A full-stack learning platform exploring structured course content.',
                    techStack: ['Next.js', 'PostgreSQL', 'OpenAI'],
                    github: 'https://github.com/abhijeet-rawat',
                    demo: 'https://example.com',
                    image: 'https://images.unsplash.com/photo-test-modal',
                    overview: 'A personal engineering project exploring how learning content can be structured.',
                },
            ];

            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: { success: true, count: 1, hasMore: false, data: modalProject },
            });

            renderProjectsSection();

            await waitFor(() => {
                expect(screen.getByText('Vertex LMS')).toBeInTheDocument();
            });

            const inspectBtn = screen.getByLabelText(/Inspect Project Details/i);
            fireEvent.click(inspectBtn);

            // Modal header with Mac window terminal title
            await waitFor(() => {
                expect(screen.getByText(/project_details\.sh/i)).toBeInTheDocument();
            });

            // Overview & architectural insights within modal
            expect(
                screen.getByText(/A personal engineering project exploring how learning content can be structured\./i)
            ).toBeInTheDocument();

            // Close button inside modal closes modal
            const closeBtn = screen.getByLabelText(/Close modal/i);
            fireEvent.click(closeBtn);

            await waitFor(() => {
                expect(screen.queryByText(/project_details\.sh/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('5. Accessibility and Fallback Media', () => {
        it('renders offline cyber feed placeholder when project image is missing', async () => {
            const projectWithoutImage = [
                {
                    _id: 'no-img',
                    title: 'Headless CLI Tool',
                    description: 'A lightweight command line interface built with Node.js.',
                    techStack: ['Node.js'],
                    image: '',
                },
            ];

            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: { success: true, count: 1, hasMore: false, data: projectWithoutImage },
            });

            renderProjectsSection();

            await waitFor(() => {
                expect(screen.getByText('[IMG_NOT_AVAILABLE]')).toBeInTheDocument();
            });
        });

        it('renders project image with proper alt text', async () => {
            const projectWithImage = [
                {
                    _id: 'has-img',
                    title: 'Image Test Platform',
                    description: 'Testing image attributes.',
                    techStack: ['React'],
                    image: 'https://example.com/test-thumb.jpg',
                },
            ];

            apiModule.projectsApi.getFeatured.mockResolvedValueOnce({
                data: { success: true, count: 1, hasMore: false, data: projectWithImage },
            });

            renderProjectsSection();

            const img = await screen.findByRole('img', { name: 'Image Test Platform' });
            expect(img).toHaveAttribute('src', 'https://example.com/test-thumb.jpg');
        });
    });
});
