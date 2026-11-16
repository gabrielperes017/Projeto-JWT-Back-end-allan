const {Router} = require('express');
const router = Router();

const userController = require('./controller');
const authMiddleware = require('../auth/middleware');
const isAdmin = require('../auth/isAdmin');

router.use(authMiddleware, isAdmin);

router.post('/', userController.create);
router.get('/:id', userController.findById);
router.get('/email/:email', userController.findByEmail);
router.get('/', userController.findAll);
router.put('/:id', userController.update);
router.patch('/:id/active', userController.setActive);

module.exports = router;
