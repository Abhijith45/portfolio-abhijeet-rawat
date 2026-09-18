import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { experiencesApi } from '../../services/api';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';

const ITEMS_PER_PAGE = 12;

const initialForm = {
    company: '',
    role: '',
    period: '',
    location: '',
    responsibilities: '',
    skills: '',
    order: 0,
};

const ManageExperiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [page, setPage] = useState(1);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const res = await experiencesApi.getAll();
            if (res.data?.success && res.data?.data) {
                setExperiences(res.data.data);
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Failed to load experiences: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    // Pagination slice
    const totalPages = Math.ceil(experiences.length / ITEMS_PER_PAGE);
    const paginatedExperiences = experiences.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        const maxOrder = Math.max(0, ...experiences.map((e) => Number(e.order) || 0));
        setFormData({ ...initialForm, order: maxOrder + 1 });
        setOpenDialog(true);
    };

    const handleOpenEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            company: item.company || '',
            role: item.role || '',
            period: item.period || '',
            location: item.location || '',
            responsibilities: Array.isArray(item.responsibilities)
                ? item.responsibilities.join('\n')
                : item.responsibilities || '',
            skills: Array.isArray(item.skills)
                ? item.skills.join(', ')
                : item.skills || '',
            order: item.order !== undefined ? item.order : 1,
        });
        setOpenDialog(true);
    };

    const handleOpenDelete = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setDeleting(true);
        try {
            await experiencesApi.delete(itemToDelete._id);
            setStatusMsg({ type: 'success', text: 'Experience deleted successfully!' });
            setDeleteModalOpen(false);
            setItemToDelete(null);
            fetchExperiences();
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Failed to delete: ' + err.message });
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatusMsg({ type: '', text: '' });

        const payload = {
            ...formData,
            responsibilities: formData.responsibilities
                .split('\n')
                .map((r) => r.trim())
                .filter(Boolean),
            skills: formData.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            order: Number(formData.order) || 0,
        };

        try {
            if (editingId) {
                await experiencesApi.update(editingId, payload);
                setStatusMsg({ type: 'success', text: 'Experience updated successfully!' });
            } else {
                await experiencesApi.create(payload);
                setStatusMsg({ type: 'success', text: 'Experience created successfully!' });
            }
            setOpenDialog(false);
            fetchExperiences();
        } catch (err) {
            setStatusMsg({ type: 'error', text: err.message || 'Operation failed' });
        } finally {
            setSaving(false);
        }
    };

    const conflictingExperience = experiences.find(
        (e) => (!editingId || e._id !== editingId) && Number(e.order) === Number(formData.order)
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                        Manage Work Experiences
                    </Typography>
                    <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', color: '#00FF41' }}>
                        // WORK TIMELINE & CAREER MILESTONES
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    disableRipple
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ background: '#00FF41', color: '#000', fontWeight: 700, '&:hover': { background: '#39FF14' } }}
                >
                    Add Experience
                </Button>
            </Box>

            {statusMsg.text && (
                <Alert severity={statusMsg.type} sx={{ mb: 3 }} onClose={() => setStatusMsg({ type: '', text: '' })}>
                    {statusMsg.text}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#00FF41' }} />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper} sx={{ background: '#0a0a0a', border: '1px solid rgba(0,255,65,0.15)', borderRadius: '10px' }}>
                        <Table>
                            <TableHead sx={{ background: '#111' }}>
                                <TableRow>
                                    <TableCell sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontWeight: 700, width: 60 }}>#</TableCell>
                                    <TableCell sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontWeight: 700 }}>Company</TableCell>
                                    <TableCell sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontWeight: 700 }}>Role</TableCell>
                                    <TableCell sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontWeight: 700 }}>Period</TableCell>
                                    <TableCell sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontWeight: 700 }}>Skills</TableCell>
                                    <TableCell sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontWeight: 700 }} align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {experiences.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ color: 'rgba(255,255,255,0.5)', py: 4 }}>
                                            No experiences recorded yet. Click "Add Experience" to create one.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedExperiences.map((exp) => (
                                        <TableRow key={exp._id || exp.company} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                                            <TableCell sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontWeight: 700 }}>#{exp.order || 1}</TableCell>
                                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{exp.company}</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>{exp.role}</TableCell>
                                            <TableCell sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontSize: '0.78rem' }}>
                                                [ {exp.period} ]
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 300 }}>
                                                    {(exp.skills || []).slice(0, 4).map((s, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={s}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.65rem',
                                                                background: 'rgba(0,255,65,0.06)',
                                                                color: '#00FF41',
                                                                border: '1px solid rgba(0,255,65,0.2)',
                                                            }}
                                                        />
                                                    ))}
                                                    {(exp.skills || []).length > 4 && (
                                                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                                                            +{exp.skills.length - 4} more
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton disableRipple size="small" onClick={() => handleOpenEdit(exp)} sx={{ color: '#00FF41', mr: 1 }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton disableRipple size="small" onClick={() => handleOpenDelete(exp)} sx={{ color: '#ff4444' }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

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

            {/* Add / Edit Dialog */}
            <Dialog open={openDialog} onClose={() => !saving && setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { background: '#0a0a0a', border: '1px solid rgba(0,255,65,0.3)' } }}>
                <DialogTitle sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {editingId ? 'Edit Work Experience' : 'Add New Work Experience'}
                </DialogTitle>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 3 }}>
                        <TextField
                            label="Company Name"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            required
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Role / Title"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                            fullWidth
                            size="small"
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Period (e.g. Feb 2025 – July 2026)"
                                value={formData.period}
                                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                required
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Sort Order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                size="small"
                                sx={{ minWidth: 150 }}
                                helperText={
                                    conflictingExperience
                                        ? `⚠️ #${formData.order} held by "${conflictingExperience.company}". Will shift.`
                                        : formData.order
                                        ? `✓ Available`
                                        : ''
                                }
                                FormHelperTextProps={{
                                    sx: {
                                        color: conflictingExperience ? '#ffb74d' : '#00FF41',
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.68rem',
                                    },
                                }}
                            />
                        </Box>
                        <TextField
                            label="Responsibilities (One per line)"
                            value={formData.responsibilities}
                            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                            multiline
                            rows={5}
                            required
                            fullWidth
                            helperText="Enter each key achievement or responsibility on a new line"
                        />
                        <TextField
                            label="Tech Stack / Skills (Comma-separated)"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            fullWidth
                            size="small"
                            helperText="e.g. JavaScript, React.js, Node.js, Express, MongoDB"
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <Button disableRipple onClick={() => setOpenDialog(false)} sx={{ color: 'rgba(255,255,255,0.6)' }} disabled={saving}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            disableRipple
                            sx={{ background: '#00FF41', color: '#000', fontWeight: 700, '&:hover': { background: '#39FF14' } }}
                        >
                            {saving ? 'Saving...' : editingId ? 'Update Experience' : 'Create Experience'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <ConfirmDeleteDialog
                open={deleteModalOpen}
                title="Delete Work Experience"
                message="Are you sure you want to permanently delete this work experience entry?"
                itemTitle={itemToDelete ? `${itemToDelete.role} at ${itemToDelete.company}` : ''}
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

export default ManageExperiences;
