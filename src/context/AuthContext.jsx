import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        // If there's no token in sessionStorage and we are in a browser environment, skip network call if desired
        const token = typeof window !== 'undefined' ? window.sessionStorage?.getItem('admin_token') : null;
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
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await authApi.login({ email, password });
        if (res.data?.success && res.data?.user) {
            if (res.data?.token && typeof window !== 'undefined') {
                window.sessionStorage.setItem('admin_token', res.data.token);
            }
            setUser(res.data.user);
        }
        return res.data;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            if (typeof window !== 'undefined') {
                window.sessionStorage?.removeItem('admin_token');
            }
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
