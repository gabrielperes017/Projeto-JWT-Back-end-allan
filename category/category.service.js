const { Category, Book } = require('../models');
const { httpError } = require('../config/http');

const categoryService = {
    findAll: () => Category.findAll({ order: [['name', 'ASC']] }),
    findById: async (id) => {
        const category = await Category.findByPk(id);
        if (!category) throw httpError(404, 'Category not found');
        return category;
    },
    create: ({ name, description }) => Category.create({ name, description }),
    update: async (id, { name, description }) => {
        const category = await categoryService.findById(id);
        return category.update({ name, description });
    },
    remove: async (id) => {
        const category = await categoryService.findById(id);
        if (await Book.count({ where: { categoryId: id } })) {
            throw httpError(409, 'Category has books and cannot be deleted');
        }
        await category.destroy();
    }
};

module.exports = categoryService;
