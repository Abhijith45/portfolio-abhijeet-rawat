const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Role/Position is required'],
            trim: true,
        },
        period: {
            type: String,
            required: [true, 'Period/Duration is required'],
            trim: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
        location: {
            type: String,
            default: 'Lucknow, India',
            trim: true,
        },
        responsibilities: {
            type: [String],
            default: [],
        },
        skills: {
            type: [String],
            default: [],
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Experience', experienceSchema);
