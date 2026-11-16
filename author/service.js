const { Author, BookAuthor } = require('../models');
const { httpError } = require('../config/http');

const authorService = {
    findAll: () => Author.findAll({ order: [['name', 'ASC']] }),
    findById: async (id) => {
        const author = await Author.findByPk(id);
        if (!author) throw httpError(404, 'Author not found');
        return author;
    },
    create: ({ name, nationality, birthDate }) => Author.create({ name, nationality, birthDate }),
    update: async (id, { name, nationality, birthDate }) => {
        const author = await authorService.findById(id);
        return author.update({ name, nationality, birthDate });
    },
    remove: async (id) => {
        const author = await authorService.findById(id);
        if (await BookAuthor.count({ where: { authorId: id } })) {
            throw httpError(409, 'Author has books and cannot be deleted');
        }
        await author.destroy();
    }
};

module.exports = authorService;
