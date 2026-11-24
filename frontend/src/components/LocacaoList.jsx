import { dataHora, moeda } from '../utils/format.js';

export default function LocacaoList({ locacoes, onFinalizar, finalizandoId }) {
  if (locacoes.length === 0) {
    return <p className="vazio">Você ainda não tem locações. Registre a primeira acima.</p>;
  }

  return (
    <ul className="lista">
      {locacoes.map((l) => (
        <li key={l.id} className="item">
          <div>
            <strong>
              {l.veiculo.marca} {l.veiculo.modelo}
            </strong>
            <span className="placa">{l.veiculo.placa}</span>
            <span className="meta">
              {dataHora(l.dataInicio)} até {dataHora(l.dataPrevistaDevolucao)}
            </span>
            {l.dataDevolucao && <span className="meta">Devolvido em {dataHora(l.dataDevolucao)}</span>}
            <span className="valor">{moeda(l.valorTotal)}</span>
          </div>
          <div className="acoes">
            <span className={`selo ${l.status === 'ATIVA' ? 'selo-ok' : 'selo-off'}`}>
              {l.status === 'ATIVA' ? 'Ativa' : 'Finalizada'}
            </span>
            {l.status === 'ATIVA' && (
              <button type="button" onClick={() => onFinalizar(l.id)} disabled={finalizandoId === l.id}>
                {finalizandoId === l.id ? 'Finalizando...' : 'Devolver veículo'}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
