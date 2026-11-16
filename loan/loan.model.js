const db = require('../config/db');
const { DataTypes } = require('sequelize');

const Loan = db.define('Loan', {
    loanDate: { type: DataTypes.DATE, allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE },
    // gravado: ATIVO ou DEVOLVIDO. ATRASADO é calculado na leitura (dueDate < hoje e sem returnDate)
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'ATIVO',
        get() {
            const status = this.getDataValue('status');
            if (status === 'ATIVO' && new Date(this.getDataValue('dueDate')) < new Date()) {
                return 'ATRASADO';
            }
            return status;
        }
    },
    fine: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
});

module.exports = Loan;
