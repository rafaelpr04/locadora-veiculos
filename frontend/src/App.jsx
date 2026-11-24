import { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import AuthForm from './components/AuthForm.jsx';
import VeiculosPage from './pages/VeiculosPage.jsx';
import LocacoesPage from './pages/LocacoesPage.jsx';
import PainelAdminLocacoes from './components/PainelAdminLocacoes.jsx';

export default function App() {
  const { usuario, carregando, sair } = useAuth();
  const isAdmin = usuario?.role === 'ADMIN';

  const [aba, setAba] = useState(isAdmin ? 'painel' : 'veiculos');
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

  if (carregando) {
    return <p className="vazio">Carregando...</p>;
  }

  if (!usuario) {
    return <AuthForm />;
  }

  function handleAlugar(id) {
    setVeiculoSelecionado(id);
    setAba('locacoes');
  }

  return (
    <>
      <header className="topo">
        <h1 className="marca">Locadora</h1>
        <nav>
          {isAdmin ? (
            <>
              <button
                className={aba === 'painel' ? 'aba ativa' : 'aba'}
                onClick={() => setAba('painel')}
              >
                Painel de Locações
              </button>
              <button
                className={aba === 'veiculos' ? 'aba ativa' : 'aba'}
                onClick={() => setAba('veiculos')}
              >
                Gestão da Frota
              </button>
              <button
                className={aba === 'locacoes' ? 'aba ativa' : 'aba'}
                onClick={() => setAba('locacoes')}
              >
                Minhas Locações
              </button>
            </>
          ) : (
            <>
              <button
                className={aba === 'veiculos' ? 'aba ativa' : 'aba'}
                onClick={() => setAba('veiculos')}
              >
                Veículos Disponíveis
              </button>
              <button
                className={aba === 'locacoes' ? 'aba ativa' : 'aba'}
                onClick={() => setAba('locacoes')}
              >
                Alugar / Minhas Locações
              </button>
            </>
          )}
        </nav>
        <div className="sessao">
          <div className="usuario-info">
            <span className="usuario-nome">{usuario.nome}</span>
            <span className={`tag-role ${isAdmin ? 'tag-admin' : 'tag-cliente'}`}>
              {isAdmin ? 'Administrador' : 'Cliente'}
            </span>
          </div>
          <button className="link" onClick={sair}>
            Sair
          </button>
        </div>
      </header>
      <main className="conteudo">
        {isAdmin && aba === 'painel' && <PainelAdminLocacoes />}
        {aba === 'veiculos' && <VeiculosPage onAlugar={handleAlugar} />}
        {aba === 'locacoes' && (
          <LocacoesPage veiculoIdPreselecionado={veiculoSelecionado} />
        )}
      </main>
    </>
  );
}
