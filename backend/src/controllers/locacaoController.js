const locacaoService = require('../services/locacaoService');
const parseId = require('../utils/parseId');

exports.criar = async (req, res) => {
  const locacao = await locacaoService.criar(req.usuarioId, req.body);
  res.status(201).json(locacao);
};

exports.listar = async (req, res) => {
  const locacoes = await locacaoService.listar(req.usuarioId);
  res.json(locacoes);
};

exports.finalizar = async (req, res) => {
  const locacao = await locacaoService.finalizar(req.usuarioId, parseId(req.params.id));
  res.json(locacao);
};
