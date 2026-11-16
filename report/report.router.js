const { Router } = require('express');
const router = Router();

const reportService = require('./report.service');
const authMiddleware = require('../auth/auth.middleware');
const isAdmin = require('../auth/isAdmin.middleware');
const { sendError } = require('../config/http');

router.get('/dashboard', authMiddleware, isAdmin, async (req, res) => {
    try { res.json(await reportService.dashboard()); } catch (e) { sendError(res, e); }
});

module.exports = router;
