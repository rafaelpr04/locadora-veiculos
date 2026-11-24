const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  if (req.usuarioRole !== 'ADMIN') {
    return next(new AppError(403, 'Acesso restrito a administradores'));
  }
  next();
};
