const AppError = require('../utils/AppError');

module.exports = (erro, req, res, next) => {
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message });
  }
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }
  if (erro.code === 'P2002') {
    return res.status(409).json({ erro: 'Registro duplicado' });
  }
  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
};
