const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

const DIA_EM_MS = 24 * 60 * 60 * 1000;

const incluirVeiculo = {
  veiculo: {
    select: { id: true, marca: true, modelo: true, placa: true, ano: true, valorDiaria: true },
  },
};

function lerData(valor, campo) {
  const data = new Date(valor);
  if (valor === undefined || valor === null || valor === '' || Number.isNaN(data.getTime())) {
    throw new AppError(400, `${campo} inválida`);
  }
  return data;
}

async function criar(usuarioId, { veiculoId, dataInicio, dataPrevistaDevolucao } = {}) {
  const idVeiculo = Number(veiculoId);
  if (!Number.isInteger(idVeiculo) || idVeiculo <= 0) {
    throw new AppError(400, 'Veículo inválido');
  }

  const inicio = lerData(dataInicio, 'Data de início');
  const fim = lerData(dataPrevistaDevolucao, 'Data prevista de devolução');
  if (fim <= inicio) {
    throw new AppError(400, 'A data prevista de devolução deve ser posterior à data de início');
  }

  const veiculo = await prisma.veiculo.findUnique({ where: { id: idVeiculo } });
  if (!veiculo) {
    throw new AppError(404, 'Veículo não encontrado');
  }
  if (!veiculo.disponivel) {
    throw new AppError(409, 'Veículo indisponível para locação');
  }

  const diarias = Math.ceil((fim.getTime() - inicio.getTime()) / DIA_EM_MS);
  const valorTotal = veiculo.valorDiaria.mul(diarias);

  return prisma.$transaction(async (tx) => {
    const reserva = await tx.veiculo.updateMany({
      where: { id: idVeiculo, disponivel: true },
      data: { disponivel: false },
    });
    if (reserva.count === 0) {
      throw new AppError(409, 'Veículo indisponível para locação');
    }

    return tx.locacao.create({
      data: {
        usuarioId,
        veiculoId: idVeiculo,
        dataInicio: inicio,
        dataPrevistaDevolucao: fim,
        valorTotal,
      },
      include: incluirVeiculo,
    });
  });
}

async function listar(usuarioId) {
  return prisma.locacao.findMany({
    where: { usuarioId },
    include: incluirVeiculo,
    orderBy: { id: 'desc' },
  });
}

async function finalizar(usuarioId, id) {
  const locacao = await prisma.locacao.findUnique({ where: { id } });
  if (!locacao) {
    throw new AppError(404, 'Locação não encontrada');
  }
  if (locacao.usuarioId !== usuarioId) {
    throw new AppError(403, 'Você não tem permissão para finalizar esta locação');
  }
  if (locacao.status === 'FINALIZADA') {
    throw new AppError(409, 'Locação já finalizada');
  }

  return prisma.$transaction(async (tx) => {
    const encerramento = await tx.locacao.updateMany({
      where: { id, status: 'ATIVA' },
      data: { status: 'FINALIZADA', dataDevolucao: new Date() },
    });
    if (encerramento.count === 0) {
      throw new AppError(409, 'Locação já finalizada');
    }

    await tx.veiculo.update({ where: { id: locacao.veiculoId }, data: { disponivel: true } });

    return tx.locacao.findUnique({ where: { id }, include: incluirVeiculo });
  });
}

module.exports = { criar, listar, finalizar };
