const Technology = require('../models/Technology');

class TechnologyRepository {
    async find(query = {}, options = {}) {
        let cursor = Technology.find(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        return cursor.lean();
    }

    async findById(id) {
        return Technology.findById(id).lean();
    }

    async create(data) {
        return Technology.create(data);
    }

    async updateById(id, data) {
        return Technology.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).lean();
    }

    async findOne(query = {}, options = {}) {
        let cursor = Technology.findOne(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        return cursor.lean();
    }

    async updateMany(query, update) {
        return Technology.updateMany(query, update);
    }

    async deleteById(id) {
        return Technology.findByIdAndDelete(id).lean();
    }
}

module.exports = new TechnologyRepository();
