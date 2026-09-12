import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';
import { resumeApi } from '../../services/api';

const ManageResume = () => {
    const [currentResume, setCurrentResume] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [title, setTitle] = useState('');
    const [version, setVersion] = useState('');
    const [driveFileId, setDriveFileId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    const fetchResume = async () => {
        try {
            setLoading(true);
            const res = await resumeApi.getActive();
            if (res.data?.success && res.data?.data) {
                const data = res.data.data;
                setCurrentResume(data);
                setDownloadUrl(data.downloadUrl || '');
                setTitle(data.title || '');
                setVersion(data.version || '1.0');
                setDriveFileId(data.driveFileId || '');
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Failed to load resume details: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResume();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatusMsg({ type: '', text: '' });

        try {
            const res = await resumeApi.update({
                title,
                downloadUrl,
                version,
                driveFileId,
            });
            if (res.data?.success) {
                setCurrentResume(res.data.data);
                setStatusMsg({ type: 'success', text: 'Resume settings updated successfully!' });
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: err.message || 'Failed to update resume' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box maxWidth="md">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                    Manage Resume
                </Typography>
                <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', color: '#00FF41' }}>
                    // GOOGLE DRIVE & PUBLIC RESUME LINK CONFIGURATION
                </Typography>
            </Box>

            {statusMsg.text && (
                <Alert severity={statusMsg.type} sx={{ mb: 3 }}>
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
                        {currentResume && (
                            <Box sx={{ mb: 4, p: 2, background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.15)', borderRadius: '6px' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontFamily: 'Fira Code, monospace', mb: 0.5 }}>
                                    CURRENT ACTIVE LINK:
                                </Typography>
                                <Typography sx={{ color: '#00FF41', fontWeight: 600, wordBreak: 'break-all', fontSize: '0.9rem' }}>
                                    {currentResume.downloadUrl}
                                </Typography>
                                <Button
                                    size="small"
                                    component="a"
                                    href={currentResume.downloadUrl}
                                    target="_blank"
                                    startIcon={<OpenInNewIcon />}
                                    sx={{ mt: 1.5, color: '#00FF41', fontSize: '0.75rem' }}
                                >
                                    Test Link (Opens in new tab)
                                </Button>
                            </Box>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                label="Resume Document Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                fullWidth
                                size="small"
                            />

                            <TextField
                                label="Google Drive Share URL or Direct Download Link"
                                value={downloadUrl}
                                onChange={(e) => setDownloadUrl(e.target.value)}
                                required
                                fullWidth
                                size="small"
                                helperText="Ensure Google Drive file permission is set to 'Anyone with the link can view'"
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Drive File ID (optional)"
                                    value={driveFileId}
                                    onChange={(e) => setDriveFileId(e.target.value)}
                                    fullWidth
                                    size="small"
                                />
                                <TextField
                                    label="Version"
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value)}
                                    size="small"
                                    sx={{ width: 140 }}
                                />
                            </Box>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1 }} />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                                sx={{
                                    alignSelf: 'flex-start',
                                    background: '#00FF41',
                                    color: '#000',
                                    fontWeight: 700,
                                    '&:hover': { background: '#39FF14' },
                                }}
                            >
                                {saving ? 'Saving...' : 'Update Active Resume'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ManageResume;
