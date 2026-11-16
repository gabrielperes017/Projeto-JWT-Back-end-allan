const { Router } = require('express');
const router = Router();

const controller = require('./controller');
const authMiddleware = require('../auth/middleware');
const isAdmin = require('../auth/isAdmin');

router.use(authMiddleware);

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.post('/', isAdmin, controller.create);
router.put('/:id', isAdmin, controller.update);
router.delete('/:id', isAdmin, controller.remove);

module.exports = router;
