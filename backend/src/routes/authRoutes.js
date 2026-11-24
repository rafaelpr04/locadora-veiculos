const { Router } = require('express');
const controller = require('../controllers/authController');
const auth = require('../middlewares/auth');
const adminOnly = require('../middlewares/adminOnly');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.post('/registrar', asyncHandler(controller.registrar));
router.post('/admin', auth, adminOnly, asyncHandler(controller.criarAdmin));
router.get('/admins', auth, adminOnly, asyncHandler(controller.listarAdmins));
router.post('/login', asyncHandler(controller.login));
router.get('/perfil', auth, asyncHandler(controller.perfil));

module.exports = router;
