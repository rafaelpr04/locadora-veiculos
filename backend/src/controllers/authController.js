const authService = require('../services/authService');

exports.registrar = async (req, res) => {
  const usuario = await authService.registrar(req.body);
  res.status(201).json(usuario);
};

exports.criarAdmin = async (req, res) => {
  const admin = await authService.criarAdmin(req.body);
  res.status(201).json(admin);
};

exports.listarAdmins = async (req, res) => {
  const admins = await authService.listarAdmins();
  res.json(admins);
};

exports.login = async (req, res) => {
  const resultado = await authService.login(req.body);
  res.json(resultado);
};

exports.perfil = async (req, res) => {
  const usuario = await authService.perfil(req.usuarioId);
  res.json(usuario);
};
