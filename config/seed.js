const { User } = require('../models');
const userService = require('../user/user.service');

// Cria o primeiro admin se não existir nenhum
const seedAdmin = async () => {
    if (await User.count({ where: { isAdmin: true } })) return;
    await userService.create({
        name: 'Admin',
        username: 'admin',
        email: 'admin@biblioteca.com',
        password: '123456',
        isAdmin: true
    });
    console.log('Admin criado: admin@biblioteca.com / 123456');
};

module.exports = seedAdmin;
