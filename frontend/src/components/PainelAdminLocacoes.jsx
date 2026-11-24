import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from './Notice.jsx';
import { dataHora, moeda } from '../utils/format.js';

export default function PainelAdminLocacoes() {
  const { sair } = useAuth();
  const [locacoes, setLocacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [finalizandoId, setFinalizandoId] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('TODAS');

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await api.listarTodasLocacoes();
      setLocacoes(dados);
    } catch (erro) {
      if (erro.status === 401) sair();
      setMensagem({ tipo: 'erro', texto: erro.message });
    } finally {
      setCarregando(false);
    }
  }, [sair]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function finalizar(id) {
    setFinalizandoId(id);
    try {
      const locacao = await api.finalizarLocacao(id);
      setMensagem({
        tipo: 'sucesso',
        texto: `Locação #${id} finalizada com sucesso! Veículo liberado na frota.`,
      });
      await carregar();
    } catch (erro) {
      if (erro.status === 401) sair();
      setMensagem({ tipo: 'erro', texto: erro.message });
    } finally {
      setFinalizandoId(null);
    }
  }

  const locacoesFiltradas = locacoes.filter((l) => {
    if (filtroStatus === 'TODAS') return true;
    return l.status === filtroStatus;
  });

  const totalLocacoes = locacoes.length;
  const ativas = locacoes.filter((l) => l.status === 'ATIVA').length;
  const finalizadas = locacoes.filter((l) => l.status === 'FINALIZADA').length;
  const receitaTotal = locacoes.reduce((acc, curr) => acc + Number(curr.valorTotal || 0), 0);

  return (
    <section>
      <h2>Painel de Gestão de Locações (Administrador)</h2>
      <Notice mensagem={mensagem} />

      <div className="metricas-grid">
        <div className="card-metrica">
          <span className="metrica-titulo">Total de Locações</span>
          <strong className="metrica-valor">{totalLocacoes}</strong>
        </div>
        <div className="card-metrica">
          <span className="metrica-titulo">Locações Ativas</span>
          <strong className="metrica-valor em-andamento">{ativas}</strong>
        </div>
        <div className="card-metrica">
          <span className="metrica-titulo">Finalizadas</span>
          <strong className="metrica-valor finalizadas">{finalizadas}</strong>
        </div>
        <div className="card-metrica">
          <span className="metrica-titulo">Receita Total</span>
          <strong className="metrica-valor">{moeda(receitaTotal)}</strong>
        </div>
      </div>

      <div className="barra">
        <h3>Histórico Geral de Clientes</h3>
        <div className="filtros">
          <button
            type="button"
            className={filtroStatus === 'TODAS' ? 'filtro-btn ativo' : 'filtro-btn'}
            onClick={() => setFiltroStatus('TODAS')}
          >
            Todas ({totalLocacoes})
          </button>
          <button
            type="button"
            className={filtroStatus === 'ATIVA' ? 'filtro-btn ativo' : 'filtro-btn'}
            onClick={() => setFiltroStatus('ATIVA')}
          >
            Ativas ({ativas})
          </button>
          <button
            type="button"
            className={filtroStatus === 'FINALIZADA' ? 'filtro-btn ativo' : 'filtro-btn'}
            onClick={() => setFiltroStatus('FINALIZADA')}
          >
            Finalizadas ({finalizadas})
          </button>
        </div>
      </div>

      {carregando ? (
        <p className="vazio">Carregando locações...</p>
      ) : locacoesFiltradas.length === 0 ? (
        <p className="vazio">Nenhuma locação encontrada para este filtro.</p>
      ) : (
        <ul className="lista">
          {locacoesFiltradas.map((l) => (
            <li key={l.id} className="item item-admin">
              <div className="detalhes-admin">
                <div className="cabecalho-item">
                  <span className="tag-id">Locação #{l.id}</span>
                  <span className={`selo ${l.status === 'ATIVA' ? 'selo-ok' : 'selo-off'}`}>
                    {l.status === 'ATIVA' ? 'Ativa' : 'Finalizada'}
                  </span>
                </div>

                <div className="info-grupo">
                  <div className="info-bloco">
                    <span className="label-admin">Cliente</span>
                    <strong>{l.usuario?.nome || 'Não informado'}</strong>
                    <span className="meta">{l.usuario?.email}</span>
                  </div>

                  <div className="info-bloco">
                    <span className="label-admin">Veículo</span>
                    <strong>
                      {l.veiculo.marca} {l.veiculo.modelo} ({l.veiculo.ano})
                    </strong>
                    <span className="placa">{l.veiculo.placa}</span>
                  </div>

                  <div className="info-bloco">
                    <span className="label-admin">Período</span>
                    <span className="meta">
                      Início: <strong>{dataHora(l.dataInicio)}</strong>
                    </span>
                    <span className="meta">
                      Prev. Devolução: <strong>{dataHora(l.dataPrevistaDevolucao)}</strong>
                    </span>
                    {l.dataDevolucao && (
                      <span className="meta data-real">
                        Devolvido em: {dataHora(l.dataDevolucao)}
                      </span>
                    )}
                  </div>

                  <div className="info-bloco">
                    <span className="label-admin">Valor Total</span>
                    <span className="valor-destaque">{moeda(l.valorTotal)}</span>
                    <span className="meta">Diária: {moeda(l.veiculo.valorDiaria)}</span>
                  </div>
                </div>
              </div>

              {l.status === 'ATIVA' && (
                <div className="acoes">
                  <button
                    type="button"
                    onClick={() => finalizar(l.id)}
                    disabled={finalizandoId === l.id}
                  >
                    {finalizandoId === l.id ? 'Finalizando...' : 'Encerrar locação'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
