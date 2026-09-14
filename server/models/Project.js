const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Project description is required'],
            trim: true,
        },
        techStack: {
            type: [String],
            default: [],
        },
        githubURL: {
            type: String,
            trim: true,
            default: '',
        },
        liveURL: {
            type: String,
            trim: true,
            default: '',
        },
        imageURL: {
            type: String,
            trim: true,
            default: '',
        },
        engineeringOverview: {
            type: String,
            trim: true,
            default: '',
        },
        isFeatured: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
