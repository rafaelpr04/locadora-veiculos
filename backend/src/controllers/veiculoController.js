const veiculoService = require('../services/veiculoService');

exports.criar = async (req, res) => {
  const veiculo = await veiculoService.criar(req.body);
  res.status(201).json(veiculo);
};

exports.listar = async (req, res) => {
  const veiculos = await veiculoService.listar({ disponivel: req.query.disponivel });
  res.json(veiculos);
};
