const db = require('../config/db');
const User = require('../user/user.model');
const RefreshToken = require('../auth/refreshToken.model');
const Category = require('../category/category.model');
const Author = require('../author/author.model');
const Book = require('../book/book.model');
const BookAuthor = require('../book/bookAuthor.model');
const Reader = require('../reader/reader.model');
const Loan = require('../loan/loan.model');

User.hasMany(RefreshToken, { foreignKey: { name: 'userId', allowNull: false } });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Book, { foreignKey: { name: 'categoryId', allowNull: false } });
Book.belongsTo(Category, { foreignKey: 'categoryId' });

Book.belongsToMany(Author, { through: BookAuthor, foreignKey: 'bookId', otherKey: 'authorId' });
Author.belongsToMany(Book, { through: BookAuthor, foreignKey: 'authorId', otherKey: 'bookId' });

Book.hasMany(Loan, { foreignKey: { name: 'bookId', allowNull: false } });
Loan.belongsTo(Book, { foreignKey: 'bookId' });

Reader.hasMany(Loan, { foreignKey: { name: 'readerId', allowNull: false } });
Loan.belongsTo(Reader, { foreignKey: 'readerId' });

User.hasMany(Loan, { foreignKey: { name: 'userId', allowNull: false } });
Loan.belongsTo(User, { foreignKey: 'userId' });

module.exports = { db, User, RefreshToken, Category, Author, Book, BookAuthor, Reader, Loan };
