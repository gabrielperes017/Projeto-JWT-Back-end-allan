const bookService = require('./service');
const { sendError } = require('../config/http');

const bookController = {
    findAll: async (req, res) => {
        try { res.json(await bookService.findAll(req.query)); } catch (e) { sendError(res, e); }
    },
    findById: async (req, res) => {
        try { res.json(await bookService.findById(req.params.id)); } catch (e) { sendError(res, e); }
    },
    create: async (req, res) => {
        try { res.status(201).json(await bookService.create(req.body)); } catch (e) { sendError(res, e); }
    },
    update: async (req, res) => {
        try { res.json(await bookService.update(req.params.id, req.body)); } catch (e) { sendError(res, e); }
    },
    remove: async (req, res) => {
        try { await bookService.remove(req.params.id); res.status(204).end(); } catch (e) { sendError(res, e); }
    }
};

module.exports = bookController;
