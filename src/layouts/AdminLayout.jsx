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
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Projects', icon: <WorkOutlineIcon />, path: '/admin/projects' },
    { text: 'Technologies', icon: <CodeIcon />, path: '/admin/technologies' },
    { text: 'Queries', icon: <MessageIcon />, path: '/admin/queries' },
    { text: 'Reviews', icon: <RateReviewIcon />, path: '/admin/reviews' },
    { text: 'Resume Link', icon: <DescriptionIcon />, path: '/admin/resume' },
];

const AdminLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#080808' }}>
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        fontFamily: 'Fira Code, monospace',
                        fontSize: '1rem',
                        color: '#00FF41',
                        letterSpacing: '0.05em',
                    }}
                >
                    AR // ADMIN
                </Typography>
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
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
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
                    onClick={handleLogout}
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
        </Box>
    );
};

export default AdminLayout;
