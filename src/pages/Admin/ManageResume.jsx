import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Divider,
    Grid,
    Chip,
    Stack,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import { userApi } from '../../services/api';
import { useProfile } from '../../context/ProfileContext';

const ManageResume = () => {
    const { refreshProfile } = useProfile();
    const [initialData, setInitialData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        resumeURL: '',
        githubURL: '',
        linkedInURL: '',
        leetCodeURL: '',
        HackerRankURL: '',
    });

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [resumeURL, setResumeURL] = useState('');
    const [githubURL, setGithubURL] = useState('');
    const [linkedInURL, setLinkedInURL] = useState('');
    const [leetCodeURL, setLeetCodeURL] = useState('');
    const [HackerRankURL, setHackerRankURL] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const res = await userApi.getProfile();
            if (res.data?.success && res.data?.data) {
                const data = res.data.data;
                const loaded = {
                    name: data.name || '',
                    email: data.email || '',
                    mobileNumber: data.mobileNumber || '',
                    resumeURL: data.resumeURL || '',
                    githubURL: data.githubURL || '',
                    linkedInURL: data.linkedInURL || '',
                    leetCodeURL: data.leetCodeURL || '',
                    HackerRankURL: data.HackerRankURL || '',
                };
                setInitialData(loaded);
                setName(loaded.name);
                setEmail(loaded.email);
                setMobileNumber(loaded.mobileNumber);
                setResumeURL(loaded.resumeURL);
                setGithubURL(loaded.githubURL);
                setLinkedInURL(loaded.linkedInURL);
                setLeetCodeURL(loaded.leetCodeURL);
                setHackerRankURL(loaded.HackerRankURL);
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Failed to load profile details: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    // Check if form is dirty (unsaved edits)
    const isDirty = useMemo(() => {
        return (
            name !== initialData.name ||
            mobileNumber !== initialData.mobileNumber ||
            resumeURL !== initialData.resumeURL ||
            githubURL !== initialData.githubURL ||
            linkedInURL !== initialData.linkedInURL ||
            leetCodeURL !== initialData.leetCodeURL ||
            HackerRankURL !== initialData.HackerRankURL
        );
    }, [name, mobileNumber, resumeURL, githubURL, linkedInURL, leetCodeURL, HackerRankURL, initialData]);

    // Warn user before leaving browser tab if there are unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isEditing && isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isEditing, isDirty]);

    const handleCancelEdit = () => {
        if (isDirty) {
            const confirmDiscard = window.confirm('You have unsaved changes. Discard and return to view mode?');
            if (!confirmDiscard) return;
        }
        // Revert form values to initial loaded data
        setName(initialData.name);
        setMobileNumber(initialData.mobileNumber);
        setResumeURL(initialData.resumeURL);
        setGithubURL(initialData.githubURL);
        setLinkedInURL(initialData.linkedInURL);
        setLeetCodeURL(initialData.leetCodeURL);
        setHackerRankURL(initialData.HackerRankURL);
        setIsEditing(false);
        setStatusMsg({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatusMsg({ type: '', text: '' });

        try {
            const res = await userApi.updateProfile({
                name,
                mobileNumber,
                resumeURL,
                githubURL,
                linkedInURL,
                leetCodeURL,
                HackerRankURL,
            });
            if (res.data?.success) {
                const updated = {
                    ...initialData,
                    name,
                    mobileNumber,
                    resumeURL,
                    githubURL,
                    linkedInURL,
                    leetCodeURL,
                    HackerRankURL,
                };
                setInitialData(updated);
                setIsEditing(false);
                await refreshProfile();
                setStatusMsg({ type: 'success', text: 'Profile and social links updated successfully!' });
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                        Profile & Social Links Configuration
                    </Typography>
                    <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', color: '#00FF41' }}>
                        // MANAGE RESUME, CONTACT CHANNELS & SOCIAL PROFILES
                    </Typography>
                </Box>

                {!loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {isEditing ? (
                            <Chip
                                label={isDirty ? 'UNSAVED CHANGES' : 'EDITING MODE'}
                                size="small"
                                sx={{
                                    background: isDirty ? 'rgba(255,170,0,0.15)' : 'rgba(0,255,65,0.15)',
                                    color: isDirty ? '#ffaa00' : '#00FF41',
                                    border: `1px solid ${isDirty ? '#ffaa00' : '#00FF41'}`,
                                    fontWeight: 700,
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.72rem',
                                }}
                            />
                        ) : (
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditing(true)}
                                sx={{
                                    background: '#00FF41',
                                    color: '#000',
                                    fontWeight: 700,
                                    '&:hover': { background: '#39FF14' },
                                }}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                )}
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
                <Card sx={{ background: '#0a0a0a', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '10px', p: 3 }}>
                    <CardContent sx={{ p: 0 }}>
                        {/* Account Email Badge (Immutable) */}
                        <Box
                            sx={{
                                mb: 3,
                                p: 2,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 1.5,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <LockIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                                <Box>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontFamily: 'Fira Code, monospace' }}>
                                        REGISTERED ACCOUNT EMAIL (CANNOT BE CHANGED):
                                    </Typography>
                                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                                        {email || 'No email registered'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Chip
                                label="READ ONLY"
                                size="small"
                                sx={{
                                    fontSize: '0.65rem',
                                    fontFamily: 'Fira Code, monospace',
                                    color: 'rgba(255,255,255,0.6)',
                                    background: 'rgba(255,255,255,0.06)',
                                }}
                            />
                        </Box>

                        {resumeURL && (
                            <Box sx={{ mb: 4, p: 2, background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.15)', borderRadius: '6px' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontFamily: 'Fira Code, monospace', mb: 0.5 }}>
                                    CURRENT RESUME LINK:
                                </Typography>
                                <Typography sx={{ color: '#00FF41', fontWeight: 600, wordBreak: 'break-all', fontSize: '0.9rem' }}>
                                    {resumeURL}
                                </Typography>
                                <Button
                                    size="small"
                                    component="a"
                                    href={resumeURL}
                                    target="_blank"
                                    startIcon={<OpenInNewIcon />}
                                    sx={{ mt: 1.5, color: '#00FF41', fontSize: '0.75rem' }}
                                >
                                    Test Resume Link (Opens in new tab)
                                </Button>
                            </Box>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Personal & Contact Details */}
                            <Typography sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontSize: '0.85rem', fontWeight: 700 }}>
                                01 // PERSONAL & CONTACT DETAILS
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing}
                                        required
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Mobile Number / WhatsApp Number (with country code)"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        disabled={!isEditing}
                                        fullWidth
                                        size="small"
                                        placeholder="+919876543210"
                                        helperText="If empty, the WhatsApp floating icon will be automatically hidden from the public site"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Resume Document URL (Google Drive / Docs)"
                                        value={resumeURL}
                                        onChange={(e) => setResumeURL(e.target.value)}
                                        disabled={!isEditing}
                                        fullWidth
                                        size="small"
                                        placeholder="https://docs.google.com/..."
                                        helperText="Direct link to view or download resume"
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

                            {/* Social & Coding Profiles */}
                            <Typography sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontSize: '0.85rem', fontWeight: 700 }}>
                                02 // SOCIAL & CODING PROFILES (Leave blank to hide icon)
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="GitHub Profile URL"
                                        value={githubURL}
                                        onChange={(e) => setGithubURL(e.target.value)}
                                        disabled={!isEditing}
                                        fullWidth
                                        size="small"
                                        placeholder="https://github.com/username"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="LinkedIn Profile URL"
                                        value={linkedInURL}
                                        onChange={(e) => setLinkedInURL(e.target.value)}
                                        disabled={!isEditing}
                                        fullWidth
                                        size="small"
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="LeetCode Profile URL"
                                        value={leetCodeURL}
                                        onChange={(e) => setLeetCodeURL(e.target.value)}
                                        disabled={!isEditing}
                                        fullWidth
                                        size="small"
                                        placeholder="https://leetcode.com/username"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="HackerRank Profile URL"
                                        value={HackerRankURL}
                                        onChange={(e) => setHackerRankURL(e.target.value)}
                                        disabled={!isEditing}
                                        fullWidth
                                        size="small"
                                        placeholder="https://hackerrank.com/username"
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1 }} />

                            {isEditing && (
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={saving || !isDirty}
                                        startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                                        sx={{
                                            background: '#00FF41',
                                            color: '#000',
                                            fontWeight: 700,
                                            '&:hover': { background: '#39FF14' },
                                            '&:disabled': { background: 'rgba(0,255,65,0.3)', color: 'rgba(0,0,0,0.5)' },
                                        }}
                                    >
                                        {saving ? 'Saving...' : 'Save All Changes'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={handleCancelEdit}
                                        disabled={saving}
                                        startIcon={<CloseIcon />}
                                        sx={{
                                            color: 'rgba(255,255,255,0.7)',
                                            borderColor: 'rgba(255,255,255,0.2)',
                                            '&:hover': { borderColor: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)' },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ManageResume;

