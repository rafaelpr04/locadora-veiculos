import { useState } from 'react';
import { api } from '../services/api.js';

const inicial = { marca: '', modelo: '', placa: '', ano: '', valorDiaria: '' };

export default function VeiculoForm({ onSucesso, onErro }) {
  const [campos, setCampos] = useState(inicial);
  const [enviando, setEnviando] = useState(false);

  function alterar(evento) {
    setCampos({ ...campos, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    try {
      const veiculo = await api.criarVeiculo(campos);
      setCampos(inicial);
      onSucesso(`Veículo ${veiculo.marca} ${veiculo.modelo} cadastrado.`);
    } catch (erro) {
      onErro(erro);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="painel grade" onSubmit={enviar}>
      <h2>Cadastrar veículo</h2>
      <label>
        Marca
        <input name="marca" value={campos.marca} onChange={alterar} required />
      </label>
      <label>
        Modelo
        <input name="modelo" value={campos.modelo} onChange={alterar} required />
      </label>
      <label>
        Placa
        <input name="placa" value={campos.placa} onChange={alterar} maxLength={8} required />
      </label>
      <label>
        Ano
        <input name="ano" type="number" value={campos.ano} onChange={alterar} required />
      </label>
      <label>
        Valor da diária (R$)
        <input
          name="valorDiaria"
          type="number"
          step="0.01"
          min="0.01"
          value={campos.valorDiaria}
          onChange={alterar}
          required
        />
      </label>
      <button type="submit" disabled={enviando}>
        {enviando ? 'Salvando...' : 'Cadastrar veículo'}
      </button>
    </form>
  );
}
