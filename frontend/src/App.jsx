import { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import AuthForm from './components/AuthForm.jsx';
import VeiculosPage from './pages/VeiculosPage.jsx';
import LocacoesPage from './pages/LocacoesPage.jsx';

export default function App() {
  const { usuario, carregando, sair } = useAuth();
  const [aba, setAba] = useState('locacoes');

  if (carregando) {
    return <p className="vazio">Carregando...</p>;
  }

  if (!usuario) {
    return <AuthForm />;
  }

  return (
    <>
      <header className="topo">
        <h1 className="marca">Locadora</h1>
        <nav>
          <button className={aba === 'locacoes' ? 'aba ativa' : 'aba'} onClick={() => setAba('locacoes')}>
            Locações
          </button>
          <button className={aba === 'veiculos' ? 'aba ativa' : 'aba'} onClick={() => setAba('veiculos')}>
            Veículos
          </button>
        </nav>
        <div className="sessao">
          <span>{usuario.nome}</span>
          <button className="link" onClick={sair}>
            Sair
          </button>
        </div>
      </header>
      <main className="conteudo">{aba === 'veiculos' ? <VeiculosPage /> : <LocacoesPage />}</main>
    </>
  );
}
