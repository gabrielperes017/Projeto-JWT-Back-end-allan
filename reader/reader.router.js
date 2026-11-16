const { Router } = require('express');
const router = Router();

const controller = require('./reader.controller');
const authMiddleware = require('../auth/auth.middleware');

router.use(authMiddleware);

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.get('/:id/loans', controller.findLoans);
router.post('/', controller.create);
router.put('/:id', controller.update);

module.exports = router;
