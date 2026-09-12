const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Technology name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: [
                'Frontend & UI',
                'Backend & Runtime',
                'Database & Cache',
                'DevOps, Cloud & Storage',
                'Version Control & Dev Tools',
                'Other',
            ],
            default: 'Frontend & UI',
        },
        icon: {
            type: String,
            trim: true,
            default: '',
        },
        proficiency: {
            type: String,
            trim: true,
            default: 'Proficient',
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

const Technology = mongoose.model('Technology', technologySchema);
module.exports = Technology;
