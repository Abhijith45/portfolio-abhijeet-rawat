import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AllProjects from '../index';
import * as apiModule from '../../../services/api';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Helper to generate N mock projects
const generateProjects = (count) => {
    return Array.from({ length: count }, (_, index) => ({
        _id: `proj-${index + 1}`,
        title: `Cyber Architecture Engine 0${index + 1}`,
        description: `High performance system implementation ${index + 1} with reactive streaming.`,
        technologies: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
        category: 'Full Stack',
        liveUrl: `https://example.com/project-${index + 1}`,
        githubUrl: `https://github.com/example/project-${index + 1}`,
    }));
};

const renderAllProjects = () => {
    return render(
        <BrowserRouter>
            <AllProjects />
        </BrowserRouter>
    );
};

describe('AllProjects Page - Scroll Pagination Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.scrollTo = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders initial 6 projects from API upon load', async () => {
        const mock12Projects = generateProjects(12);
        vi.spyOn(apiModule.projectsApi, 'getAll').mockResolvedValue({
            data: { success: true, data: mock12Projects },
        });

        renderAllProjects();

        // Loading spinner initially
        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        // After loading, initial 6 project cards are rendered
        await waitFor(() => {
            const projectCards = screen.getAllByTestId('project-card-item');
            expect(projectCards).toHaveLength(6);
        });

        expect(screen.getByText('Cyber Architecture Engine 01')).toBeInTheDocument();
        expect(screen.getByText('Cyber Architecture Engine 06')).toBeInTheDocument();
        expect(screen.queryByText('Cyber Architecture Engine 07')).not.toBeInTheDocument();

        // Sentinel and load more button are available
        expect(screen.getByTestId('scroll-sentinel')).toBeInTheDocument();
        expect(screen.getByTestId('load-more-btn')).toBeInTheDocument();
    });

    it('loads 3 additional projects on each pagination increment (from 6 to 9)', async () => {
        const mock12Projects = generateProjects(12);
        vi.spyOn(apiModule.projectsApi, 'getAll').mockResolvedValue({
            data: { success: true, data: mock12Projects },
        });

        renderAllProjects();

        await waitFor(() => {
            expect(screen.getAllByTestId('project-card-item')).toHaveLength(6);
        });

        // Trigger load more
        const loadMoreBtn = screen.getByTestId('load-more-btn');
        fireEvent.click(loadMoreBtn);

        // Next 3 items appear (total 9)
        await waitFor(() => {
            expect(screen.getAllByTestId('project-card-item')).toHaveLength(9);
        });

        expect(screen.getByText('Cyber Architecture Engine 07')).toBeInTheDocument();
        expect(screen.getByText('Cyber Architecture Engine 09')).toBeInTheDocument();
        expect(screen.queryByText('Cyber Architecture Engine 10')).not.toBeInTheDocument();
    });

    it('displays end of records banner when all projects have been paginated', async () => {
        const mock8Projects = generateProjects(8);
        vi.spyOn(apiModule.projectsApi, 'getAll').mockResolvedValue({
            data: { success: true, data: mock8Projects },
        });

        renderAllProjects();

        await waitFor(() => {
            expect(screen.getAllByTestId('project-card-item')).toHaveLength(6);
        });

        // Click load more to load remaining 2 (batch 6 + 3 capped at 8)
        const loadMoreBtn = screen.getByTestId('load-more-btn');
        fireEvent.click(loadMoreBtn);

        await waitFor(() => {
            expect(screen.getAllByTestId('project-card-item')).toHaveLength(8);
        });

        // Load more button should disappear and end-of-archives banner should appear
        expect(screen.queryByTestId('load-more-btn')).not.toBeInTheDocument();
        expect(screen.getByTestId('all-projects-loaded-banner')).toBeInTheDocument();
        expect(screen.getByText(/ALL ARCHIVES DEPLOYED \[TOTAL: 8 PROJECTS\]/i)).toBeInTheDocument();
    });

    it('gracefully falls back to fallbackProjects when API call rejects', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(apiModule.projectsApi, 'getAll').mockRejectedValue(new Error('Network failure'));

        renderAllProjects();

        await waitFor(() => {
            // Cards are rendered from fallback dataset
            const projectCards = screen.getAllByTestId('project-card-item');
            expect(projectCards.length).toBeGreaterThan(0);
        });

        consoleErrorSpy.mockRestore();
    });

    it('navigates back to home base when HOME button is clicked', async () => {
        vi.spyOn(apiModule.projectsApi, 'getAll').mockResolvedValue({
            data: { success: true, data: generateProjects(6) },
        });

        renderAllProjects();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /HOME/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /HOME/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
