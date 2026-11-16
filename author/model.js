const db = require('../config/db');
const { DataTypes } = require('sequelize');

const Author = db.define('Author', {
    name: { type: DataTypes.STRING, allowNull: false },
    nationality: { type: DataTypes.STRING },
    birthDate: { type: DataTypes.DATEONLY }
});

module.exports = Author;
