const categoryService = require('./category.service');
const { sendError } = require('../config/http');

const categoryController = {
    findAll: async (req, res) => {
        try { res.json(await categoryService.findAll()); } catch (e) { sendError(res, e); }
    },
    findById: async (req, res) => {
        try { res.json(await categoryService.findById(req.params.id)); } catch (e) { sendError(res, e); }
    },
    create: async (req, res) => {
        try { res.status(201).json(await categoryService.create(req.body)); } catch (e) { sendError(res, e); }
    },
    update: async (req, res) => {
        try { res.json(await categoryService.update(req.params.id, req.body)); } catch (e) { sendError(res, e); }
    },
    remove: async (req, res) => {
        try { await categoryService.remove(req.params.id); res.status(204).end(); } catch (e) { sendError(res, e); }
    }
};

module.exports = categoryController;
