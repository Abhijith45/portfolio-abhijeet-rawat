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
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import { projectsApi, apiCache } from '../../services/api';

import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';

const initialFormState = {
    title: '',
    description: '',
    techStack: '',
    githubURL: '',
    liveURL: '',
    imageURL: '',
    imageUploaded: false,
    uploadedImagePreview: '',
    engineeringOverview: '',
    isFeatured: true,
};

const ITEMS_PER_PAGE = 12;

const isValidHttpUrl = (string) => {
    if (!string) return true;
    try {
        const url = new URL(string.trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [verifyingUrls, setVerifyingUrls] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [urlVerificationStatus, setUrlVerificationStatus] = useState(null);

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

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await projectsApi.getAll();
            if (res.data?.success) {
                setProjects(res.data.data);
            }
        } catch (err) {
            setGeneralError('Failed to load projects: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleOpenDialog = (project = null) => {
        setStep(1);
        setFormErrors({});
        setGeneralError('');
        setUrlVerificationStatus(null);

        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title || '',
                description: project.description || '',
                techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack || '',
                githubURL: project.githubURL || project.github || '',
                liveURL: project.liveURL || project.demo || '',
                imageURL: project.imageURL || project.image || '',
                imageUploaded: Boolean(project.imageURL || project.image),
                uploadedImagePreview: project.imageURL || project.image || '',
                engineeringOverview: project.engineeringOverview || project.overview || '',
                isFeatured: project.isFeatured !== undefined ? project.isFeatured : project.featured !== false,
            });
        } else {
            setEditingProject(null);
            setFormData(initialFormState);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProject(null);
        setFormData(initialFormState);
        setFormErrors({});
        setGeneralError('');
        setUrlVerificationStatus(null);
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateStep1 = () => {
        const errors = {};
        if (!formData.title.trim()) {
            errors.title = 'Project title is required';
        }
        if (!formData.description.trim()) {
            errors.description = 'Project description is required';
        }
        if (!formData.techStack.trim()) {
            errors.techStack = 'Please provide at least one technology (comma-separated)';
        }
        if (formData.githubURL && !isValidHttpUrl(formData.githubURL)) {
            errors.githubURL = 'Must be a valid HTTP or HTTPS URL';
        }
        if (formData.liveURL && !isValidHttpUrl(formData.liveURL)) {
            errors.liveURL = 'Must be a valid HTTP or HTTPS URL';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNextStep = async () => {
        if (!validateStep1()) return;

        const urlsToVerify = [];
        if (formData.githubURL && formData.githubURL.trim()) {
            urlsToVerify.push({ type: 'githubURL', label: 'GitHub URL', url: formData.githubURL.trim() });
        }
        if (formData.liveURL && formData.liveURL.trim()) {
            urlsToVerify.push({ type: 'liveURL', label: 'Live Demo URL', url: formData.liveURL.trim() });
        }

        if (urlsToVerify.length > 0) {
            try {
                setVerifyingUrls(true);
                setGeneralError('');
                setUrlVerificationStatus('Verifying URL accessibility...');

                for (const item of urlsToVerify) {
                    const res = await projectsApi.verifyUrl(item.url);
                    if (!res.data?.accessible) {
                        setFormErrors((prev) => ({
                            ...prev,
                            [item.type]: `${item.label} is not accessible: ${res.data?.message || 'Server unreachable'}`,
                        }));
                        setVerifyingUrls(false);
                        setUrlVerificationStatus(null);
                        return;
                    }
                }
            } catch (err) {
                console.warn('URL verification warning:', err.message);
            } finally {
                setVerifyingUrls(false);
                setUrlVerificationStatus(null);
            }
        }

        setStep(2);
    };

    const handlePrevStep = () => {
        setStep(1);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setUploadingImage(true);
            setGeneralError('');
            const res = await projectsApi.uploadImage(uploadData);
            if (res.data?.url) {
                setFormData((prev) => ({
                    ...prev,
                    imageURL: res.data.url,
                    imageUploaded: true,
                    uploadedImagePreview: res.data.url,
                }));
            }
        } catch (err) {
            setGeneralError('Image upload failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveUploadedImage = () => {
        setFormData((prev) => ({
            ...prev,
            imageURL: '',
            imageUploaded: false,
            uploadedImagePreview: '',
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        setGeneralError('');

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                techStack: formData.techStack
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                githubURL: formData.githubURL.trim(),
                liveURL: formData.liveURL.trim(),
                imageURL: formData.imageURL.trim(),
                engineeringOverview: formData.engineeringOverview.trim(),
                isFeatured: Boolean(formData.isFeatured),
            };

            if (editingProject) {
                await projectsApi.update(editingProject._id, payload);
            } else {
                await projectsApi.create(payload);
            }

            apiCache.clear('project');
            handleCloseDialog();
            fetchProjects();
        } catch (err) {
            setGeneralError(err.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    // Single Delete Dialog Triggers
    const handleOpenSingleDelete = (id, title) => {
        setDeleteDialog({
            open: true,
            id,
            title,
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
            title: `${selectedIds.length} Selected Projects`,
            isBatch: true,
            loading: false,
        });
    };

    const handleConfirmDelete = async () => {
        setDeleteDialog((prev) => ({ ...prev, loading: true }));
        try {
            if (deleteDialog.isBatch) {
                await Promise.all(selectedIds.map((id) => projectsApi.delete(id)));
                setSelectedIds([]);
            } else if (deleteDialog.id) {
                await projectsApi.delete(deleteDialog.id);
                setSelectedIds((prev) => prev.filter((item) => item !== deleteDialog.id));
            }
            apiCache.clear('project');
            setDeleteDialog({ open: false, id: null, title: '', isBatch: false, loading: false });
            fetchProjects();
        } catch (err) {
            alert('Failed to delete: ' + err.message);
            setDeleteDialog((prev) => ({ ...prev, loading: false }));
        }
    };

    // Multi-select handlers
    const toggleSelect = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE) || 1;
    const paginatedProjects = projects.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const isAllPageSelected = paginatedProjects.length > 0 && paginatedProjects.every((p) => selectedIds.includes(p._id));

    const handleSelectAllPage = () => {
        if (isAllPageSelected) {
            const pageIds = new Set(paginatedProjects.map((p) => p._id));
            setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
        } else {
            const pageIds = paginatedProjects.map((p) => p._id);
            setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
        }
    };

    const isUrlProvided = Boolean(formData.imageURL && formData.imageURL.trim().length > 0 && !formData.imageUploaded);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
                        Manage Projects ({projects.length} TOTAL)
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: '#00FF41',
                        color: '#000',
                        fontWeight: 700,
                        '&:hover': { background: '#39FF14' },
                    }}
                >
                    Add Project
                </Button>
            </Box>

            {generalError && !openDialog && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {generalError}
                </Alert>
            )}

            {/* Batch Action Toolbar */}
            {selectedIds.length > 0 && (
                <Paper
                    sx={{
                        mb: 3,
                        p: 1,
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
                            {selectedIds.length} OF {projects.length} PROJECTS SELECTED
                        </Typography>
                        <Button
                            disableRipple
                            size="small"
                            onClick={handleSelectAllPage}
                            sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.2)' }}
                            variant="outlined"
                        >
                            {isAllPageSelected ? 'Deselect Current Page' : 'Select Current Page'}
                        </Button>
                        <Button disableRipple size="small" onClick={() => setSelectedIds([])} sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                            Clear Selection
                        </Button>
                    </Box>
                    <Button
                        variant="contained"
                        disableRipple
                        startIcon={<DeleteIcon />}
                        onClick={handleOpenBatchDelete}
                        sx={{
                            background: '#ff4d4f',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            '&:hover': { background: '#ff4d4f' },
                        }}
                    >
                        Delete Selected ({selectedIds.length})
                    </Button>
                </Paper>
            )}

            {/* Projects List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#00FF41' }} />
                </Box>
            ) : projects.length === 0 ? (
                <Paper sx={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', p: 4, textAlign: 'center', borderRadius: '8px' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No projects found. Click "Add Project" to create one.</Typography>
                </Paper>
            ) : (
                <>
                    {/* 3-Column Responsive Grid */}
                    <Grid container spacing={2.5}>
                        {paginatedProjects.map((proj) => {
                            const cardImage = proj.imageURL || proj.image;
                            const cardGithub = proj.githubURL || proj.github;
                            const cardLive = proj.liveURL || proj.demo;
                            const cardFeatured = proj.isFeatured !== undefined ? proj.isFeatured : proj.featured;
                            const isSelected = selectedIds.includes(proj._id);

                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={proj._id}>
                                    <Card
                                        sx={{
                                            background: '#0a0a0a',
                                            border: isSelected ? '1px solid #00FF41' : '1px solid rgba(255,255,255,0.08)',
                                            boxShadow: isSelected ? '0 0 15px rgba(0, 255, 65, 0.2)' : 'none',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {/* Card Selection Checkbox */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                left: 8,
                                                zIndex: 2,
                                                background: 'rgba(0,0,0,0.65)',
                                                backdropFilter: 'blur(4px)',
                                                borderRadius: '6px',
                                                p: '2px',
                                            }}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => toggleSelect(proj._id)}
                                                size="small"
                                                sx={{
                                                    p: 0.5,
                                                    color: 'rgba(255,255,255,0.6)',
                                                    '&.Mui-checked': { color: '#00FF41' },
                                                }}
                                            />
                                        </Box>

                                        {cardImage && (
                                            <Box
                                                component="img"
                                                src={cardImage}
                                                alt={proj.title}
                                                sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                                            />
                                        )}
                                        <CardContent sx={{ p: 1.5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                                                            {proj.title}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5}}>
                                                            {cardFeatured && (
                                                                <Chip
                                                                    icon={<StarIcon sx={{ '&&': { color: '#000', fontSize: 14 } }} />}
                                                                    label=""
                                                                    size="small"
                                                                    sx={{
                                                                        background: '#00FF41',
                                                                        color: '#000',
                                                                        fontWeight: 800,
                                                                        fontFamily: 'Fira Code, monospace',
                                                                        fontSize: '0.62rem',
                                                                        height: 20,
                                                                    }}
                                                                />
                                                            )}
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenDialog(proj)}
                                                                sx={{ color: '#00FF41'}}
                                                                aria-label="Edit project"
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenSingleDelete(proj._id, proj.title)}
                                                                sx={{ color: '#ff6b6b' }}
                                                                aria-label="Delete project"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: 'rgba(255,255,255,0.6)', my: 1.2, fontSize: '0.85rem', lineHeight: 1.6 }}
                                                >
                                                    {proj.description}
                                                </Typography>

                                                <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mb: 2 }}>
                                                    {(proj.techStack || []).map((tech) => (
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
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center',justifyContent:'space-around', pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                {cardGithub && (
                                                    <Button
                                                        variant='text'
                                                        size="small"
                                                        href={cardGithub}
                                                        target="_blank"
                                                        startIcon={<GitHubIcon />}
                                                        sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}
                                                    >
                                                        Repository
                                                    </Button>
                                                )}
                                                {cardLive && (
                                                    <Button
                                                        variant='text'
                                                        size="small"
                                                        href={cardLive}
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
                            );
                        })}
                    </Grid>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, flexWrap: 'wrap', gap: 2 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontFamily: 'Fira Code, monospace' }}>
                                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, projects.length)} of {projects.length} projects
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

            {/* Reusable Confirmation Delete Modal */}
            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, id: null, title: '', isBatch: false, loading: false })}
                onConfirm={handleConfirmDelete}
                title={deleteDialog.isBatch ? 'Delete Selected Projects?' : 'Delete Project?'}
                itemName={!deleteDialog.isBatch ? deleteDialog.title : undefined}
                itemCount={deleteDialog.isBatch ? selectedIds.length : undefined}
                loading={deleteDialog.loading}
            />

            {/* 2-Part Multi-Step Add / Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: '#07090e',
                        border: '1px solid rgba(0,255,65,0.25)',
                        color: '#fff',
                        borderRadius: '10px',
                    },
                }}
            >
                <DialogTitle sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{editingProject ? 'Edit Project' : 'Add New Project'}</span>
                        <Typography
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.75rem',
                                color: '#00FF41',
                                letterSpacing: '0.1em',
                            }}
                        >
                            PART {step} OF 2
                        </Typography>
                    </Box>
                </DialogTitle>

                {/* Cyber Wizard Step Indicator Bar */}
                <Box sx={{ px: 3, pb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                        <Box
                            sx={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                background: step >= 1 ? '#00FF41' : 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease',
                            }}
                        />
                        <Box
                            sx={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                background: step >= 2 ? '#00FF41' : 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    </Box>
                    <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                        {step === 1 ? 'Step 1: Core Details & URLs' : 'Step 2: Media, Overview & Visibility'}
                    </Typography>
                </Box>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    {generalError && (
                        <Alert severity="error" sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.78rem' }}>
                            {generalError}
                        </Alert>
                    )}

                    {urlVerificationStatus && (
                        <Alert severity="success" sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.78rem' }}>
                            {urlVerificationStatus}
                        </Alert>
                    )}

                    {/* STEP 1: Title, Description, GitHub URL, Live URL, TechStack */}
                    {step === 1 && (
                        <>
                            <TextField
                                label="Project Title *"
                                placeholder="e.g. Vertex LMS"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData({ ...formData, title: e.target.value });
                                    if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                                }}
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                                fullWidth
                                size="small"
                            />

                            <TextField
                                label="Description *"
                                placeholder="Brief summary of the project problem and solution..."
                                value={formData.description}
                                onChange={(e) => {
                                    setFormData({ ...formData, description: e.target.value });
                                    if (formErrors.description) setFormErrors({ ...formErrors, description: null });
                                }}
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                            />

                            <TextField
                                label="Tech Stack (comma separated) *"
                                placeholder="React, Node.js, Express, PostgreSQL"
                                value={formData.techStack}
                                onChange={(e) => {
                                    setFormData({ ...formData, techStack: e.target.value });
                                    if (formErrors.techStack) setFormErrors({ ...formErrors, techStack: null });
                                }}
                                error={!!formErrors.techStack}
                                helperText={formErrors.techStack || 'Enter technologies separated by commas'}
                                fullWidth
                                size="small"
                            />

                            <TextField
                                label="GitHub Repository URL"
                                placeholder="https://github.com/user/project-repo"
                                value={formData.githubURL}
                                onChange={(e) => {
                                    setFormData({ ...formData, githubURL: e.target.value });
                                    if (formErrors.githubURL) setFormErrors({ ...formErrors, githubURL: null });
                                }}
                                error={!!formErrors.githubURL}
                                helperText={formErrors.githubURL || 'Will be validated for reachability'}
                                fullWidth
                                size="small"
                            />

                            <TextField
                                label="Live Demo URL"
                                placeholder="https://project-demo.example.com"
                                value={formData.liveURL}
                                onChange={(e) => {
                                    setFormData({ ...formData, liveURL: e.target.value });
                                    if (formErrors.liveURL) setFormErrors({ ...formErrors, liveURL: null });
                                }}
                                error={!!formErrors.liveURL}
                                helperText={formErrors.liveURL || 'Will be validated for reachability'}
                                fullWidth
                                size="small"
                            />
                        </>
                    )}

                    {/* STEP 2: Image (URL or Upload), Engineering Overview, Featured Switch */}
                    {step === 2 && (
                        <>
                            {/* Image Selection Section */}
                            <Box sx={{ border: '1px solid rgba(0,255,65,0.18)', p: 2, borderRadius: '6px', background: 'rgba(0,0,0,0.3)' }}>
                                <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.75rem', color: '#00FF41', mb: 1.5 }}>
                                    // PROJECT COVER IMAGE
                                </Typography>

                                {formData.imageUploaded ? (
                                    /* Uploaded image preview state - URL input is hidden */
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ position: 'relative', width: '100%', height: 140, borderRadius: '4px', overflow: 'hidden', border: '1px solid #00FF41' }}>
                                            <Box
                                                component="img"
                                                src={formData.uploadedImagePreview}
                                                alt="Uploaded project preview"
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <Chip
                                                icon={<CheckCircleIcon sx={{ '&&': { color: '#000', fontSize: 14 } }} />}
                                                label="IMAGE UPLOADED"
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    left: 8,
                                                    background: '#00FF41',
                                                    color: '#000',
                                                    fontWeight: 800,
                                                    fontSize: '0.65rem',
                                                }}
                                            />
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<CloseIcon />}
                                            onClick={handleRemoveUploadedImage}
                                            sx={{ color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.4)', alignSelf: 'flex-start' }}
                                        >
                                            Remove / Change Image
                                        </Button>
                                    </Box>
                                ) : (
                                    /* URL Input + Upload button */
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                            <TextField
                                                label="Cover Image URL"
                                                placeholder="https://images.unsplash.com/..."
                                                value={formData.imageURL}
                                                onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                                                fullWidth
                                                size="small"
                                                helperText={isUrlProvided ? 'Direct image URL specified (File upload disabled)' : 'Enter image URL or choose file below'}
                                            />

                                            <Tooltip
                                                title={isUrlProvided ? 'Upload disabled because Image URL is provided' : 'Upload image file directly'}
                                                arrow
                                            >
                                                <span>
                                                    <Button
                                                        component={isUrlProvided ? 'button' : 'label'}
                                                        variant="outlined"
                                                        disabled={isUrlProvided || uploadingImage}
                                                        startIcon={uploadingImage ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            borderColor: isUrlProvided ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,65,0.4)',
                                                            color: isUrlProvided ? 'rgba(255,255,255,0.3)' : '#00FF41',
                                                            '&:hover': {
                                                                borderColor: isUrlProvided ? 'rgba(255,255,255,0.1)' : '#00FF41',
                                                                background: isUrlProvided ? 'transparent' : 'rgba(0,255,65,0.08)',
                                                            },
                                                        }}
                                                    >
                                                        {uploadingImage ? 'Uploading...' : 'Upload'}
                                                        {!isUrlProvided && (
                                                            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                                        )}
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                )}
                            </Box>

                            {/* Engineering Overview */}
                            <TextField
                                label="Engineering Overview"
                                placeholder="Architectural considerations, performance optimization, concurrency or system design highlights..."
                                value={formData.engineeringOverview}
                                onChange={(e) => setFormData({ ...formData, engineeringOverview: e.target.value })}
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                helperText="Displayed in the detailed inspection modal"
                            />

                            {/* Featured Switch */}
                            <Box sx={{ p: 1.5, background: 'rgba(0,255,65,0.03)', border: '1px solid rgba(0,255,65,0.15)', borderRadius: '6px' }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                            sx={{
                                                '& .Mui-checked': { color: '#00FF41' },
                                                '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#00FF41' },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>
                                                Feature on Home Page
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                                                When enabled, this project is highlighted on the public homepage selected works.
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
                    {step === 1 ? (
                        <>
                            <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNextStep}
                                disabled={verifyingUrls}
                                endIcon={verifyingUrls ? <CircularProgress size={16} sx={{ color: '#000' }} /> : <ArrowForwardIcon />}
                                sx={{
                                    background: '#00FF41',
                                    color: '#000',
                                    fontWeight: 700,
                                    '&:hover': { background: '#39FF14' },
                                }}
                            >
                                {verifyingUrls ? 'Verifying URLs...' : 'Next: Media & Overview'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setStep(1)}
                                sx={{ color: '#00FF41' }}
                            >
                                Back to Step 1
                            </Button>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    sx={{
                                        background: '#00FF41',
                                        color: '#000',
                                        fontWeight: 700,
                                        '&:hover': { background: '#39FF14' },
                                    }}
                                >
                                    {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                                </Button>
                            </Box>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageProjects;
