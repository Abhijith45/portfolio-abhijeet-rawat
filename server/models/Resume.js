const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: 'Abhijeet Rawat - Full Stack Developer Resume',
        },
        driveFileId: {
            type: String,
            default: '1Jlh8BsV3HuVy_DcsrTtsPv3e0-iaLOZa',
        },
        downloadUrl: {
            type: String,
            required: true,
            default: 'https://drive.google.com/file/d/1Jlh8BsV3HuVy_DcsrTtsPv3e0-iaLOZa/view',
        },
        version: {
            type: String,
            default: '1.0',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
