const readerService = require('./reader.service');
const { sendError } = require('../config/http');

const readerController = {
    findAll: async (req, res) => {
        try { res.json(await readerService.findAll()); } catch (e) { sendError(res, e); }
    },
    findById: async (req, res) => {
        try { res.json(await readerService.findById(req.params.id)); } catch (e) { sendError(res, e); }
    },
    create: async (req, res) => {
        try { res.status(201).json(await readerService.create(req.body)); } catch (e) { sendError(res, e); }
    },
    update: async (req, res) => {
        try { res.json(await readerService.update(req.params.id, req.body)); } catch (e) { sendError(res, e); }
    },
    findLoans: async (req, res) => {
        try { res.json(await readerService.findLoans(req.params.id)); } catch (e) { sendError(res, e); }
    }
};

module.exports = readerController;
