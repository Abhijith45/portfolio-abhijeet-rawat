const User = require('../models/User');

class UserRepository {
    async findAdmin() {
        let admin = await User.findOne({ role: 'admin' }).lean();
        if (!admin) {
            admin = await User.findOne().lean();
        }
        return admin;
    }

    async findById(id) {
        return User.findById(id).lean();
    }

    async findByEmail(email) {
        return User.findOne({ email: email.toLowerCase() }).select('+password');
    }

    async updateById(id, data) {
        return User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).select('-password').lean();
    }

    async create(data) {
        return User.create(data);
    }
}

module.exports = new UserRepository();
