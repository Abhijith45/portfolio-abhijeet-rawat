import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    Chip,
    Rating,
    Checkbox,
    Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import DeselectIcon from '@mui/icons-material/Deselect';
import { reviewsApi } from '../../services/api';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';

const ITEMS_PER_PAGE = 12;

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isBatchDelete, setIsBatchDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

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

    // Pagination slice
    const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
    const paginatedReviews = reviews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Selection handlers
    const handleSelectAll = () => {
        if (selectedIds.length === paginatedReviews.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedReviews.map((r) => r._id));
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleToggleApprove = async (id, currentApproved) => {
        try {
            await reviewsApi.update(id, { approved: !currentApproved });
            fetchReviews();
        } catch (err) {
            alert('Failed to update review: ' + err.message);
        }
    };

    // Single Delete Flow
    const handleOpenSingleDelete = (review) => {
        setItemToDelete(review);
        setIsBatchDelete(false);
        setDeleteModalOpen(true);
    };

    // Batch Delete Flow
    const handleOpenBatchDelete = () => {
        setIsBatchDelete(true);
        setItemToDelete(null);
        setDeleteModalOpen(true);
    };

    // Confirm Delete (Single or Batch)
    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            if (isBatchDelete) {
                await Promise.all(selectedIds.map((id) => reviewsApi.delete(id)));
                setSelectedIds([]);
            } else if (itemToDelete) {
                await reviewsApi.delete(itemToDelete._id);
                setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete._id));
            }
            setDeleteModalOpen(false);
            setItemToDelete(null);
            fetchReviews();
        } catch (err) {
            setError('Failed to delete review(s): ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    // Batch Status Update (Approve / Revoke)
    const handleBatchStatusUpdate = async (targetApproved) => {
        try {
            setLoading(true);
            await Promise.all(
                selectedIds.map((id) => reviewsApi.update(id, { approved: targetApproved }))
            );
            setSelectedIds([]);
            fetchReviews();
        } catch (err) {
            setError('Failed to update selected reviews: ' + err.message);
            setLoading(false);
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

            {/* Batch Action Toolbar */}
            {reviews.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2.5,
                        p: 1.5,
                        background: 'rgba(10,10,10,0.8)',
                        border: '1px solid rgba(0,255,65,0.2)',
                        borderRadius: '8px',
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={selectedIds.length === paginatedReviews.length ? <DeselectIcon /> : <SelectAllIcon />}
                            onClick={handleSelectAll}
                            sx={{
                                color: '#00FF41',
                                borderColor: 'rgba(0,255,65,0.4)',
                                fontSize: '0.75rem',
                                '&:hover': { borderColor: '#00FF41', background: 'rgba(0,255,65,0.05)' },
                            }}
                        >
                            {selectedIds.length === paginatedReviews.length && paginatedReviews.length > 0 ? 'Deselect Page' : 'Select Page'}
                        </Button>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                            {selectedIds.length} selected
                        </Typography>
                    </Box>

                    {selectedIds.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleBatchStatusUpdate(true)}
                                sx={{
                                    borderColor: 'rgba(0,255,65,0.4)',
                                    color: '#00FF41',
                                    fontSize: '0.75rem',
                                    '&:hover': { background: 'rgba(0,255,65,0.1)' },
                                }}
                            >
                                Approve ({selectedIds.length})
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<BlockIcon />}
                                onClick={() => handleBatchStatusUpdate(false)}
                                sx={{
                                    borderColor: 'rgba(255,170,0,0.4)',
                                    color: '#ffaa00',
                                    fontSize: '0.75rem',
                                    '&:hover': { background: 'rgba(255,170,0,0.1)' },
                                }}
                            >
                                Revoke ({selectedIds.length})
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleOpenBatchDelete}
                                sx={{
                                    borderColor: 'rgba(255,77,79,0.4)',
                                    color: '#ff4d4f',
                                    fontSize: '0.75rem',
                                    '&:hover': { background: 'rgba(255,77,79,0.1)' },
                                }}
                            >
                                Delete ({selectedIds.length})
                            </Button>
                        </Box>
                    )}
                </Box>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#00FF41' }} />
                </Box>
            ) : reviews.length === 0 ? (
                <Card sx={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', p: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No reviews submitted yet.</Typography>
                </Card>
            ) : (
                <>
                    {/* 3-column grid for Reviews */}
                    <Grid container spacing={2.5}>
                        {paginatedReviews.map((r) => {
                            const isSelected = selectedIds.includes(r._id);
                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r._id}>
                                    <Card
                                        sx={{
                                            background: '#0a0a0a',
                                            border: `1px solid ${isSelected ? '#00FF41' : r.approved ? 'rgba(0,255,65,0.2)' : 'rgba(255,170,0,0.3)'}`,
                                            boxShadow: isSelected ? '0 0 12px rgba(0,255,65,0.2)' : 'none',
                                            borderRadius: '8px',
                                            p: 2.5,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            position: 'relative',
                                            transition: 'border-color 0.2s, box-shadow 0.2s',
                                        }}
                                    >
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => handleToggleSelect(r._id)}
                                                        size="small"
                                                        sx={{
                                                            p: 0,
                                                            mt: 0.2,
                                                            color: 'rgba(255,255,255,0.3)',
                                                            '&.Mui-checked': { color: '#00FF41' },
                                                        }}
                                                    />
                                                    <Box>
                                                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
                                                            {r.name}
                                                        </Typography>
                                                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>
                                                            {r.designation || r.company || 'Client'}
                                                        </Typography>
                                                    </Box>
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
                                                    {r.approved ? 'Revoke' : 'Approve'}
                                                </Button>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenSingleDelete(r)}
                                                    sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#ff4d4f' } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'rgba(255,255,255,0.7)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        fontFamily: 'Fira Code, monospace',
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(0,255,65,0.15)',
                                            color: '#00FF41',
                                            borderColor: '#00FF41',
                                            fontWeight: 700,
                                        },
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,255,65,0.08)',
                                            borderColor: 'rgba(0,255,65,0.4)',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteDialog
                open={deleteModalOpen}
                title={isBatchDelete ? `Delete ${selectedIds.length} Reviews` : 'Delete Review'}
                message={
                    isBatchDelete
                        ? `Are you sure you want to permanently delete these ${selectedIds.length} selected reviews?`
                        : `Are you sure you want to permanently delete the review from "${itemToDelete?.name}"?`
                }
                itemTitle={!isBatchDelete ? itemToDelete?.name : ''}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                loading={deleting}
            />
        </Box>
    );
};

export default ManageReviews;
