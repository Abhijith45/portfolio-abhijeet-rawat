import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await login(email, password);
            if (res?.success) {
                navigate('/admin/dashboard');
            } else {
                setError(res?.message || 'Login failed. Invalid credentials.');
            }
        } catch (err) {
            setError(err.message || 'Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#050505',
                p: 2,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '440px' }}
            >
                <Card
                    sx={{
                        background: '#0a0a0a',
                        border: '1px solid rgba(0,255,65,0.25)',
                        borderRadius: '12px',
                        boxShadow: '0 0 40px rgba(0,255,65,0.08)',
                        p: { xs: 2, sm: 3 },
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: 'rgba(0,255,65,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#00FF41',
                                    mb: 1.5,
                                    border: '1px solid rgba(0,255,65,0.3)',
                                }}
                            >
                                <LockOutlinedIcon />
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    fontFamily: 'Inter, sans-serif',
                                    color: '#fff',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Admin Portal
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.75rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    mt: 0.5,
                                }}
                            >
                                {'// ENTER AUTHORIZATION CREDENTIALS'}
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, background: 'rgba(255,50,50,0.1)', color: '#ff6b6b' }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Admin Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                size="small"
                                sx={{
                                    mb: 2.5,
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255,255,255,0.02)',
                                        '& fieldset': { borderColor: 'rgba(0,255,65,0.2)' },
                                        '&:hover fieldset': { borderColor: 'rgba(0,255,65,0.4)' },
                                        '&.Mui-focused fieldset': { borderColor: '#00FF41' },
                                    },
                                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#00FF41' },
                                    '& .MuiOutlinedInput-input': { color: '#fff' },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: 'rgba(255,255,255,0.4)' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255,255,255,0.02)',
                                        '& fieldset': { borderColor: 'rgba(0,255,65,0.2)' },
                                        '&:hover fieldset': { borderColor: 'rgba(0,255,65,0.4)' },
                                        '&.Mui-focused fieldset': { borderColor: '#00FF41' },
                                    },
                                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#00FF41' },
                                    '& .MuiOutlinedInput-input': { color: '#fff' },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 1.2,
                                    background: '#00FF41',
                                    color: '#000',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    fontFamily: 'Fira Code, monospace',
                                    '&:hover': {
                                        background: '#39FF14',
                                        boxShadow: '0 0 20px rgba(0,255,65,0.4)',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={22} sx={{ color: '#000' }} /> : 'ACCESS DASHBOARD'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
};

export default AdminLogin;
