import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        // If there's no token in sessionStorage and we are in a browser environment, skip network call if desired
        try {
            const res = await authApi.getMe();
            if (res.data?.success && res.data?.user) {
                setUser(res.data.user);
            } else {
                if (typeof window !== 'undefined') window.sessionStorage?.removeItem('admin_token');
                setUser(null);
            }
        } catch {
            if (typeof window !== 'undefined') window.sessionStorage?.removeItem('admin_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback(async (email, password) => {
        const res = await authApi.login({ email, password });
        if (res.data?.success && res.data?.user) {
            if (res.data?.token && typeof window !== 'undefined') {
                // Cross-domain auth requirement (Render backend + Netlify frontend)
                // react-doctor-disable-next-line react-doctor/auth-token-in-web-storage
                window.sessionStorage.setItem('admin_token', res.data.token);
            }
            setUser(res.data.user);
        }
        return res.data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            if (typeof window !== 'undefined') {
                window.sessionStorage?.removeItem('admin_token');
            }
            setUser(null);
        }
    }, []);

    const contextValue = useMemo(
        () => ({ user, loading, login, logout, checkAuth }),
        [user, loading, login, logout, checkAuth]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
