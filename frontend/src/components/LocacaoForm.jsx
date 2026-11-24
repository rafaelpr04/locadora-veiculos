import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { moeda } from '../utils/format.js';

export default function LocacaoForm({ veiculos, veiculoIdPreselecionado, onSucesso, onErro }) {
  const [veiculoId, setVeiculoId] = useState(veiculoIdPreselecionado ? String(veiculoIdPreselecionado) : '');
  const [dataInicio, setDataInicio] = useState('');
  const [dataPrevista, setDataPrevista] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (veiculoIdPreselecionado) {
      setVeiculoId(String(veiculoIdPreselecionado));
    }
  }, [veiculoIdPreselecionado]);

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    try {
      const locacao = await api.criarLocacao({
        veiculoId: Number(veiculoId),
        dataInicio: new Date(dataInicio).toISOString(),
        dataPrevistaDevolucao: new Date(dataPrevista).toISOString(),
      });
      setVeiculoId('');
      setDataInicio('');
      setDataPrevista('');
      onSucesso(`Locação registrada. Valor total: ${moeda(locacao.valorTotal)}.`);
    } catch (erro) {
      onErro(erro);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="painel grade" onSubmit={enviar}>
      <h2>Nova locação</h2>
      <label>
        Veículo
        <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)} required>
          <option value="">Selecione um veículo disponível</option>
          {veiculos.map((v) => (
            <option key={v.id} value={v.id}>
              {v.marca} {v.modelo} ({v.placa}) - {moeda(v.valorDiaria)}/dia
            </option>
          ))}
        </select>
      </label>
      <label>
        Início
        <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
      </label>
      <label>
        Devolução prevista
        <input type="datetime-local" value={dataPrevista} onChange={(e) => setDataPrevista(e.target.value)} required />
      </label>
      <button type="submit" disabled={enviando || veiculos.length === 0}>
        {enviando ? 'Registrando...' : 'Registrar locação'}
      </button>
      {veiculos.length === 0 && <p className="vazio">Não há veículos disponíveis no momento.</p>}
    </form>
  );
}
