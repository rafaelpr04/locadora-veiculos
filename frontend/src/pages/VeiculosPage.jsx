import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from '../components/Notice.jsx';
import VeiculoForm from '../components/VeiculoForm.jsx';
import VeiculoList from '../components/VeiculoList.jsx';

export default function VeiculosPage() {
  const { sair } = useAuth();
  const [veiculos, setVeiculos] = useState([]);
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const tratarErro = useCallback(
    (erro) => {
      if (erro.status === 401) sair();
      setMensagem({ tipo: 'erro', texto: erro.message });
    },
    [sair]
  );

  const carregar = useCallback(async () => {
    try {
      setVeiculos(await api.listarVeiculos(somenteDisponiveis));
    } catch (erro) {
      tratarErro(erro);
    }
  }, [somenteDisponiveis, tratarErro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function aoCadastrar(texto) {
    setMensagem({ tipo: 'sucesso', texto });
    await carregar();
  }

  return (
    <section>
      <VeiculoForm onSucesso={aoCadastrar} onErro={tratarErro} />
      <Notice mensagem={mensagem} />
      <div className="barra">
        <h2>Frota</h2>
        <label className="check">
          <input
            type="checkbox"
            checked={somenteDisponiveis}
            onChange={(e) => setSomenteDisponiveis(e.target.checked)}
          />
          Somente disponíveis
        </label>
      </div>
      <VeiculoList veiculos={veiculos} />
    </section>
  );
}
