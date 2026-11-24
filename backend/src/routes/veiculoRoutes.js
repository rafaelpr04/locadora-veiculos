const { Router } = require('express');
const controller = require('../controllers/veiculoController');
const auth = require('../middlewares/auth');
const adminOnly = require('../middlewares/adminOnly');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(auth);
router.get('/', asyncHandler(controller.listar));
router.post('/', adminOnly, asyncHandler(controller.criar));

module.exports = router;
