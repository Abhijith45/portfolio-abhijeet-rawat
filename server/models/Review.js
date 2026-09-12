const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name must be at most 100 characters'],
        },
        company: {
            type: String,
            required: [true, 'Company/role is required'],
            trim: true,
            minlength: [2, 'Company must be at least 2 characters'],
            maxlength: [100, 'Company must be at most 100 characters'],
        },
        designation: {
            type: String,
            trim: true,
            maxlength: [100, 'Designation must be at most 100 characters'],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        message: {
            type: String,
            required: [true, 'Review message is required'],
            trim: true,
            minlength: [10, 'Review must be at least 10 characters'],
            maxlength: [1000, 'Review must be at most 1000 characters'],
        },
        rating: {
            type: Number,
            min: [0, 'Rating must be at least 0'],
            max: [5, 'Rating must be at most 5'],
            default: 5,
        },
        approved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for approved reviews
reviewSchema.index({ approved: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
