import { moeda } from '../utils/format.js';

export default function VeiculoList({ veiculos, onAlugar, isAdmin }) {
  if (veiculos.length === 0) {
    return (
      <p className="vazio">
        {isAdmin
          ? 'Nenhum veículo cadastrado na frota. Cadastre o primeiro no formulário acima.'
          : 'Nenhum veículo disponível para locação no momento.'}
      </p>
    );
  }

  return (
    <ul className="lista">
      {veiculos.map((v) => (
        <li key={v.id} className="item">
          <div>
            <strong>
              {v.marca} {v.modelo}
            </strong>
            <span className="placa">{v.placa}</span>
            <span className="meta">
              {v.ano} • {moeda(v.valorDiaria)} por dia
            </span>
          </div>
          <div className="acoes">
            <span className={`selo ${v.disponivel ? 'selo-ok' : 'selo-off'}`}>
              {v.disponivel ? 'Disponível' : 'Alugado'}
            </span>
            {onAlugar && v.disponivel && (
              <button type="button" onClick={() => onAlugar(v.id)}>
                Alugar carro
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
