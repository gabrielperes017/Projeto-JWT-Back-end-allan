const loanService = require('./loan.service');
const { sendError } = require('../config/http');

const loanController = {
    findAll: async (req, res) => {
        try { res.json(await loanService.findAll(req.query)); } catch (e) { sendError(res, e); }
    },
    create: async (req, res) => {
        try { res.status(201).json(await loanService.create(req.body, req.user.id)); } catch (e) { sendError(res, e); }
    },
    giveBack: async (req, res) => {
        try { res.json(await loanService.giveBack(req.params.id)); } catch (e) { sendError(res, e); }
    }
};

module.exports = loanController;
