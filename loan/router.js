const { Router } = require('express');
const router = Router();

const controller = require('./controller');
const authMiddleware = require('../auth/middleware');

router.use(authMiddleware);

router.get('/', controller.findAll);
router.post('/', controller.create);
router.patch('/:id/return', controller.giveBack);

module.exports = router;
