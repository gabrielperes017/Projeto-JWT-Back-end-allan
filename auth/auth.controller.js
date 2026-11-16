const authService = require('./auth.service');
const userService = require('../user/user.service');
const { sendError } = require('../config/http');

const authController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            res.json(await authService.login(email, password));
        } catch (error) {
            sendError(res, error);
        }
    },

    async refresh(req, res) {
        try {
            res.json(await authService.refresh(req.body.refreshToken));
        } catch (error) {
            sendError(res, error);
        }
    },

    async logout(req, res) {
        try {
            await authService.logout(req.body.refreshToken);
            res.json({ message: 'Logout successful' });
        } catch (error) {
            sendError(res, error);
        }
    },

    async me(req, res) {
        try {
            const user = await userService.findById(req.user.id);
            if (!user) return res.status(401).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            sendError(res, error);
        }
    }
};

module.exports = authController;
