import { moeda } from '../utils/format.js';

export default function VeiculoList({ veiculos }) {
  if (veiculos.length === 0) {
    return <p className="vazio">Nenhum veículo encontrado. Cadastre o primeiro no formulário acima.</p>;
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
          <span className={`selo ${v.disponivel ? 'selo-ok' : 'selo-off'}`}>
            {v.disponivel ? 'Disponível' : 'Alugado'}
          </span>
        </li>
      ))}
    </ul>
  );
}
