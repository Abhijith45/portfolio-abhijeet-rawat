const Experience = require('../models/Experience');

class ExperienceRepository {
    async find(query = {}, options = {}) {
        let cursor = Experience.find(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        if (options.limit) cursor = cursor.limit(options.limit);
        return cursor.lean();
    }

    async count(query = {}) {
        return Experience.countDocuments(query);
    }

    async insertMany(items) {
        return Experience.insertMany(items);
    }

    async findById(id) {
        return Experience.findById(id).lean();
    }

    async create(data) {
        return Experience.create(data);
    }

    async updateById(id, data) {
        return Experience.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).lean();
    }

    async findOne(query = {}, options = {}) {
        let cursor = Experience.findOne(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        return cursor.lean();
    }

    async updateMany(query, update) {
        return Experience.updateMany(query, update);
    }

    async deleteById(id) {
        return Experience.findByIdAndDelete(id).lean();
    }
}

module.exports = new ExperienceRepository();
