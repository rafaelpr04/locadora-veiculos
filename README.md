# Sistema de Locação de Veículos

API REST em Node.js + Express com Prisma ORM e MySQL, autenticação JWT e interface em React (Vite).

## Estrutura

```
backend/
  prisma/            schema.prisma e migrations versionadas
  src/
    routes/          mapeamento dos endpoints
    controllers/     entrada e resposta HTTP
    services/        validações e regras de negócio
    middlewares/     autenticação JWT e tratamento de erros
    config/          cliente Prisma
    utils/           AppError, asyncHandler, parseId
frontend/
  src/
    components/      formulários, listas e mensagens
    pages/           telas de Veículos e Locações
    context/         estado de autenticação
    services/        cliente HTTP (fetch)
docs/                guia para os diagramas manuscritos
```

## Como executar

Pré-requisitos: Node.js 18+ e MySQL em execução.

### Backend

```
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Edite o `.env` com a sua string de conexão (`DATABASE_URL`) e um `JWT_SECRET`. O banco `locadora` é criado pelo Prisma caso o usuário tenha permissão; caso contrário, crie-o antes com `CREATE DATABASE locadora;`. A API sobe em `http://localhost:3333`.

### Frontend

```
cd frontend
npm install
npm run dev
```

A interface abre em `http://localhost:5173`. O Vite redireciona `/api` para a API, então não há problema de CORS em desenvolvimento. Para apontar para outra URL, defina `VITE_API_URL`.

## Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | /auth/registrar | não | Cadastra usuário (nome, email, senha) |
| POST | /auth/login | não | Retorna `{ token, usuario }` |
| GET | /auth/perfil | sim | Usuário autenticado |
| POST | /veiculos | sim | Cadastra veículo |
| GET | /veiculos | sim | Lista veículos; `?disponivel=true` filtra disponíveis |
| POST | /locacoes | sim | Registra locação (`veiculoId`, `dataInicio`, `dataPrevistaDevolucao`) |
| GET | /locacoes | sim | Histórico do usuário autenticado, com dados do veículo |
| PATCH | /locacoes/:id/finalizar | sim | Registra devolução e libera o veículo |

Rotas protegidas exigem o header `Authorization: Bearer <token>`.

Códigos usados: 200, 201, 400 (validação), 401 (autenticação), 403 (locação de outro usuário), 404 (inexistente), 409 (conflito: e-mail ou placa duplicados, veículo indisponível, locação já finalizada), 500.

## Decisões de projeto

- **Camadas**: rotas apenas mapeiam endpoints; controllers tratam a requisição e a resposta; services concentram validações e regras; o acesso ao banco é feito pelo Prisma.
- **Senhas**: armazenadas com bcrypt (10 rounds); o hash nunca é retornado (uso de `select`/remoção do campo).
- **Identidade do usuário**: vem do `sub` do JWT validado pelo middleware, que também confirma que o usuário ainda existe. O cliente nunca envia `usuarioId`.
- **Valor total**: calculado no backend, `ceil((devolução prevista - início) / 24h) * valorDiaria`, ou seja, qualquer fração de 24 horas conta como diária completa. O valor é fixado no registro da locação.
- **Consistência em requisições simultâneas**: o registro da locação roda em transação e reserva o veículo com `updateMany({ where: { id, disponivel: true } })`. Como a atualização é atômica, apenas uma requisição consegue reservar; as demais recebem 409. A finalização usa o mesmo princípio sobre `status = ATIVA`, evitando finalizar duas vezes.
- **Disponibilidade**: o veículo fica indisponível ao iniciar a locação e volta a ficar disponível na devolução.
- **Histórico**: nada é excluído. As chaves estrangeiras usam `ON DELETE RESTRICT`.
- **Status da locação**: `ATIVA` enquanto não houver devolução; `FINALIZADA` depois.
- **Frontend**: React com componentes, estados e formulários controlados; token em `localStorage`; ao receber 401 a interface encerra a sessão. Todos os dados vêm da API via `fetch`.
- **Código sem comentários**, conforme exigido; as decisões estão neste README.

## Migrations

A migration inicial está em `backend/prisma/migrations/20261124000000_init`. Para criar novas alterações durante o desenvolvimento use `npm run migrate:dev`.

## Diagramas

Os diagramas (DER e sequência) são manuscritos e individuais. O guia em `docs/DIAGRAMAS.md` lista o conteúdo que deve aparecer em cada um, correspondente ao que foi implementado.
