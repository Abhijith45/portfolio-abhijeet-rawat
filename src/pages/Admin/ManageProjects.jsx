import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    CircularProgress,
    Alert,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { projectsApi } from '../../services/api';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        techStack: '',
        github: '',
        demo: '',
        image: '',
        featured: true,
        order: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await projectsApi.getAll();
            if (res.data?.success) {
                setProjects(res.data.data);
            }
        } catch (err) {
            setError('Failed to load projects: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleOpenDialog = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description,
                techStack: project.techStack.join(', '),
                github: project.github || '',
                demo: project.demo || '',
                image: project.image || '',
                featured: project.featured !== undefined ? project.featured : true,
                order: project.order || 0,
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                techStack: '',
                github: '',
                demo: '',
                image: '',
                featured: true,
                order: projects.length + 1,
            });
        }
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProject(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setUploadingImage(true);
            const res = await projectsApi.uploadImage(uploadData);
            if (res.data?.url) {
                setFormData((prev) => ({ ...prev, image: res.data.url }));
            }
        } catch (err) {
            setError('Image upload failed: ' + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const payload = {
                ...formData,
                techStack: formData.techStack
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
            };

            if (editingProject) {
                await projectsApi.update(editingProject._id, payload);
            } else {
                await projectsApi.create(payload);
            }

            handleCloseDialog();
            fetchProjects();
        } catch (err) {
            setError(err.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await projectsApi.delete(id);
            fetchProjects();
        } catch (err) {
            alert('Failed to delete project: ' + err.message);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                        Manage Projects
                    </Typography>
                    <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', color: '#00FF41' }}>
                        // ADD, EDIT & ORDER PORTFOLIO WORKS
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ background: '#00FF41', color: '#000', fontWeight: 700, '&:hover': { background: '#39FF14' } }}
                >
                    Add Project
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#00FF41' }} />
                </Box>
            ) : (
                <Grid container spacing={2.5}>
                    {projects.map((proj) => (
                        <Grid size={{xs:12,md:6}} key={proj._id}>
                            <Card
                                sx={{
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                }}
                            >
                                {proj.image && (
                                    <Box
                                        component="img"
                                        src={proj.image}
                                        alt={proj.title}
                                        sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                                    />
                                )}
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                                            {proj.title}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(proj)}
                                                sx={{ color: '#00FF41', mr: 0.5 }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(proj._id)}
                                                sx={{ color: '#ff6b6b' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'rgba(255,255,255,0.6)', my: 1.5, fontSize: '0.85rem' }}
                                    >
                                        {proj.description}
                                    </Typography>

                                    <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mb: 2 }}>
                                        {proj.techStack.map((tech) => (
                                            <Chip
                                                key={tech}
                                                label={tech}
                                                size="small"
                                                sx={{
                                                    background: 'rgba(0,255,65,0.08)',
                                                    color: '#00FF41',
                                                    fontFamily: 'Fira Code, monospace',
                                                    fontSize: '0.65rem',
                                                }}
                                            />
                                        ))}
                                    </Stack>

                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                        {proj.github && (
                                            <Button
                                                size="small"
                                                href={proj.github}
                                                target="_blank"
                                                startIcon={<GitHubIcon />}
                                                sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}
                                            >
                                                Repository
                                            </Button>
                                        )}
                                        {proj.demo && (
                                            <Button
                                                size="small"
                                                href={proj.demo}
                                                target="_blank"
                                                startIcon={<OpenInNewIcon />}
                                                sx={{ color: '#00FF41', fontSize: '0.75rem' }}
                                            >
                                                Live Demo
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add / Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: '#0a0a0a',
                        border: '1px solid rgba(0,255,65,0.2)',
                        color: '#fff',
                    },
                }}
            >
                <DialogTitle sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            label="Project Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                        />
                        <TextField
                            label="Tech Stack (comma separated)"
                            placeholder="React, Node.js, MongoDB, Docker"
                            value={formData.techStack}
                            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="GitHub Repository URL"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Live Demo URL"
                            value={formData.demo}
                            onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                            fullWidth
                            size="small"
                        />

                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <TextField
                                label="Cover Image URL"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                fullWidth
                                size="small"
                            />
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={uploadingImage ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                                sx={{ whiteSpace: 'nowrap', borderColor: 'rgba(0,255,65,0.3)', color: '#00FF41' }}
                            >
                                Upload
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            <TextField
                                label="Display Order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                size="small"
                                sx={{ width: 120 }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        sx={{
                                            '& .Mui-checked': { color: '#00FF41' },
                                            '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00FF41' },
                                        }}
                                    />
                                }
                                label="Featured on Public Site"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            sx={{ background: '#00FF41', color: '#000', fontWeight: 700 }}
                        >
                            {submitting ? 'Saving...' : editingProject ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
};

export default ManageProjects;
