import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from '../components/Notice.jsx';
import VeiculoForm from '../components/VeiculoForm.jsx';
import VeiculoList from '../components/VeiculoList.jsx';

export default function VeiculosPage({ onAlugar }) {
  const { usuario, sair } = useAuth();
  const isAdmin = usuario?.role === 'ADMIN';

  const [veiculos, setVeiculos] = useState([]);
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(!isAdmin);
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
      // Cliente sempre lista apenas disponíveis
      const filtrarDisponiveis = isAdmin ? somenteDisponiveis : true;
      setVeiculos(await api.listarVeiculos(filtrarDisponiveis));
    } catch (erro) {
      tratarErro(erro);
    }
  }, [isAdmin, somenteDisponiveis, tratarErro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function aoCadastrar(texto) {
    setMensagem({ tipo: 'sucesso', texto });
    await carregar();
  }

  return (
    <section>
      {isAdmin ? (
        <>
          <VeiculoForm onSucesso={aoCadastrar} onErro={tratarErro} />
          <Notice mensagem={mensagem} />
          <div className="barra">
            <h2>Gestão da Frota de Veículos</h2>
            <label className="check">
              <input
                type="checkbox"
                checked={somenteDisponiveis}
                onChange={(e) => setSomenteDisponiveis(e.target.checked)}
              />
              Somente disponíveis
            </label>
          </div>
        </>
      ) : (
        <>
          <Notice mensagem={mensagem} />
          <div className="barra">
            <h2>Veículos Disponíveis para Locação</h2>
            <span className="meta">{veiculos.length} veículos prontos para retirada</span>
          </div>
        </>
      )}

      <VeiculoList veiculos={veiculos} onAlugar={onAlugar} isAdmin={isAdmin} />
    </section>
  );
}
