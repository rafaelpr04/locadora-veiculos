const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

async function criar({ marca, modelo, placa, ano, valorDiaria } = {}) {
  if (typeof marca !== 'string' || !marca.trim()) {
    throw new AppError(400, 'Marca é obrigatória');
  }
  if (typeof modelo !== 'string' || !modelo.trim()) {
    throw new AppError(400, 'Modelo é obrigatório');
  }
  if (typeof placa !== 'string' || !/^[A-Za-z0-9-]{7,8}$/.test(placa.trim())) {
    throw new AppError(400, 'Placa inválida');
  }

  const anoNumero = Number(ano);
  const limite = new Date().getFullYear() + 1;
  if (!Number.isInteger(anoNumero) || anoNumero < 1950 || anoNumero > limite) {
    throw new AppError(400, `Ano deve estar entre 1950 e ${limite}`);
  }

  const diaria = Number(valorDiaria);
  if (!Number.isFinite(diaria) || diaria <= 0) {
    throw new AppError(400, 'O valor da diária deve ser positivo');
  }

  const placaNormalizada = placa.trim().toUpperCase();
  const existente = await prisma.veiculo.findUnique({ where: { placa: placaNormalizada } });
  if (existente) {
    throw new AppError(409, 'Placa já cadastrada');
  }

  return prisma.veiculo.create({
    data: {
      marca: marca.trim(),
      modelo: modelo.trim(),
      placa: placaNormalizada,
      ano: anoNumero,
      valorDiaria: diaria.toFixed(2),
    },
  });
}

async function listar({ disponivel } = {}) {
  const where = disponivel === 'true' ? { disponivel: true } : {};
  return prisma.veiculo.findMany({ where, orderBy: { id: 'desc' } });
}

module.exports = { criar, listar };
