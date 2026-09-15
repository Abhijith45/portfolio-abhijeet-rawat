const Review = require('../models/Review');

class ReviewRepository {
    async find(query = {}, options = {}) {
        let cursor = Review.find(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        if (options.select) cursor = cursor.select(options.select);
        return cursor.lean();
    }

    async findById(id) {
        return Review.findById(id).lean();
    }

    async create(data) {
        return Review.create(data);
    }

    async updateById(id, data) {
        return Review.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async deleteById(id) {
        return Review.findByIdAndDelete(id).lean();
    }
}

module.exports = new ReviewRepository();
