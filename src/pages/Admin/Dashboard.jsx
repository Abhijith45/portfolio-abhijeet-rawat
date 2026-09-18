import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CodeIcon from '@mui/icons-material/Code';
import MessageIcon from '@mui/icons-material/Message';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useNavigate } from 'react-router-dom';
import { projectsApi, technologiesApi, queriesApi, reviewsApi } from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        technologies: 0,
        unreadQueries: 0,
        totalQueries: 0,
        pendingReviews: 0,
        approvedReviews: 0,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [pRes, tRes, qRes, rRes] = await Promise.allSettled([
                projectsApi.getAll({ all: 'true' }),
                technologiesApi.getAll(),
                queriesApi.getAll(),
                reviewsApi.getAll(),
            ]);

            setStats({
                projects: pRes.status === 'fulfilled' ? pRes.value.data?.count || 0 : 0,
                technologies: tRes.status === 'fulfilled' ? tRes.value.data?.count || 0 : 0,
                unreadQueries: qRes.status === 'fulfilled' ? qRes.value.data?.unreadCount || 0 : 0,
                totalQueries: qRes.status === 'fulfilled' ? qRes.value.data?.count || 0 : 0,
                pendingReviews: rRes.status === 'fulfilled' ? rRes.value.data?.pendingCount || 0 : 0,
                approvedReviews:
                    rRes.status === 'fulfilled'
                        ? (rRes.value.data?.data || []).filter((r) => r.approved).length
                        : 0,
            });
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Projects',
            count: stats.projects,
            subtitle: 'Live portfolio projects',
            icon: <WorkOutlineIcon sx={{ fontSize: 32, color: '#00FF41' }} />,
            link: '/admin/projects',
        },
        {
            title: 'Technologies',
            count: stats.technologies,
            subtitle: 'Skills in tools of trade',
            icon: <CodeIcon sx={{ fontSize: 32, color: '#00FF41' }} />,
            link: '/admin/technologies',
        },
        {
            title: 'Contact Queries',
            count: stats.unreadQueries,
            subtitle: `${stats.totalQueries} total received`,
            badge: stats.unreadQueries > 0 ? `${stats.unreadQueries} Unread` : null,
            icon: <MessageIcon sx={{ fontSize: 32, color: '#00FF41' }} />,
            link: '/admin/queries',
        },
        {
            title: 'Reviews',
            count: stats.approvedReviews,
            subtitle: `${stats.pendingReviews} pending approval`,
            badge: stats.pendingReviews > 0 ? `${stats.pendingReviews} Pending` : null,
            icon: <RateReviewIcon sx={{ fontSize: 32, color: '#00FF41' }} />,
            link: '/admin/reviews',
        },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#00FF41' }} />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
                    System Overview
                </Typography>
                <Typography sx={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8rem', color: '#00FF41' }}>
                    // PORTFOLIO METRICS & CONTENT STATUS
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {cards.map((c) => (
                    <Grid size={{xs:12,sm:6,lg:3}} key={c.title}>
                        <Card
                            sx={{
                                background: '#0a0a0a',
                                border: '1px solid rgba(0,255,65,0.15)',
                                borderRadius: '10px',
                                p: 2.5,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    border: '1px solid rgba(0,255,65,0.4)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 8px 25px rgba(0,255,65,0.08)',
                                },
                            }}
                            onClick={() => navigate(c.link)}
                        >
                            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: '8px',
                                            background: 'rgba(0,255,65,0.08)',
                                            border: '1px solid rgba(0,255,65,0.2)',
                                        }}
                                    >
                                        {c.icon}
                                    </Box>
                                    {c.badge && (
                                        <Box
                                            sx={{
                                                px: 1.2,
                                                py: 0.4,
                                                borderRadius: '20px',
                                                background: 'rgba(255,170,0,0.15)',
                                                border: '1px solid rgba(255,170,0,0.4)',
                                                color: '#ffaa00',
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                                fontFamily: 'Fira Code, monospace',
                                            }}
                                        >
                                            {c.badge}
                                        </Box>
                                    )}
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
                                    {c.count}
                                </Typography>
                                <Typography sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                                    {c.title}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', mt: 0.5 }}>
                                    {c.subtitle}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions */}
            <Box sx={{ mt: 5, p: 3, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                    Quick Content Actions
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mb: 3 }}>
                    Update your portfolio records in real-time. Changes are immediately visible on the public frontend.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/admin/projects')}
                        sx={{ background: '#00FF41', color: '#000', fontWeight: 700, '&:hover': { background: '#39FF14' } }}
                    >
                        + Add New Project
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/admin/technologies')}
                        sx={{ borderColor: 'rgba(0,255,65,0.4)', color: '#00FF41', '&:hover': { borderColor: '#00FF41' } }}
                    >
                        + Add Technology
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/admin/resume')}
                        sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                    >
                        Update Resume Link
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
