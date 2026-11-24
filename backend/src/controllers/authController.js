const authService = require('../services/authService');

exports.registrar = async (req, res) => {
  const usuario = await authService.registrar(req.body);
  res.status(201).json(usuario);
};

exports.login = async (req, res) => {
  const resultado = await authService.login(req.body);
  res.json(resultado);
};

exports.perfil = async (req, res) => {
  const usuario = await authService.perfil(req.usuarioId);
  res.json(usuario);
};
