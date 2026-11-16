# jwt-api — Sistema de Biblioteca (back-end)

Node.js + Express 5 + Sequelize + SQLite + JWT (access token + refresh token).

## Instalar

```bash
npm install
cp .envex .env      # Windows: copy .envex .env
npm start
```

Variáveis do `.env`:

| Variável | Descrição |
|---|---|
| `JWT_SECRET` | chave do access token |
| `JWT_REFRESH_SECRET` | chave do refresh token (diferente da anterior) |
| `PORT` | porta da API (3001; o front Next.js usa a 3000) |
| `CORS_ORIGIN` | origem do front (padrão `http://localhost:3000`) |
| `ACCESS_TOKEN_EXPIRES` | validade do access token (padrão `15m`; use `30s` para demonstrar o refresh) |

O banco `database.sqlite` é criado sozinho ao iniciar (não é versionado).

## Admin do seed

Criado ao iniciar se não existir nenhum administrador:

- e-mail: `admin@biblioteca.com`
- senha: `123456`

## Estrutura

`auth/`, `user/`, `category/`, `author/`, `book/`, `reader/`, `loan/`, `report/`, cada um com router → controller → service → model. As associações ficam em `models/index.js`.

## Endpoints

Todos exigem `Authorization: Bearer <accessToken>`, exceto login, refresh e logout. (A) = somente administrador.

| Rota | Descrição |
|---|---|
| `POST /v1/auth/login` | retorna `{ accessToken, refreshToken, user }` |
| `POST /v1/auth/refresh` | `{ refreshToken }` → novo par (rotação) |
| `POST /v1/auth/logout` | `{ refreshToken }` → revoga |
| `GET /v1/auth/me` | usuário logado |
| `GET/POST /v1/user`, `PUT /v1/user/:id`, `PATCH /v1/user/:id/active` | atendentes (A) |
| `/v1/categories`, `/v1/authors`, `/v1/books` | GET livre; POST/PUT/DELETE (A) |
| `GET /v1/books?title=&categoryId=&authorId=&available=true` | busca com filtros |
| `GET/POST/PUT /v1/readers`, `GET /v1/readers/:id/loans` | leitores e histórico |
| `POST /v1/loans`, `PATCH /v1/loans/:id/return`, `GET /v1/loans?status=` | empréstimos |
| `GET /v1/reports/dashboard` | totais (A) |

Coleção de testes: `biblioteca.postman_collection.json` (importa no Insomnia e no Postman).

## Decisões

- **Refresh token**: JWT assinado com `JWT_REFRESH_SECRET`, 7 dias, salvo na tabela `RefreshTokens`. A cada refresh o token antigo é revogado e um novo par é emitido. Reuso de token já revogado revoga todos os tokens do usuário.
- **`logout_list` removida**: o logout revoga o refresh token. O access token vive 15 min e não é invalidado antes do fim (aceito pela curta duração).
- **401 vs 403**: token ausente/inválido/expirado responde 401 (o front renova); atendente em rota de admin responde 403.
- **Atendente inativo**: não faz login nem renova token.
- **Status do empréstimo**: gravado como `ATIVO` ou `DEVOLVIDO`; `ATRASADO` é calculado na leitura (`dueDate < agora` e sem devolução).
- **Multa**: R$ 1,00 por dia de atraso iniciado (`ceil` dos dias).
- **Exclusões**: categoria/autor com livros e livro com empréstimos respondem `409`.
- **Senha**: o hash nunca é retornado nas consultas.
- **Dashboard**: `activeLoans` = não devolvidos e no prazo; `overdueLoans` = não devolvidos e vencidos; `totalBooks` = quantidade de títulos.
- O `database.sqlite` foi removido do repositório e adicionado ao `.gitignore`.
