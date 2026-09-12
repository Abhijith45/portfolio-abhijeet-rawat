import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import { queriesApi } from '../../services/api';

const ManageQueries = () => {
    const [queries, setQueries] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [error, setError] = useState('');

    const fetchQueries = async () => {
        try {
            setLoading(true);
            const res = await queriesApi.getAll(filterStatus ? { status: filterStatus } : {});
            if (res.data?.success) {
                setQueries(res.data.data);
                setUnreadCount(res.data.unreadCount);
            }
        } catch (err) {
            setError('Failed to load queries: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, [filterStatus]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await queriesApi.update(id, { status: newStatus });
            fetchQueries();
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry?')) return;
        try {
            await queriesApi.delete(id);
            fetchQueries();
        } catch (err) {
            alert('Failed to delete query: ' + err.message);
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                        Contact Inquiries
                    </Typography>
                    <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', color: '#00FF41' }}>
                        // CLIENT MESSAGES & OPPORTUNITIES ({unreadCount} UNREAD)
                    </Typography>
                </Box>

                <FormControl size="small" sx={{ width: 160 }}>
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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#00FF41' }} />
                </Box>
            ) : queries.length === 0 ? (
                <Card sx={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', p: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        No messages received yet.
                    </Typography>
                </Card>
            ) : (
                <Grid container spacing={2.5}>
                    {queries.map((q) => {
                        const style = getStatusColor(q.status);
                        return (
                            <Grid size={{xs:12}} key={q._id}>
                                <Card
                                    sx={{
                                        background: '#0a0a0a',
                                        border: `1px solid ${q.status === 'unread' ? 'rgba(0,255,65,0.3)' : 'rgba(255,255,255,0.07)'}`,
                                        borderRadius: '8px',
                                        p: 2.5,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                                                {q.name}
                                            </Typography>
                                            <Typography sx={{ color: '#00FF41', fontSize: '0.8rem', fontFamily: 'Fira Code, monospace' }}>
                                                {q.email}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                                                onClick={() => handleDelete(q._id)}
                                                sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#ff6b6b' } }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6, my: 2 }}>
                                        "{q.message}"
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
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
            )}
        </Box>
    );
};

export default ManageQueries;
