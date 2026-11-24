const { Router } = require('express');
const authRoutes = require('./authRoutes');
const veiculoRoutes = require('./veiculoRoutes');
const locacaoRoutes = require('./locacaoRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/veiculos', veiculoRoutes);
router.use('/locacoes', locacaoRoutes);

module.exports = router;
