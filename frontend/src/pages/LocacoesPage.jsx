import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from '../components/Notice.jsx';
import LocacaoForm from '../components/LocacaoForm.jsx';
import LocacaoList from '../components/LocacaoList.jsx';
import { moeda } from '../utils/format.js';

export default function LocacoesPage({ veiculoIdPreselecionado }) {
  const { sair } = useAuth();
  const [locacoes, setLocacoes] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [finalizandoId, setFinalizandoId] = useState(null);

  const tratarErro = useCallback(
    (erro) => {
      if (erro.status === 401) sair();
      setMensagem({ tipo: 'erro', texto: erro.message });
    },
    [sair]
  );

  const carregar = useCallback(async () => {
    try {
      const [listaLocacoes, listaVeiculos] = await Promise.all([
        api.listarLocacoes(),
        api.listarVeiculos(true),
      ]);
      setLocacoes(listaLocacoes);
      setDisponiveis(listaVeiculos);
    } catch (erro) {
      tratarErro(erro);
    }
  }, [tratarErro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function aoRegistrar(texto) {
    setMensagem({ tipo: 'sucesso', texto });
    await carregar();
  }

  async function finalizar(id) {
    setFinalizandoId(id);
    try {
      const locacao = await api.finalizarLocacao(id);
      setMensagem({
        tipo: 'sucesso',
        texto: `Veículo devolvido. Valor total: ${moeda(locacao.valorTotal)}.`,
      });
      await carregar();
    } catch (erro) {
      tratarErro(erro);
      await carregar();
    } finally {
      setFinalizandoId(null);
    }
  }

  async function aoFalhar(erro) {
    tratarErro(erro);
    await carregar();
  }

  return (
    <section>
      <LocacaoForm
        veiculos={disponiveis}
        veiculoIdPreselecionado={veiculoIdPreselecionado}
        onSucesso={aoRegistrar}
        onErro={aoFalhar}
      />
      <Notice mensagem={mensagem} />
      <h2>Minhas Locações</h2>
      <LocacaoList locacoes={locacoes} onFinalizar={finalizar} finalizandoId={finalizandoId} />
    </section>
  );
}
