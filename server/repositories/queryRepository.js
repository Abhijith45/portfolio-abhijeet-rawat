const Query = require('../models/Query');

class QueryRepository {
    async find(query = {}, options = {}) {
        let cursor = Query.find(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        if (options.skip) cursor = cursor.skip(options.skip);
        if (options.limit) cursor = cursor.limit(options.limit);
        return cursor.lean();
    }

    async count(query = {}) {
        return Query.countDocuments(query);
    }

    async findById(id) {
        return Query.findById(id).lean();
    }

    async create(data) {
        return Query.create(data);
    }

    async updateById(id, data) {
        return Query.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async deleteById(id) {
        return Query.findByIdAndDelete(id).lean();
    }
}

module.exports = new QueryRepository();
