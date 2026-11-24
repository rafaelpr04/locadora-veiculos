const BASE = import.meta.env.VITE_API_URL || '/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

async function request(caminho, { method = 'GET', body } = {}) {
  const headers = {};
  const token = getToken();
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let resposta;
  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o servidor está rodando.');
  }

  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const erro = new Error(dados?.erro || 'Erro inesperado');
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

export const api = {
  registrar: (dados) => request('/auth/registrar', { method: 'POST', body: dados }),
  criarAdmin: (dados) => request('/auth/admin', { method: 'POST', body: dados }),
  listarAdmins: () => request('/auth/admins'),
  login: (dados) => request('/auth/login', { method: 'POST', body: dados }),
  perfil: () => request('/auth/perfil'),
  listarVeiculos: (somenteDisponiveis) =>
    request(`/veiculos${somenteDisponiveis ? '?disponivel=true' : ''}`),
  criarVeiculo: (dados) => request('/veiculos', { method: 'POST', body: dados }),
  listarLocacoes: () => request('/locacoes'),
  listarTodasLocacoes: () => request('/locacoes/todas'),
  criarLocacao: (dados) => request('/locacoes', { method: 'POST', body: dados }),
  finalizarLocacao: (id) => request(`/locacoes/${id}/finalizar`, { method: 'PATCH' }),
};
