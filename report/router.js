const { Router } = require('express');
const router = Router();

const reportService = require('./service');
const authMiddleware = require('../auth/middleware');
const isAdmin = require('../auth/isAdmin');
const { sendError } = require('../config/http');

router.get('/dashboard', authMiddleware, isAdmin, async (req, res) => {
    try { res.json(await reportService.dashboard()); } catch (e) { sendError(res, e); }
});

module.exports = router;
