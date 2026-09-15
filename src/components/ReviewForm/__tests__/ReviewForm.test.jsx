import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ReviewForm from '../index';
import * as useReviewsModule from '../../../hooks/useReviews';

// Mock the useReviews custom hook
vi.mock('../../../hooks/useReviews', () => ({
    useReviews: vi.fn(),
}));

const renderReviewForm = (props = {}) => {
    return render(
        <BrowserRouter>
            <ReviewForm {...props} />
        </BrowserRouter>
    );
};

describe('ReviewForm Component - Production Grade Test Suite', () => {
    let mockSubmitReview;

    beforeEach(() => {
        vi.clearAllMocks();
        mockSubmitReview = vi.fn().mockResolvedValue({ success: true });
        vi.spyOn(useReviewsModule, 'useReviews').mockReturnValue({
            submitReview: mockSubmitReview,
            reviews: [],
            loading: false,
            error: null,
        });
    });

    describe('Rendering and Initial State', () => {
        it('renders all form input fields, labels, and the submit button', () => {
            renderReviewForm();

            expect(screen.getByText(/01\. YOUR NAME/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/e\.g\. Jane Smith/i)).toBeInTheDocument();

            expect(screen.getByText(/02\. YOUR EMAIL/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/e\.g\. jane@company\.com/i)).toBeInTheDocument();

            expect(screen.getByText(/03\. DESIGNATION/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/e\.g\. CEO at TechCorp \/ Engineering Lead/i)).toBeInTheDocument();

            expect(screen.getByText(/04\. RATING/i)).toBeInTheDocument();
            expect(screen.getByRole('slider')).toBeInTheDocument();

            expect(screen.getByText(/05\. YOUR REVIEW/i)).toBeInTheDocument();
            expect(
                screen.getByPlaceholderText(/Share your experience working with me \(minimum 10 characters\)\.\.\./i)
            ).toBeInTheDocument();

            const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
            expect(submitBtn).toBeInTheDocument();
        });

        it('disables submit button initially when fields are blank', () => {
            renderReviewForm();
            const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
            expect(submitBtn).toBeDisabled();
        });

        it('initializes rating slider at 0.0', () => {
            renderReviewForm();
            const slider = screen.getByRole('slider');
            expect(slider).toHaveValue('0');
            expect(screen.getByText('0.0')).toBeInTheDocument();
        });
    });

    describe('Field Validation and Error Messages', () => {
        it('shows validation error when name is shorter than 2 characters', async () => {
            renderReviewForm();

            const nameInput = screen.getByPlaceholderText(/e\.g\. Jane Smith/i);
            fireEvent.change(nameInput, { target: { value: 'A' } });
            fireEvent.blur(nameInput);

            expect(await screen.findByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
        });

        it('shows validation error when name contains invalid characters', async () => {
            renderReviewForm();

            const nameInput = screen.getByPlaceholderText(/e\.g\. Jane Smith/i);
            fireEvent.change(nameInput, { target: { value: 'Jane123@#' } });
            fireEvent.blur(nameInput);

            expect(
                await screen.findByText(/Name can only contain letters, spaces, hyphens, and apostrophes/i)
            ).toBeInTheDocument();
        });

        it('shows validation error for invalid email format', async () => {
            renderReviewForm();

            const emailInput = screen.getByPlaceholderText(/e\.g\. jane@company\.com/i);
            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.blur(emailInput);

            expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
        });

        it('shows validation error when designation is shorter than 2 characters', async () => {
            renderReviewForm();

            const designationInput = screen.getByPlaceholderText(/e\.g\. CEO at TechCorp \/ Engineering Lead/i);
            fireEvent.change(designationInput, { target: { value: 'X' } });
            fireEvent.blur(designationInput);

            expect(await screen.findByText(/Designation must be at least 2 characters/i)).toBeInTheDocument();
        });

        it('shows validation error when review message is shorter than 10 characters', async () => {
            renderReviewForm();

            const messageInput = screen.getByPlaceholderText(
                /Share your experience working with me \(minimum 10 characters\)\.\.\./i
            );
            fireEvent.change(messageInput, { target: { value: 'Short' } });
            fireEvent.blur(messageInput);

            expect(await screen.findByText(/Review must be at least 10 characters/i)).toBeInTheDocument();
        });
    });

    describe('Form Submission Flow', () => {
        it('enables submit button and calls submitReview with sanitized data when all fields are valid', async () => {
            const onSuccessMock = vi.fn();
            renderReviewForm({ onSuccess: onSuccessMock, autoRedirect: false });

            const nameInput = screen.getByPlaceholderText(/e\.g\. Jane Smith/i);
            const emailInput = screen.getByPlaceholderText(/e\.g\. jane@company\.com/i);
            const designationInput = screen.getByPlaceholderText(/e\.g\. CEO at TechCorp \/ Engineering Lead/i);
            const messageInput = screen.getByPlaceholderText(
                /Share your experience working with me \(minimum 10 characters\)\.\.\./i
            );

            fireEvent.change(nameInput, { target: { value: 'Alex Morgan' } });
            fireEvent.change(emailInput, { target: { value: 'alex.morgan@example.com' } });
            fireEvent.change(designationInput, { target: { value: 'Tech Lead at CyberShift' } });
            fireEvent.change(messageInput, { target: { value: 'Outstanding engineering delivery and clean architecture.' } });

            const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
            await waitFor(() => {
                expect(submitBtn).toBeEnabled();
            });

            fireEvent.click(submitBtn);

            await waitFor(() => {
                expect(mockSubmitReview).toHaveBeenCalledTimes(1);
                expect(mockSubmitReview).toHaveBeenCalledWith({
                    name: 'Alex Morgan',
                    email: 'alex.morgan@example.com',
                    designation: 'Tech Lead at CyberShift',
                    rating: 0,
                    message: 'Outstanding engineering delivery and clean architecture.',
                });
            });

            // Confirms onSuccess callback is called
            expect(onSuccessMock).toHaveBeenCalledTimes(1);

            // Displays thank you message upon success
            expect(await screen.findByText(/Thank you for your feedback/i)).toBeInTheDocument();
            expect(
                screen.getByText(/Your feedback has been saved and submitted successfully\./i)
            ).toBeInTheDocument();
        });

        it('displays custom redirectMessage if provided in props', async () => {
            renderReviewForm({ autoRedirect: false, redirectMessage: 'Feedback submitted to admin review queue.' });

            fireEvent.change(screen.getByPlaceholderText(/e\.g\. Jane Smith/i), { target: { value: 'John Doe' } });
            fireEvent.change(screen.getByPlaceholderText(/e\.g\. jane@company\.com/i), { target: { value: 'john@example.com' } });
            fireEvent.change(screen.getByPlaceholderText(/e\.g\. CEO at TechCorp \/ Engineering Lead/i), { target: { value: 'Founder at Startup' } });
            fireEvent.change(
                screen.getByPlaceholderText(/Share your experience working with me \(minimum 10 characters\)\.\.\./i),
                { target: { value: 'Exceptional collaboration and speed!' } }
            );

            const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
            await waitFor(() => expect(submitBtn).toBeEnabled());
            fireEvent.click(submitBtn);

            expect(await screen.findByText('Feedback submitted to admin review queue.')).toBeInTheDocument();
        });

        it('handles submission errors gracefully and shows error alert', async () => {
            mockSubmitReview.mockRejectedValueOnce(new Error('Network error'));
            renderReviewForm();

            fireEvent.change(screen.getByPlaceholderText(/e\.g\. Jane Smith/i), { target: { value: 'Jane Doe' } });
            fireEvent.change(screen.getByPlaceholderText(/e\.g\. jane@company\.com/i), { target: { value: 'jane@example.com' } });
            fireEvent.change(screen.getByPlaceholderText(/e\.g\. CEO at TechCorp \/ Engineering Lead/i), { target: { value: 'Product Manager' } });
            fireEvent.change(
                screen.getByPlaceholderText(/Share your experience working with me \(minimum 10 characters\)\.\.\./i),
                { target: { value: 'Great work on our modern dashboard!' } }
            );

            const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
            await waitFor(() => expect(submitBtn).toBeEnabled());
            fireEvent.click(submitBtn);

            expect(await screen.findByText(/Failed to submit review\. Please try again\./i)).toBeInTheDocument();
        });
    });

    describe('Throttling and Duplicate Submission Prevention', () => {
        it('prevents multiple submissions while submitting is in flight', async () => {
            let resolveSubmission;
            mockSubmitReview.mockReturnValueOnce(
                new Promise((resolve) => {
                    resolveSubmission = resolve;
                })
            );

            renderReviewForm();

            fireEvent.change(screen.getByPlaceholderText(/e\.g\. Jane Smith/i), { target: { value: 'Bob Vance' } });
            fireEvent.change(screen.getByPlaceholderText(/e\.g\. jane@company\.com/i), { target: { value: 'bob@refrigeration.com' } });
            fireEvent.change(screen.getByPlaceholderText(/e\.g\. CEO at TechCorp \/ Engineering Lead/i), { target: { value: 'CEO at Vance Refrigeration' } });
            fireEvent.change(
                screen.getByPlaceholderText(/Share your experience working with me \(minimum 10 characters\)\.\.\./i),
                { target: { value: 'High performance and excellent user experience.' } }
            );

            const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
            await waitFor(() => expect(submitBtn).toBeEnabled());

            // Click submit
            fireEvent.click(submitBtn);

            // Submitting state should be displayed on the button
            await waitFor(() => {
                expect(screen.getByText(/Submitting\.\.\./i)).toBeInTheDocument();
                expect(submitBtn).toBeDisabled();
            });

            // Additional clicks should not trigger another submission
            fireEvent.click(submitBtn);
            expect(mockSubmitReview).toHaveBeenCalledTimes(1);

            // Complete request
            resolveSubmission({ success: true });
            expect(await screen.findByText(/Thank you for your feedback/i)).toBeInTheDocument();
        });
    });
});
