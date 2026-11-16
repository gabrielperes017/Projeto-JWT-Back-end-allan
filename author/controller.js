const authorService = require('./service');
const { sendError } = require('../config/http');

const authorController = {
    findAll: async (req, res) => {
        try { res.json(await authorService.findAll()); } catch (e) { sendError(res, e); }
    },
    findById: async (req, res) => {
        try { res.json(await authorService.findById(req.params.id)); } catch (e) { sendError(res, e); }
    },
    create: async (req, res) => {
        try { res.status(201).json(await authorService.create(req.body)); } catch (e) { sendError(res, e); }
    },
    update: async (req, res) => {
        try { res.json(await authorService.update(req.params.id, req.body)); } catch (e) { sendError(res, e); }
    },
    remove: async (req, res) => {
        try { await authorService.remove(req.params.id); res.status(204).end(); } catch (e) { sendError(res, e); }
    }
};

module.exports = authorController;
