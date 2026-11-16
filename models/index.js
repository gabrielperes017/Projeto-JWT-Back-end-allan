const db = require('../config/db');
const User = require('../user/model');
const RefreshToken = require('../auth/refreshToken');
const Category = require('../category/model');
const Author = require('../author/model');
const Book = require('../book/model');
const BookAuthor = require('../book/bookAuthor');
const Reader = require('../reader/model');
const Loan = require('../loan/model');

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
