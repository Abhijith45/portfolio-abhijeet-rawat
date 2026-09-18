const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
    generateToken(user) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        return jwt.sign(
            { id: user._id, role: user.role || 'admin', email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    setAuthCookie(res, token) {
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error('Please provide email and password');
        }

        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role || 'admin',
            },
        };
    }
}

module.exports = new AuthService();
