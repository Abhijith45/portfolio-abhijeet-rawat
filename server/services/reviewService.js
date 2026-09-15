const reviewRepository = require('../repositories/reviewRepository');
const serverCache = require('../utils/cacheManager');
const xss = require('xss');

class ReviewService {
    async getApproved() {
        const cacheKey = 'reviews:approved';
        const cached = serverCache.get(cacheKey);
        if (cached) {
            return { data: cached, fromCache: true };
        }

        const reviews = await reviewRepository.find(
            { approved: true },
            { sort: { createdAt: -1 }, select: '-email -updatedAt -__v' }
        );

        const payload = { success: true, count: reviews.length, data: reviews };
        serverCache.set(cacheKey, payload);
        return { data: payload, fromCache: false };
    }

    async getAll() {
        const reviews = await reviewRepository.find({}, { sort: { createdAt: -1 } });
        return { success: true, count: reviews.length, data: reviews };
    }

    async submitReview(body) {
        const { name, email, designation, company, message, rating } = body;
        const review = await reviewRepository.create({
            name: xss(name.trim()),
            email: email ? xss(email.trim().toLowerCase()) : '',
            designation: (designation || company) ? xss((designation || company).trim()) : '',
            company: company ? xss(company.trim()) : '',
            message: xss(message.trim()),
            rating: rating ? Number(rating) : 5,
            approved: false, // Explicitly pending admin approval
        });

        return {
            success: true,
            message: 'Thank you! Your testimonial has been submitted and is pending review.',
            data: {
                id: review._id,
                name: review.name,
                designation: review.designation,
                rating: review.rating,
            },
        };
    }

    async updateReview(id, body) {
        const { approved, name, designation, company, message, rating } = body;
        const updateData = {};
        if (approved !== undefined) updateData.approved = approved;
        if (name) updateData.name = name;
        if (designation !== undefined || company !== undefined) {
            updateData.designation = designation || company;
        }
        if (message) updateData.message = message;
        if (rating) updateData.rating = rating;

        const review = await reviewRepository.updateById(id, updateData);
        if (!review) {
            throw new Error('Review not found');
        }

        serverCache.clearPattern('reviews:approved');
        const newVersion = serverCache.incrementCacheVersion();

        return { review, cacheVersion: newVersion };
    }

    async deleteReview(id) {
        const review = await reviewRepository.deleteById(id);
        if (!review) {
            throw new Error('Review not found');
        }

        serverCache.clearPattern('reviews:approved');
        const newVersion = serverCache.incrementCacheVersion();

        return { success: true, cacheVersion: newVersion };
    }
}

module.exports = new ReviewService();
