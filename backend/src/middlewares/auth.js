const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

module.exports = async (req, res, next) => {
  try {
    const [tipo, token] = (req.headers.authorization || '').split(' ');
    if (tipo !== 'Bearer' || !token) {
      throw new AppError(401, 'Token de autenticação não informado');
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new AppError(401, 'Token inválido ou expirado');
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true },
    });
    if (!usuario) {
      throw new AppError(401, 'Usuário do token não existe mais');
    }

    req.usuarioId = usuario.id;
    next();
  } catch (erro) {
    next(erro);
  }
};
