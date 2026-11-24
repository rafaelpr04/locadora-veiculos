const veiculoService = require('../services/veiculoService');

exports.criar = async (req, res) => {
  const veiculo = await veiculoService.criar(req.body);
  res.status(201).json(veiculo);
};

exports.listar = async (req, res) => {
  const apenasDisponiveis = req.usuarioRole === 'ADMIN' ? req.query.disponivel : 'true';
  const veiculos = await veiculoService.listar({ disponivel: apenasDisponiveis });
  res.json(veiculos);
};
