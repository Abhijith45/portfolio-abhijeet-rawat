const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters'],
            maxlength: [2000, 'Message cannot exceed 2000 characters'],
        },
        subject: {
            type: String,
            trim: true,
            default: 'Enquiry Mail',
        },
        status: {
            type: String,
            enum: ['unread', 'read', 'replied', 'archived'],
            default: 'unread',
        },
        notes: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

querySchema.index({ status: 1, createdAt: -1 });

const Query = mongoose.model('Query', querySchema);
module.exports = Query;
