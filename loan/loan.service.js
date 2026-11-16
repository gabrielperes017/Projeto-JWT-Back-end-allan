const { Op } = require('sequelize');
const { db, Loan, Book, Reader } = require('../models');
const { httpError } = require('../config/http');

const DAY = 24 * 60 * 60 * 1000;
const include = [
    { model: Book, attributes: ['id', 'title'] },
    { model: Reader, attributes: ['id', 'name'] }
];

const statusWhere = (status) => {
    const now = new Date();
    if (status === 'ATIVO') return { returnDate: null, dueDate: { [Op.gte]: now } };
    if (status === 'ATRASADO') return { returnDate: null, dueDate: { [Op.lt]: now } };
    if (status === 'DEVOLVIDO') return { returnDate: { [Op.ne]: null } };
    return {};
};

const loanService = {
    findAll: ({ status }) => Loan.findAll({
        where: statusWhere(status),
        include,
        order: [['loanDate', 'DESC']]
    }),

    create: ({ bookId, readerId }, userId) => db.transaction(async (transaction) => {
        const book = await Book.findByPk(bookId, { transaction });
        if (!book) throw httpError(404, 'Book not found');
        const reader = await Reader.findByPk(readerId, { transaction });
        if (!reader) throw httpError(404, 'Reader not found');

        if (book.availableCopies <= 0) throw httpError(409, 'No copies available');

        const now = new Date();
        const overdue = await Loan.count({
            where: { readerId, returnDate: null, dueDate: { [Op.lt]: now } }, transaction
        });
        if (overdue > 0) throw httpError(409, 'Reader has overdue loans');
        const active = await Loan.count({ where: { readerId, returnDate: null }, transaction });
        if (active >= 3) throw httpError(409, 'Reader already has 3 active loans');

        const loan = await Loan.create({
            bookId, readerId, userId,
            loanDate: now,
            dueDate: new Date(now.getTime() + 7 * DAY),
            status: 'ATIVO'
        }, { transaction });
        await book.decrement('availableCopies', { transaction });
        return loan;
    }),

    giveBack: (id) => db.transaction(async (transaction) => {
        const loan = await Loan.findByPk(id, { transaction });
        if (!loan) throw httpError(404, 'Loan not found');
        if (loan.returnDate) throw httpError(409, 'Loan already returned');

        const now = new Date();
        const daysLate = Math.max(0, Math.ceil((now - new Date(loan.dueDate)) / DAY));
        await loan.update({
            returnDate: now,
            status: 'DEVOLVIDO',
            fine: daysLate * 1.0
        }, { transaction });
        await Book.increment('availableCopies', { by: 1, where: { id: loan.bookId }, transaction });
        return loan;
    })
};

module.exports = loanService;
