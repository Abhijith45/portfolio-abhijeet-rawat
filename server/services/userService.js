const userRepository = require('../repositories/userRepository');
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

class UserService {
    async getProfile() {
        const cacheKey = 'user:profile';
        const cached = serverCache.get(cacheKey);
        if (cached) {
            return { data: cached, fromCache: true };
        }

        const admin = await userRepository.findAdmin();
        if (!admin) {
            const payload = { success: true, data: defaultUserProfile };
            serverCache.set(cacheKey, payload);
            return { data: payload, fromCache: false };
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
        return { data: payload, fromCache: false };
    }

    async updateProfile(userId, body) {
        const {
            name,
            email,
            mobileNumber,
            resumeURL,
            githubURL,
            linkedInURL,
            leetCodeURL,
            HackerRankURL,
        } = body;

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (email !== undefined) updateData.email = email.trim().toLowerCase();
        if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber.trim();
        if (resumeURL !== undefined) updateData.resumeURL = resumeURL.trim();
        if (githubURL !== undefined) updateData.githubURL = githubURL.trim();
        if (linkedInURL !== undefined) updateData.linkedInURL = linkedInURL.trim();
        if (leetCodeURL !== undefined) updateData.leetCodeURL = leetCodeURL.trim();
        if (HackerRankURL !== undefined) updateData.HackerRankURL = HackerRankURL.trim();

        const user = await userRepository.updateById(userId, updateData);
        if (!user) {
            throw new Error('User not found');
        }

        serverCache.clearPattern('user:profile');
        const newVersion = serverCache.incrementCacheVersion();

        return {
            user: {
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
            cacheVersion: newVersion,
        };
    }
}

module.exports = new UserService();
