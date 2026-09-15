const Project = require('../models/Project');

class ProjectRepository {
    async count(query = {}) {
        return Project.countDocuments(query);
    }

    async find(query = {}, options = {}) {
        let cursor = Project.find(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        if (options.limit) cursor = cursor.limit(options.limit);
        if (options.skip) cursor = cursor.skip(options.skip);
        if (options.select) cursor = cursor.select(options.select);
        return cursor.lean();
    }

    async findById(id) {
        return Project.findById(id).lean();
    }

    async create(data) {
        return Project.create(data);
    }

    async updateById(id, data) {
        return Project.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).lean();
    }

    async deleteById(id) {
        return Project.findByIdAndDelete(id).lean();
    }
}

module.exports = new ProjectRepository();
