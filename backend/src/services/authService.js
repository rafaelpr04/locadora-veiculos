const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publico = { id: true, nome: true, email: true, role: true, criadoEm: true };

async function registrar({ nome, email, senha, role } = {}) {
  if (typeof nome !== 'string' || !nome.trim()) {
    throw new AppError(400, 'Nome é obrigatório');
  }
  if (typeof email !== 'string' || !EMAIL.test(email.trim())) {
    throw new AppError(400, 'E-mail inválido');
  }
  if (typeof senha !== 'string' || senha.length < 6) {
    throw new AppError(400, 'A senha deve ter pelo menos 6 caracteres');
  }

  const roleNormalizada = role === 'ADMIN' ? 'ADMIN' : 'CLIENTE';

  const emailNormalizado = email.trim().toLowerCase();
  const existente = await prisma.usuario.findUnique({ where: { email: emailNormalizado } });
  if (existente) {
    throw new AppError(409, 'E-mail já cadastrado');
  }

  const hash = await bcrypt.hash(senha, 10);
  return prisma.usuario.create({
    data: {
      nome: nome.trim(),
      email: emailNormalizado,
      senha: hash,
      role: roleNormalizada,
    },
    select: publico,
  });
}

async function login({ email, senha } = {}) {
  if (typeof email !== 'string' || typeof senha !== 'string' || !email || !senha) {
    throw new AppError(400, 'E-mail e senha são obrigatórios');
  }

  const usuario = await prisma.usuario.findUnique({ where: { email: email.trim().toLowerCase() } });
  const valido = usuario && (await bcrypt.compare(senha, usuario.senha));
  if (!valido) {
    throw new AppError(401, 'E-mail ou senha inválidos');
  }

  const token = jwt.sign({}, process.env.JWT_SECRET, {
    subject: String(usuario.id),
    expiresIn: '8h',
  });
  const { senha: _senha, ...dados } = usuario;
  return { token, usuario: dados };
}

async function perfil(usuarioId) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId }, select: publico });
  if (!usuario) {
    throw new AppError(404, 'Usuário não encontrado');
  }
  return usuario;
}

module.exports = { registrar, login, perfil };
