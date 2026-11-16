const { Op } = require('sequelize');
const { Book, Loan } = require('../models');

const reportService = {
    dashboard: async () => {
        const now = new Date();
        const [totalBooks, activeLoans, overdueLoans, totalFines] = await Promise.all([
            Book.count(),
            Loan.count({ where: { returnDate: null, dueDate: { [Op.gte]: now } } }),
            Loan.count({ where: { returnDate: null, dueDate: { [Op.lt]: now } } }),
            Loan.sum('fine')
        ]);
        return { totalBooks, activeLoans, overdueLoans, totalFines: totalFines || 0 };
    }
};

module.exports = reportService;
