import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ScrollToTop from '../index';

describe('ScrollToTop Component', () => {
    let scrollToSpy;

    beforeEach(() => {
        scrollToSpy = vi.fn();
        window.scrollTo = scrollToSpy;
        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            writable: true,
            configurable: true,
        });
        Object.defineProperty(window, 'scrollY', {
            value: 0,
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('instantly resets window scroll position on route change without hash', () => {
        render(
            <MemoryRouter initialEntries={['/about']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(scrollToSpy).toHaveBeenCalledWith({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    });

    it('scrolls to element when hash is present in location', () => {
        const mockElement = document.createElement('div');
        mockElement.id = 'projects';
        const scrollIntoViewSpy = vi.fn();
        mockElement.scrollIntoView = scrollIntoViewSpy;
        document.body.appendChild(mockElement);

        render(
            <MemoryRouter initialEntries={['/#projects']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(scrollIntoViewSpy).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'start',
        });

        document.body.removeChild(mockElement);
    });

    it('does not display scroll to top button before 100vh scroll threshold', () => {
        Object.defineProperty(window, 'scrollY', {
            value: 400, // Less than 800px (100vh)
            writable: true,
            configurable: true,
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        const button = screen.queryByRole('button', { name: /scroll to top/i });
        expect(button).toBeNull();
    });

    it('displays scroll to top button when scrolled past 100vh threshold', () => {
        Object.defineProperty(window, 'scrollY', {
            value: 900,
            writable: true,
            configurable: true,
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: /scroll to top/i });
        expect(button).toBeInTheDocument();

        // Clear mock from initial route mount
        scrollToSpy.mockClear();

        fireEvent.click(button);

        expect(scrollToSpy).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });

    it('toggles visibility dynamically on scroll events across 100vh threshold', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(screen.queryByRole('button', { name: /scroll to top/i })).toBeNull();

        // Scroll past 100vh
        act(() => {
            Object.defineProperty(window, 'scrollY', {
                value: 900,
                writable: true,
                configurable: true,
            });
            window.dispatchEvent(new Event('scroll'));
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument();
        });
    });
});
