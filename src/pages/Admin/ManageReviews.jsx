import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    Chip,
    Rating,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import { reviewsApi } from '../../services/api';

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await reviewsApi.getAll();
            if (res.data?.success) {
                setReviews(res.data.data);
                setPendingCount(res.data.pendingCount || 0);
            }
        } catch (err) {
            setError('Failed to load reviews: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleToggleApprove = async (id, currentApproved) => {
        try {
            await reviewsApi.update(id, { approved: !currentApproved });
            fetchReviews();
        } catch (err) {
            alert('Failed to update review: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await reviewsApi.delete(id);
            fetchReviews();
        } catch (err) {
            alert('Failed to delete review: ' + err.message);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                    Manage Reviews
                </Typography>
                <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', color: '#00FF41' }}>
                    // MODERATE CLIENT TESTIMONIALS ({pendingCount} PENDING APPROVAL)
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#00FF41' }} />
                </Box>
            ) : reviews.length === 0 ? (
                <Card sx={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', p: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No reviews submitted yet.</Typography>
                </Card>
            ) : (
                <Grid container spacing={2.5}>
                    {reviews.map((r) => (
                        <Grid size={{xs:12,md:6}} key={r._id}>
                            <Card
                                sx={{
                                    background: '#0a0a0a',
                                    border: `1px solid ${r.approved ? 'rgba(0,255,65,0.2)' : 'rgba(255,170,0,0.3)'}`,
                                    borderRadius: '8px',
                                    p: 2.5,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
                                                {r.name}
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>
                                                {r.company}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={r.approved ? 'APPROVED' : 'PENDING'}
                                            size="small"
                                            sx={{
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                                fontFamily: 'Fira Code, monospace',
                                                background: r.approved ? 'rgba(0,255,65,0.1)' : 'rgba(255,170,0,0.1)',
                                                color: r.approved ? '#00FF41' : '#ffaa00',
                                                border: `1px solid ${r.approved ? 'rgba(0,255,65,0.3)' : 'rgba(255,170,0,0.3)'}`,
                                            }}
                                        />
                                    </Box>

                                    <Rating value={r.rating || 5} precision={0.5} readOnly size="small" sx={{ mb: 1.5, color: '#00FF41' }} />

                                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
                                        "{r.message}"
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={r.approved ? <BlockIcon /> : <CheckCircleIcon />}
                                            onClick={() => handleToggleApprove(r._id, r.approved)}
                                            sx={{
                                                borderColor: r.approved ? 'rgba(255,170,0,0.4)' : 'rgba(0,255,65,0.4)',
                                                color: r.approved ? '#ffaa00' : '#00FF41',
                                                fontSize: '0.72rem',
                                            }}
                                        >
                                            {r.approved ? 'Revoke Approval' : 'Approve'}
                                        </Button>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(r._id)}
                                            sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#ff6b6b' } }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ManageReviews;
