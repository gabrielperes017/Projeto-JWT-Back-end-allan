const { Op } = require('sequelize');
const { Book, Category, Author, BookAuthor, Loan } = require('../models');
const { httpError } = require('../config/http');

const include = [
    Category,
    { model: Author, through: { attributes: [] } }
];

const bookService = {
    findAll: async ({ title, categoryId, authorId, available }) => {
        const where = {};
        if (title) where.title = { [Op.like]: `%${title}%` };
        if (categoryId) where.categoryId = categoryId;
        if (available === 'true') where.availableCopies = { [Op.gt]: 0 };
        if (authorId) {
            const links = await BookAuthor.findAll({ where: { authorId } });
            where.id = links.map((l) => l.bookId);
        }
        return Book.findAll({ where, include, order: [['title', 'ASC']] });
    },
    findById: async (id) => {
        const book = await Book.findByPk(id, { include });
        if (!book) throw httpError(404, 'Book not found');
        return book;
    },
    create: async ({ title, isbn, year, totalCopies, categoryId, authorIds }) => {
        const copies = totalCopies ?? 1;
        const book = await Book.create({
            title, isbn, year, categoryId,
            totalCopies: copies,
            availableCopies: copies
        });
        if (authorIds) await book.setAuthors(authorIds);
        return bookService.findById(book.id);
    },
    update: async (id, { title, isbn, year, totalCopies, categoryId, authorIds }) => {
        const book = await bookService.findById(id);
        const fields = { title, isbn, year, categoryId };
        if (totalCopies !== undefined) {
            const available = book.availableCopies + (totalCopies - book.totalCopies);
            if (available < 0) throw httpError(409, 'totalCopies lower than copies currently on loan');
            fields.totalCopies = totalCopies;
            fields.availableCopies = available;
        }
        await book.update(fields);
        if (authorIds) await book.setAuthors(authorIds);
        return bookService.findById(id);
    },
    remove: async (id) => {
        const book = await bookService.findById(id);
        if (await Loan.count({ where: { bookId: id } })) {
            throw httpError(409, 'Book has loans and cannot be deleted');
        }
        await book.setAuthors([]);
        await book.destroy();
    }
};

module.exports = bookService;
