const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userService = require('../user/user.service');
const RefreshToken = require('./refreshToken.model');
const { httpError } = require('../config/http');

const REFRESH_DAYS = 7;

const issueTokens = async (user) => {
    const accessToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
    );
    // jti garante refresh token único mesmo se emitido no mesmo segundo
    const refreshToken = jwt.sign(
        { id: user.id, jti: crypto.randomBytes(16).toString('hex') },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: `${REFRESH_DAYS}d` }
    );
    await RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000)
    });
    return { accessToken, refreshToken };
};

const authService = {
    login: async (email, password) => {
        const user = await userService.findByEmail(email, true);
        if (!user) throw httpError(401, 'Invalid email or password');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw httpError(401, 'Invalid email or password');
        if (!user.active) throw httpError(401, 'User inactive');
        const tokens = await issueTokens(user);
        return { ...tokens, user: await userService.findById(user.id) };
    },

    refresh: async (refreshToken) => {
        const record = refreshToken && await RefreshToken.findOne({ where: { token: refreshToken } });
        if (!record) throw httpError(401, 'Invalid refresh token');
        if (record.revoked) {
            // reuso de token revogado: possível roubo, revoga todos do usuário
            await RefreshToken.update({ revoked: true }, { where: { userId: record.userId } });
            throw httpError(401, 'Refresh token reused');
        }
        if (record.expiresAt < new Date()) throw httpError(401, 'Refresh token expired');
        try {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            throw httpError(401, 'Invalid refresh token');
        }
        const user = await userService.findById(record.userId);
        if (!user || !user.active) throw httpError(401, 'Invalid refresh token');
        await record.update({ revoked: true });
        const tokens = await issueTokens(user);
        return { ...tokens, user };
    },

    logout: async (refreshToken) => {
        await RefreshToken.update({ revoked: true }, { where: { token: refreshToken } });
    },

    verifyToken: async (token) => {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
};

module.exports = authService;
