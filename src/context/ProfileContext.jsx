import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/api';

const defaultProfile = {
    name: 'Abhijeet Rawat',
    email: 'abhijeetrawat.dev@gmail.com',
    mobileNumber: '+919999999999',
    resumeURL: 'https://docs.google.com/document/d/1azXMe6AKB34DnnR3ogXqRry5aSpHL5IUCqf5qV7FqgA/edit?usp=sharing',
    githubURL: 'https://github.com/abhijeet-rawat',
    linkedInURL: 'https://linkedin.com/in/abhijeet-rawat',
    leetCodeURL: 'https://leetcode.com/abhijeet-rawat',
    HackerRankURL: 'https://hackerrank.com/abhijeet-rawat',
};

const ProfileContext = createContext({
    profile: defaultProfile,
    loading: false,
    refreshProfile: () => Promise.resolve(),
    updateProfile: () => Promise.resolve(),
});

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(defaultProfile);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const res = await userApi.getProfile();
            if (res.data?.data) {
                setProfile((prev) => ({
                    ...prev,
                    ...res.data.data,
                }));
            }
        } catch (err) {
            console.warn('Using default profile data:', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async (updateData) => {
        const res = await userApi.updateProfile(updateData);
        if (res.data?.success && res.data?.data) {
            setProfile((prev) => ({
                ...prev,
                ...res.data.data,
            }));
        }
        return res.data;
    };

    return (
        <ProfileContext.Provider
            value={{
                profile,
                loading,
                refreshProfile: fetchProfile,
                updateProfile,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);

export default ProfileContext;
