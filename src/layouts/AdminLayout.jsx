import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CodeIcon from '@mui/icons-material/Code';
import MessageIcon from '@mui/icons-material/Message';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi, apiCache } from '../services/api';
import portfolioFavicon from '../assets/portfolio_favicon.png';

const drawerWidth = 260;

const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Projects', icon: <WorkOutlineIcon />, path: '/admin/projects' },
    { text: 'Experiences', icon: <TimelineIcon />, path: '/admin/experiences' },
    { text: 'Technologies', icon: <CodeIcon />, path: '/admin/technologies' },
    { text: 'Queries', icon: <MessageIcon />, path: '/admin/queries' },
    { text: 'Reviews', icon: <RateReviewIcon />, path: '/admin/reviews' },
    { text: 'Profile & Links', icon: <DescriptionIcon />, path: '/admin/resume' },
];

const AdminLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [purgeDialogOpen, setPurgeDialogOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [isPurging, setIsPurging] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        setLogoutDialogOpen(false);
        await logout();
        navigate('/admin/login');
    };

    const handlePurgeCacheConfirm = async () => {
        try {
            setIsPurging(true);
            const res = await adminApi.purgeCache();

            // Purge local storage and in-memory caches
            apiCache.purgeAll();

            setSnackbar({
                open: true,
                message: res.data?.message || 'Cache purged globally! Fresh data will load from the database.',
                severity: 'success',
            });
            setPurgeDialogOpen(false);
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to purge cache: ' + (err.response?.data?.message || err.message),
                severity: 'error',
            });
        } finally {
            setIsPurging(false);
        }
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#080808' }}>
            <Box
                onClick={() => navigate('/admin/dashboard')}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                        background: 'rgba(255,255,255,0.02)',
                    },
                }}
            >
                <Box
                    component="img"
                    src={portfolioFavicon}
                    alt="Abhijeet Rawat Logo"
                    sx={{
                        width: 36,
                        height: 36,
                        objectFit: 'contain',
                        display: 'block',
                    }}
                />
            </Box>
            <Divider sx={{ borderColor: 'rgba(0,255,65,0.1)' }} />

            <List sx={{ px: 1.5, py: 2, flex: 1 }}>
                {menuItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.8 }}>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }}
                                sx={{
                                    borderRadius: '6px',
                                    background: active ? 'rgba(0,255,65,0.12)' : 'transparent',
                                    border: active ? '1px solid rgba(0,255,65,0.3)' : '1px solid transparent',
                                    '&:hover': {
                                        background: 'rgba(0,255,65,0.06)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: active ? '#00FF41' : 'rgba(255,255,255,0.5)', minWidth: 38 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '0.85rem',
                                        fontWeight: active ? 600 : 400,
                                        color: active ? '#00FF41' : '#fff',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<FlashOnIcon sx={{ color: '#00FF41' }} />}
                    onClick={() => setPurgeDialogOpen(true)}
                    sx={{
                        color: '#00FF41',
                        borderColor: 'rgba(0,255,65,0.3)',
                        fontSize: '0.75rem',
                        fontFamily: 'Fira Code, monospace',
                        fontWeight: 600,
                        '&:hover': { borderColor: '#00FF41', background: 'rgba(0,255,65,0.08)' },
                    }}
                >
                    Purge System Cache
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => window.open('/', '_blank')}
                    sx={{
                        color: 'rgba(255,255,255,0.7)',
                        borderColor: 'rgba(255,255,255,0.15)',
                        fontSize: '0.75rem',
                        '&:hover': { borderColor: '#00FF41', color: '#00FF41' },
                    }}
                >
                    View Public Site
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<LogoutIcon />}
                    onClick={() => setLogoutDialogOpen(true)}
                    sx={{
                        background: 'rgba(255,50,50,0.15)',
                        color: '#ff6b6b',
                        border: '1px solid rgba(255,50,50,0.3)',
                        fontSize: '0.75rem',
                        '&:hover': { background: 'rgba(255,50,50,0.25)' },
                    }}
                >
                    Sign Out
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: '#050505' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    background: 'rgba(10,10,10,0.95)',
                    borderBottom: '1px solid rgba(0,255,65,0.1)',
                    backdropFilter: 'blur(8px)',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' }, color: '#00FF41' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'Fira Code, monospace',
                                fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.7)',
                            }}
                        >
                            Logged in as: <span style={{ color: '#00FF41' }}>{user?.email || 'Admin'}</span>
                        </Typography>
                    </Box>

                    {/* Quick Purge Cache Button on AppBar */}
                    <Tooltip title="Purge all server memory and browser caches globally" arrow>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<FlashOnIcon sx={{ color: '#00FF41' }} />}
                            onClick={() => setPurgeDialogOpen(true)}
                            sx={{
                                color: '#00FF41',
                                borderColor: 'rgba(0,255,65,0.3)',
                                fontSize: '0.75rem',
                                fontFamily: 'Fira Code, monospace',
                                fontWeight: 700,
                                px: 1.5,
                                py: 0.5,
                                '&:hover': {
                                    borderColor: '#00FF41',
                                    background: 'rgba(0,255,65,0.08)',
                                    boxShadow: '0 0 10px rgba(0,255,65,0.3)',
                                },
                            }}
                        >
                            Purge Cache
                        </Button>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid rgba(0,255,65,0.1)',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3, md: 4 },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px',
                    color: '#fff',
                }}
            >
                <Outlet />
            </Box>

            {/* Purge Cache Confirmation Dialog */}
            <Dialog
                open={purgeDialogOpen}
                onClose={() => !isPurging && setPurgeDialogOpen(false)}
                PaperProps={{
                    sx: {
                        background: '#07090e',
                        border: '1px solid rgba(0,255,65,0.3)',
                        color: '#fff',
                        borderRadius: '8px',
                    },
                }}
            >
                <DialogTitle sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                    ⚡ Purge System &amp; Database Caches?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                        This will flush all server in-memory database caches and bump the global cache version.
                        All website visitors will automatically receive fresh data from the database on their next visit.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button
                        onClick={() => setPurgeDialogOpen(false)}
                        disabled={isPurging}
                        sx={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handlePurgeCacheConfirm}
                        disabled={isPurging}
                        startIcon={isPurging ? <CircularProgress size={16} sx={{ color: '#000' }} /> : <FlashOnIcon />}
                        sx={{
                            background: '#00FF41',
                            color: '#000',
                            fontWeight: 700,
                            fontFamily: 'Fira Code, monospace',
                            '&:hover': { background: '#39FF14' },
                        }}
                    >
                        {isPurging ? 'Purging...' : 'Confirm Purge'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                PaperProps={{
                    sx: {
                        background: '#07090e',
                        border: '1px solid rgba(255,77,79,0.3)',
                        color: '#fff',
                        borderRadius: '8px',
                    },
                }}
            >
                <DialogTitle sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, color: '#ff6b6b' }}>
                    Confirm Sign Out
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                        Are you sure you want to end your current session and sign out from the Admin Control Panel?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button
                        onClick={() => setLogoutDialogOpen(false)}
                        sx={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            background: '#ff4d4f',
                            color: '#fff',
                            fontWeight: 700,
                            '&:hover': { background: '#ff7875' },
                        }}
                    >
                        Sign Out
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Toast */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        fontFamily: 'Fira Code, monospace',
                        fontSize: '0.8rem',
                        background: snackbar.severity === 'success' ? '#0a1a0f' : '#2a0d0d',
                        border: `1px solid ${snackbar.severity === 'success' ? '#00FF41' : '#ff4444'}`,
                        color: '#fff',
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminLayout;
