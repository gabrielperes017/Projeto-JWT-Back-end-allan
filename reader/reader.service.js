const { Reader, Loan, Book } = require('../models');
const { httpError } = require('../config/http');

const readerService = {
    findAll: () => Reader.findAll({ order: [['name', 'ASC']] }),
    findById: async (id) => {
        const reader = await Reader.findByPk(id);
        if (!reader) throw httpError(404, 'Reader not found');
        return reader;
    },
    create: ({ name, cpf, email, phone }) => Reader.create({ name, cpf, email, phone }),
    update: async (id, { name, cpf, email, phone }) => {
        const reader = await readerService.findById(id);
        return reader.update({ name, cpf, email, phone });
    },
    findLoans: async (id) => {
        await readerService.findById(id);
        return Loan.findAll({
            where: { readerId: id },
            include: [{ model: Book, attributes: ['id', 'title'] }],
            order: [['loanDate', 'DESC']]
        });
    }
};

module.exports = readerService;
