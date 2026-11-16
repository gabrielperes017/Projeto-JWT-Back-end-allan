const bcrypt = require('bcrypt');
const User = require('./user.model');
const { httpError } = require('../config/http');

const userService = {
    create: async (userData) => {
        try {
            const { name, username, email, password, isAdmin } = userData;
            const user = await User.create({
                name, username, email, isAdmin,
                password: await bcrypt.hash(password, 10)
            });
            return await User.findByPk(user.id);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') throw error;
            throw new Error('Error creating user: ' + error.message);
        }
    },
    update: async (id, userData) => {
        const user = await User.findByPk(id);
        if (!user) throw httpError(404, 'User not found');
        const { name, username, email, password, isAdmin } = userData;
        const fields = { name, username, email, isAdmin };
        if (password) fields.password = await bcrypt.hash(password, 10);
        await user.update(fields);
        return await User.findByPk(id);
    },
    setActive: async (id, active) => {
        const user = await User.findByPk(id);
        if (!user) throw httpError(404, 'User not found');
        await user.update({ active });
        return user;
    },
    findById: async (id) => {
        return await User.findByPk(id);
    },
    findByEmail: async (email, withPassword = false) => {
        const model = withPassword ? User.unscoped() : User;
        return await model.findOne({ where: { email } });
    },
    findAll: async () => {
        return await User.findAll();
    },
};

module.exports = userService;
