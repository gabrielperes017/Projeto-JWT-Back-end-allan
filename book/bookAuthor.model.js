const db = require('../config/db');

const BookAuthor = db.define('BookAuthor', {}, { timestamps: false });

module.exports = BookAuthor;
