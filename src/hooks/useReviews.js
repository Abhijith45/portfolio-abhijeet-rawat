import { useState, useEffect } from 'react';
import { reviewsApi } from '../services/api';

export const useReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewsApi.getAll();
            setReviews(response.data.data || response.data || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            setError(err.message);
            // Use mock data as fallback
            setReviews([
                {
                    _id: '1',
                    name: 'Sarah Jenkins',
                    company: 'CTO, Cloudstream',
                    rating: 5,
                    message: "Abhijeet's ability to tackle complex architectural challenges in our React codebase was impressive. He delivers clean, maintainable code on schedule.",
                    approved: true,
                },
                {
                    _id: '2',
                    name: 'Marcus Thorne',
                    company: 'Product Manager',
                    rating: 5,
                    message: 'Working with him was a breeze. He translated our abstract ideas into a high-performing web application that our users absolutely love.',
                    approved: true,
                },
                {
                    _id: '3',
                    name: 'Leo Zhang',
                    company: 'Founder, TechStake',
                    rating: 5,
                    message: 'A true professional who understands both UI/UX and backend performance. The custom dashboard he built for our analytics is world-class.',
                    approved: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const submitReview = async (data) => {
        const response = await reviewsApi.create(data);
        return response.data;
    };

    return { reviews, loading, error, submitReview, refetch: fetchReviews };
};
