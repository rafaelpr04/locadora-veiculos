import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from './Notice.jsx';

export default function AuthForm() {
  const { entrar, cadastrar } = useAuth();
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cadastro = modo === 'cadastro';

  async function enviar(evento) {
    evento.preventDefault();
    setMensagem(null);
    setEnviando(true);
    try {
      if (cadastro) {
        await cadastrar(nome, email, senha);
      } else {
        await entrar(email, senha);
      }
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: erro.message });
    } finally {
      setEnviando(false);
    }
  }

  function alternar() {
    setModo(cadastro ? 'login' : 'cadastro');
    setMensagem(null);
  }

  return (
    <main className="auth">
      <h1 className="marca">Locadora</h1>
      <form className="painel" onSubmit={enviar}>
        <h2>{cadastro ? 'Criar conta' : 'Entrar'}</h2>
        {cadastro && (
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} required />
          </label>
        )}
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <Notice mensagem={mensagem} />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Aguarde...' : cadastro ? 'Criar conta' : 'Entrar'}
        </button>
        <button type="button" className="link" onClick={alternar}>
          {cadastro ? 'Já tenho conta' : 'Ainda não tenho conta'}
        </button>
      </form>
    </main>
  );
}
