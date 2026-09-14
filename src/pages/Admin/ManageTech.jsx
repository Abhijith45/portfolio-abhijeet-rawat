import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { technologiesApi } from '../../services/api';
import TechIcon from '../../components/TechIcon';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';

const categories = [
    'Frontend & UI',
    'Backend & Runtime',
    'Database & Cache',
    'DevOps, Cloud & Storage',
    'Version Control & Dev Tools',
];

const ManageTech = () => {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingTech, setEditingTech] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend & UI',
        icon: '',
        proficiency: 'Proficient',
        order: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchTech = async () => {
        try {
            setLoading(true);
            const res = await technologiesApi.getAll();
            if (res.data?.success) {
                setTechnologies(res.data.data);
            }
        } catch (err) {
            setError('Failed to load technologies: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTech();
    }, []);

    const handleOpenDialog = (tech = null) => {
        if (tech) {
            setEditingTech(tech);
            setFormData({
                name: tech.name,
                category: tech.category,
                icon: tech.icon || '',
                proficiency: tech.proficiency || 'Proficient',
                order: tech.order || 0,
            });
        } else {
            setEditingTech(null);
            setFormData({
                name: '',
                category: 'Frontend & UI',
                icon: '',
                proficiency: 'Proficient',
                order: technologies.length + 1,
            });
        }
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingTech(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (editingTech) {
                await technologiesApi.update(editingTech._id, formData);
            } else {
                await technologiesApi.create(formData);
            }
            handleCloseDialog();
            fetchTech();
        } catch (err) {
            setError(err.message || 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenDelete = (tech) => {
        setItemToDelete(tech);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setDeleting(true);
        try {
            await technologiesApi.delete(itemToDelete._id);
            setDeleteModalOpen(false);
            setItemToDelete(null);
            fetchTech();
        } catch (err) {
            setError('Failed to delete technology: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    // Group by category
    const groupedTech = categories.reduce((acc, cat) => {
        acc[cat] = technologies.filter((t) => t.category === cat);
        return acc;
    }, {});

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                        Manage Technologies
                    </Typography>
                    <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', color: '#00FF41' }}>
                        // SKILLS, FRAMEWORKS & TOOLS IN TRADE ({technologies.length} TOTAL)
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ background: '#00FF41', color: '#000', fontWeight: 700, '&:hover': { background: '#39FF14' } }}
                >
                    Add Technology
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#00FF41' }} />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {categories.map((cat) => (
                        <Grid size={{ xs: 12, md: 6 }} key={cat}>
                            <Card
                                sx={{
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '8px',
                                    p: 2.5,
                                    height: '100%',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'Fira Code, monospace',
                                        fontSize: '0.8rem',
                                        color: '#00FF41',
                                        letterSpacing: '0.1em',
                                        mb: 2,
                                        pb: 1,
                                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                >
                                    // {cat.toUpperCase()} ({groupedTech[cat]?.length || 0})
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {groupedTech[cat]?.length === 0 ? (
                                        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                                            No skills added in this category.
                                        </Typography>
                                    ) : (
                                        groupedTech[cat]?.map((tech) => (
                                            <Box
                                                key={tech._id}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    p: 1.2,
                                                    borderRadius: '6px',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <TechIcon name={tech.name} icon={tech.icon} size={20} />
                                                    </Box>
                                                    <Typography sx={{ color: '#fff', fontSize: '0.88rem', fontWeight: 500 }}>
                                                        {tech.name}
                                                    </Typography>
                                                    {tech.icon && (
                                                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontFamily: 'Fira Code, monospace' }}>
                                                            ({tech.icon})
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenDialog(tech)}
                                                        sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#00FF41' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenDelete(tech)}
                                                        sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#ff6b6b' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        ))
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add / Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { background: '#0a0a0a', border: '1px solid rgba(0,255,65,0.2)', color: '#fff' } }}
            >
                <DialogTitle sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {editingTech ? 'Edit Technology' : 'Add New Technology'}
                </DialogTitle>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Technology Name"
                            placeholder="e.g. Nest.js, Next.js, GraphQL"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                            size="small"
                        />
                        <TextField
                            select
                            label="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            fullWidth
                            size="small"
                        >
                            {categories.map((c) => (
                                <MenuItem key={c} value={c}>
                                    {c}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Icon Slug or Image URL (Optional)"
                            placeholder="e.g. nestjs, nextdotjs, or CDN URL"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            fullWidth
                            size="small"
                            helperText="Leave empty to auto-match name via CDN"
                        />
                        <TextField
                            label="Display Order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                            size="small"
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            sx={{ background: '#00FF41', color: '#000', fontWeight: 700 }}
                        >
                            {submitting ? 'Saving...' : editingTech ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <ConfirmDeleteDialog
                open={deleteModalOpen}
                title="Delete Technology"
                message="Are you sure you want to permanently delete this technology skill?"
                itemTitle={itemToDelete?.name || ''}
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

export default ManageTech;
