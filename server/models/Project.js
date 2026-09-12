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
        github: {
            type: String,
            trim: true,
            default: '',
        },
        demo: {
            type: String,
            trim: true,
            default: '',
        },
        image: {
            type: String,
            trim: true,
            default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop',
        },
        featured: {
            type: Boolean,
            default: true,
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

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
