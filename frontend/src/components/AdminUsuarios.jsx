import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Notice from './Notice.jsx';
import { dataHora } from '../utils/format.js';

export default function AdminUsuarios() {
  const { sair } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const lista = await api.listarAdmins();
      setAdmins(lista);
    } catch (erro) {
      if (erro.status === 401) sair();
      setMensagem({ tipo: 'erro', texto: erro.message });
    } finally {
      setCarregando(false);
    }
  }, [sair]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function enviar(evento) {
    evento.preventDefault();
    setMensagem(null);
    setEnviando(true);
    try {
      const novoAdmin = await api.criarAdmin({ nome, email, senha });
      setNome('');
      setEmail('');
      setSenha('');
      setMensagem({
        tipo: 'sucesso',
        texto: `Administrador "${novoAdmin.nome}" (${novoAdmin.email}) cadastrado com sucesso!`,
      });
      await carregar();
    } catch (erro) {
      if (erro.status === 401) sair();
      setMensagem({ tipo: 'erro', texto: erro.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section>
      <form className="painel grade" onSubmit={enviar}>
        <h2>Cadastrar Novo Administrador</h2>
        <label>
          Nome
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do administrador"
            required
          />
        </label>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@exemplo.com"
            required
          />
        </label>
        <label>
          Senha de Acesso
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Cadastrando...' : 'Cadastrar Administrador'}
        </button>
      </form>

      <Notice mensagem={mensagem} />

      <div className="barra">
        <h2>Equipe de Administradores ({admins.length})</h2>
      </div>

      {carregando ? (
        <p className="vazio">Carregando administradores...</p>
      ) : admins.length === 0 ? (
        <p className="vazio">Nenhum administrador encontrado.</p>
      ) : (
        <ul className="lista">
          {admins.map((adm) => (
            <li key={adm.id} className="item">
              <div>
                <strong>{adm.nome}</strong>
                <span className="meta">{adm.email}</span>
                <span className="meta">Cadastrado em: {dataHora(adm.criadoEm)}</span>
              </div>
              <span className="selo selo-ok">Administrador Ativo</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
