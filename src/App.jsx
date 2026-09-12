import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import theme from './theme';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public components
const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
const FloatingSocials = lazy(() => import('./components/FloatingSocials'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const AllProjects = lazy(() => import('./pages/AllProjects'));

// Admin components
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const ManageProjects = lazy(() => import('./pages/Admin/ManageProjects'));
const ManageTech = lazy(() => import('./pages/Admin/ManageTech'));
const ManageQueries = lazy(() => import('./pages/Admin/ManageQueries'));
const ManageReviews = lazy(() => import('./pages/Admin/ManageReviews'));
const ManageResume = lazy(() => import('./pages/Admin/ManageResume'));

const LoadingFallback = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#050505',
        }}
    >
        <CircularProgress sx={{ color: '#00FF41' }} />
    </Box>
);

// Public Layout wrapper with Navbar, FloatingSocials, and Footer
const PublicLayout = ({ children }) => (
    <>
        <Navbar />
        <FloatingSocials />
        {children}
        <Footer />
    </>
);

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            {/* Public Routes */}
                            <Route
                                path="/"
                                element={
                                    <PublicLayout>
                                        <Home />
                                    </PublicLayout>
                                }
                            />
                            <Route
                                path="/about"
                                element={
                                    <PublicLayout>
                                        <About />
                                    </PublicLayout>
                                }
                            />
                            <Route
                                path="/contact"
                                element={
                                    <PublicLayout>
                                        <Contact />
                                    </PublicLayout>
                                }
                            />
                            <Route
                                path="/all-projects"
                                element={
                                    <PublicLayout>
                                        <AllProjects />
                                    </PublicLayout>
                                }
                            />


                            {/* Admin Auth Route */}
                            <Route path="/admin/login" element={<AdminLogin />} />

                            {/* Protected Admin Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="projects" element={<ManageProjects />} />
                                    <Route path="technologies" element={<ManageTech />} />
                                    <Route path="queries" element={<ManageQueries />} />
                                    <Route path="reviews" element={<ManageReviews />} />
                                    <Route path="resume" element={<ManageResume />} />
                                </Route>
                            </Route>

                            {/* Catch-all */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
