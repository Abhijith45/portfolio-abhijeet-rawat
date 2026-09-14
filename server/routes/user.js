const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const serverCache = require('../utils/cacheManager');

const defaultUserProfile = {
    name: 'Abhijeet Rawat',
    email: 'abhijeetrawat.dev@gmail.com',
    mobileNumber: '+919999999999',
    resumeURL: 'https://docs.google.com/document/d/1azXMe6AKB34DnnR3ogXqRry5aSpHL5IUCqf5qV7FqgA/edit?usp=sharing',
    githubURL: 'https://github.com/abhijeet-rawat',
    linkedInURL: 'https://linkedin.com/in/abhijeet-rawat',
    leetCodeURL: 'https://leetcode.com/abhijeet-rawat',
    HackerRankURL: 'https://hackerrank.com/abhijeet-rawat',
};

// GET /api/user/profile - Public: get profile & social link details
router.get('/profile', async (req, res) => {
    try {
        const cacheKey = 'user:profile';
        const cached = serverCache.get(cacheKey);

        res.setHeader('x-cache-version', String(serverCache.getCacheVersion()));
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

        if (cached) {
            res.setHeader('x-server-cache', 'HIT');
            return res.json(cached);
        }

        let admin = await User.findOne({ role: 'admin' }).select('-password').lean();

        if (!admin) {
            // Check any user if role not explicitly admin
            admin = await User.findOne().select('-password').lean();
        }

        if (!admin) {
            const payload = { success: true, data: defaultUserProfile };
            serverCache.set(cacheKey, payload);
            res.setHeader('x-server-cache', 'MISS');
            return res.json(payload);
        }

        const payload = {
            success: true,
            data: {
                id: admin._id,
                name: admin.name || defaultUserProfile.name,
                email: admin.email || defaultUserProfile.email,
                mobileNumber: admin.mobileNumber !== undefined ? admin.mobileNumber : defaultUserProfile.mobileNumber,
                resumeURL: admin.resumeURL !== undefined ? admin.resumeURL : defaultUserProfile.resumeURL,
                githubURL: admin.githubURL !== undefined ? admin.githubURL : defaultUserProfile.githubURL,
                linkedInURL: admin.linkedInURL !== undefined ? admin.linkedInURL : defaultUserProfile.linkedInURL,
                leetCodeURL: admin.leetCodeURL !== undefined ? admin.leetCodeURL : defaultUserProfile.leetCodeURL,
                HackerRankURL: admin.HackerRankURL !== undefined ? admin.HackerRankURL : defaultUserProfile.HackerRankURL,
            },
        };

        serverCache.set(cacheKey, payload);
        res.setHeader('x-server-cache', 'MISS');
        res.json(payload);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.json({
            success: true,
            data: defaultUserProfile,
        });
    }
});

// PUT /api/user/profile - Admin: update profile & social links
router.put('/profile', protect, async (req, res) => {
    try {
        const {
            name,
            email,
            mobileNumber,
            resumeURL,
            githubURL,
            linkedInURL,
            leetCodeURL,
            HackerRankURL,
        } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (email !== undefined) updateData.email = email.trim().toLowerCase();
        if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber.trim();
        if (resumeURL !== undefined) updateData.resumeURL = resumeURL.trim();
        if (githubURL !== undefined) updateData.githubURL = githubURL.trim();
        if (linkedInURL !== undefined) updateData.linkedInURL = linkedInURL.trim();
        if (leetCodeURL !== undefined) updateData.leetCodeURL = leetCodeURL.trim();
        if (HackerRankURL !== undefined) updateData.HackerRankURL = HackerRankURL.trim();

        const user = await User.findByIdAndUpdate(req.user._id, updateData, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        serverCache.clearPattern('user:profile');
        serverCache.incrementCacheVersion();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                resumeURL: user.resumeURL,
                githubURL: user.githubURL,
                linkedInURL: user.linkedInURL,
                leetCodeURL: user.leetCodeURL,
                HackerRankURL: user.HackerRankURL,
            },
        });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
