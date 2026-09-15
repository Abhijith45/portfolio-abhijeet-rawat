const authService = require('../services/authService');

class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { token, user } = await authService.login(email, password);

            authService.setAuthCookie(res, token);

            res.json({
                success: true,
                token,
                user,
            });
        } catch (err) {
            res.status(401).json({ success: false, message: err.message });
        }
    }

    async getMe(req, res, next) {
        try {
            res.json({
                success: true,
                user: {
                    id: req.user._id,
                    email: req.user.email,
                    name: req.user.name,
                    role: req.user.role || 'admin',
                },
            });
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const isProd = process.env.NODE_ENV === 'production';
            res.cookie('token', '', {
                httpOnly: true,
                expires: new Date(0),
                secure: isProd,
                sameSite: isProd ? 'none' : 'lax',
            });
            res.json({ success: true, message: 'Logged out successfully' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController();
