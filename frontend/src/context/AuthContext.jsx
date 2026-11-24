import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api
      .perfil()
      .then(setUsuario)
      .catch(() => setToken(null))
      .finally(() => setCarregando(false));
  }, []);

  const entrar = useCallback(async (email, senha) => {
    const { token, usuario: dados } = await api.login({ email, senha });
    setToken(token);
    setUsuario(dados);
  }, []);

  const cadastrar = useCallback(
    async (nome, email, senha) => {
      await api.registrar({ nome, email, senha });
      await entrar(email, senha);
    },
    [entrar]
  );

  const sair = useCallback(() => {
    setToken(null);
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
