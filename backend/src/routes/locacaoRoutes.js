const { Router } = require('express');
const controller = require('../controllers/locacaoController');
const auth = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(auth);
router.get('/', asyncHandler(controller.listar));
router.post('/', asyncHandler(controller.criar));
router.patch('/:id/finalizar', asyncHandler(controller.finalizar));

module.exports = router;
