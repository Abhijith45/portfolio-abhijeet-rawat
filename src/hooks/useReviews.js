import { useState, useEffect } from 'react';
import { reviewsApi } from '../services/api';

export const useReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewsApi.getApproved();
            setReviews(response.data.data || response.data || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            setError(err.message);
            // If API fails or offline, set empty array so optional section isn't falsely populated
            setReviews([]);
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
