const AppError = require('./AppError');

module.exports = (valor) => {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'Identificador inválido');
  }
  return id;
};
