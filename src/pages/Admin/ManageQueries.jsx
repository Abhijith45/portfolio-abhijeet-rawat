import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    Pagination,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { queriesApi } from '../../services/api';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';

const ITEMS_PER_PAGE = 12;

const ManageQueries = () => {
    const [queries, setQueries] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [error, setError] = useState('');

    // Multi-Selection & Pagination State
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(1);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        id: null,
        title: '',
        isBatch: false,
        loading: false,
    });

    const fetchQueries = useCallback(async (isMountedRef = { current: true }) => {
        try {
            setLoading(true);
            const res = await queriesApi.getAll(filterStatus ? { status: filterStatus } : {});
            if (isMountedRef.current && res.data?.success) {
                setQueries(res.data.data);
                setUnreadCount(res.data.unreadCount);
            }
        } catch (err) {
            if (isMountedRef.current) setError('Failed to load queries: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        const isMountedRef = { current: true };
        setPage(1);
        setSelectedIds([]);
        fetchQueries(isMountedRef);
        return () => {
            isMountedRef.current = false;
        };
    }, [fetchQueries]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await queriesApi.update(id, { status: newStatus });
            fetchQueries();
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        }
    };

    // Batch Mark as Read
    const handleBatchMarkAsRead = async () => {
        if (selectedIds.length === 0) return;
        try {
            await Promise.all(selectedIds.map((id) => queriesApi.update(id, { status: 'read' })));
            setSelectedIds([]);
            fetchQueries();
        } catch (err) {
            alert('Failed to update selected inquiries: ' + err.message);
        }
    };

    // Single Delete Dialog Triggers
    const handleOpenSingleDelete = (id, name) => {
        setDeleteDialog({
            open: true,
            id,
            title: `Inquiry from ${name}`,
            isBatch: false,
            loading: false,
        });
    };

    // Batch Delete Trigger
    const handleOpenBatchDelete = () => {
        if (selectedIds.length === 0) return;
        setDeleteDialog({
            open: true,
            id: null,
            title: `${selectedIds.length} Selected Inquiries`,
            isBatch: true,
            loading: false,
        });
    };

    const handleConfirmDelete = async () => {
        setDeleteDialog((prev) => ({ ...prev, loading: true }));
        try {
            if (deleteDialog.isBatch) {
                await Promise.all(selectedIds.map((id) => queriesApi.delete(id)));
                setSelectedIds([]);
            } else if (deleteDialog.id) {
                await queriesApi.delete(deleteDialog.id);
                setSelectedIds((prev) => prev.filter((item) => item !== deleteDialog.id));
            }
            setDeleteDialog({ open: false, id: null, title: '', isBatch: false, loading: false });
            fetchQueries();
        } catch (err) {
            alert('Failed to delete: ' + err.message);
            setDeleteDialog((prev) => ({ ...prev, loading: false }));
        }
    };

    // Multi-select handlers
    const toggleSelect = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const totalPages = Math.ceil(queries.length / ITEMS_PER_PAGE) || 1;
    const paginatedQueries = queries.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const isAllPageSelected = paginatedQueries.length > 0 && paginatedQueries.every((q) => selectedIdSet.has(q._id));

    const handleSelectAllPage = () => {
        if (isAllPageSelected) {
            const pageIds = new Set(paginatedQueries.map((q) => q._id));
            setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
        } else {
            const pageIds = paginatedQueries.map((q) => q._id);
            setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unread':
                return { bg: 'rgba(255,170,0,0.15)', color: '#ffaa00', border: 'rgba(255,170,0,0.3)' };
            case 'read':
                return { bg: 'rgba(0,150,255,0.15)', color: '#0096ff', border: 'rgba(0,150,255,0.3)' };
            case 'replied':
                return { bg: 'rgba(0,255,65,0.15)', color: '#00FF41', border: 'rgba(0,255,65,0.3)' };
            default:
                return { bg: 'rgba(255,255,255,0.1)', color: '#fff', border: 'rgba(255,255,255,0.2)' };
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                        Contact Inquiries
                    </Typography>
                    <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', color: '#00FF41' }}>
                        {`// CLIENT MESSAGES & OPPORTUNITIES (${unreadCount} UNREAD, ${queries.length} TOTAL)`}
                    </Typography>
                </Box>

                <FormControl size="small" sx={{ width: 170 }}>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Filter Status</InputLabel>
                    <Select
                        value={filterStatus}
                        label="Filter Status"
                        onChange={(e) => setFilterStatus(e.target.value)}
                        sx={{
                            color: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,255,65,0.2)' },
                        }}
                    >
                        <MenuItem value="">All Queries</MenuItem>
                        <MenuItem value="unread">Unread</MenuItem>
                        <MenuItem value="read">Read</MenuItem>
                        <MenuItem value="replied">Replied</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Batch Action Toolbar */}
            {selectedIds.length > 0 && (
                <Paper
                    sx={{
                        mb: 3,
                        p: 2,
                        background: 'rgba(0, 255, 65, 0.05)',
                        border: '1px solid rgba(0, 255, 65, 0.3)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <Typography sx={{ color: '#00FF41', fontWeight: 700, fontFamily: 'Fira Code, monospace', fontSize: '0.85rem' }}>
                            {selectedIds.length} OF {queries.length} INQUIRIES SELECTED
                        </Typography>
                        <Button
                            size="small"
                            onClick={handleSelectAllPage}
                            sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.2)' }}
                            variant="outlined"
                        >
                            {isAllPageSelected ? 'Deselect Current Page' : 'Select Current Page'}
                        </Button>
                        <Button size="small" onClick={() => setSelectedIds([])} sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                            Clear Selection
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            startIcon={<MarkEmailReadIcon />}
                            onClick={handleBatchMarkAsRead}
                            sx={{
                                borderColor: 'rgba(0, 255, 65, 0.4)',
                                color: '#00FF41',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                '&:hover': { borderColor: '#00FF41', background: 'rgba(0, 255, 65, 0.1)' },
                            }}
                        >
                            Mark as Read ({selectedIds.length})
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={handleOpenBatchDelete}
                            sx={{
                                background: '#ff4d4f',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                '&:hover': { background: '#ff7875' },
                            }}
                        >
                            Delete Selected ({selectedIds.length})
                        </Button>
                    </Box>
                </Paper>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#00FF41' }} />
                </Box>
            ) : queries.length === 0 ? (
                <Paper sx={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', p: 4, textAlign: 'center', borderRadius: '8px' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        No messages received yet.
                    </Typography>
                </Paper>
            ) : (
                <>
                    {/* 2-Column Responsive Grid on Desktop */}
                    <Grid container spacing={2.5}>
                        {paginatedQueries.map((q) => {
                            const style = getStatusColor(q.status);
                            const isSelected = selectedIdSet.has(q._id);

                            return (
                                <Grid size={{ xs: 12, md: 6 }} key={q._id}>
                                    <Card
                                        sx={{
                                            background: '#0a0a0a',
                                            border: isSelected
                                                ? '1px solid #00FF41'
                                                : `1px solid ${q.status === 'unread' ? 'rgba(0,255,65,0.3)' : 'rgba(255,255,255,0.07)'}`,
                                            boxShadow: isSelected ? '0 0 15px rgba(0, 255, 65, 0.2)' : 'none',
                                            borderRadius: '8px',
                                            p: 2.5,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => toggleSelect(q._id)}
                                                        size="small"
                                                        sx={{
                                                            p: 0,
                                                            mt: 0.3,
                                                            color: 'rgba(255,255,255,0.5)',
                                                            '&.Mui-checked': { color: '#00FF41' },
                                                        }}
                                                    />
                                                    <Box>
                                                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                                                            {q.name}
                                                        </Typography>
                                                        <Typography sx={{ color: '#00FF41', fontSize: '0.8rem', fontFamily: 'Fira Code, monospace' }}>
                                                            {q.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={q.status.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            background: style.bg,
                                                            color: style.color,
                                                            border: `1px solid ${style.border}`,
                                                            fontWeight: 700,
                                                            fontSize: '0.65rem',
                                                            fontFamily: 'Fira Code, monospace',
                                                        }}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenSingleDelete(q._id, q.name)}
                                                        sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#ff6b6b' } }}
                                                        aria-label="Delete inquiry"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6, my: 2 }}>
                                                "{q.message}"
                                            </Typography>

                                            {Array.isArray(q.notes) && q.notes.length > 0 && (
                                                <Box sx={{ my: 1.5, p: 1.5, borderRadius: '4px', background: 'rgba(255, 255, 255, 0.03)', border: '1px dashed rgba(0, 255, 65, 0.2)' }}>
                                                    <Typography sx={{ color: '#00FF41', fontSize: '0.72rem', fontFamily: 'Fira Code, monospace', mb: 0.5 }}>
                                                        {`// ADMIN_NOTES (${q.notes.length}):`}
                                                    </Typography>
                                                    {q.notes.map((note, nIdx) => (
                                                        <Typography key={nIdx} sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.8rem', pl: 1, borderLeft: '2px solid #00FF41', mb: 0.5 }}>
                                                            {note}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 1 }}>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                                                Received: {new Date(q.createdAt).toLocaleString()}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    href={`mailto:${q.email}?subject=Re:%20Portfolio%20Inquiry`}
                                                    startIcon={<EmailIcon />}
                                                    onClick={() => handleStatusChange(q._id, 'replied')}
                                                    sx={{ borderColor: 'rgba(0,255,65,0.4)', color: '#00FF41', fontSize: '0.75rem' }}
                                                >
                                                    Reply via Email
                                                </Button>

                                                {q.status === 'unread' && (
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleStatusChange(q._id, 'read')}
                                                        sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}
                                                    >
                                                        Mark as Read
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, flexWrap: 'wrap', gap: 2 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontFamily: 'Fira Code, monospace' }}>
                                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, queries.length)} of {queries.length} inquiries
                            </Typography>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(e, val) => {
                                    setPage(val);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'rgba(255,255,255,0.7)',
                                        borderColor: 'rgba(255,255,255,0.15)',
                                        '&.Mui-selected': {
                                            background: 'rgba(0,255,65,0.15)',
                                            color: '#00FF41',
                                            border: '1px solid #00FF41',
                                            fontWeight: 700,
                                        },
                                        '&:hover': {
                                            background: 'rgba(0,255,65,0.08)',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Confirmation Delete Dialog */}
            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, id: null, title: '', isBatch: false, loading: false })}
                onConfirm={handleConfirmDelete}
                title={deleteDialog.isBatch ? 'Delete Selected Inquiries?' : 'Delete Contact Inquiry?'}
                itemName={!deleteDialog.isBatch ? deleteDialog.title : undefined}
                itemCount={deleteDialog.isBatch ? selectedIds.length : undefined}
                loading={deleteDialog.loading}
            />
        </Box>
    );
};

export default ManageQueries;

