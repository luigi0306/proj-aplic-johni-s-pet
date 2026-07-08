# Johni's Pet

Projeto acadêmico de pet shop com **backend em Node.js/Express/TypeScript**, **frontend em React + Vite** e **banco PostgreSQL**.

O sistema simula o gerenciamento de clientes, pets, funcionários, serviços, agendamentos, produtos, vendas, insumos, prontuários e animais para adoção.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- Docker Compose
- Zod
- React
- Vite

## Estrutura de pastas

```text
proj-aplic-johni-s-pet/
├── database/              # Scripts SQL do banco de dados
│   ├── schema.sql         # Estrutura do banco
│   └── seed.sql           # Dados iniciais para testes
│
├── public/                # Arquivos públicos servidos pelo frontend
│   ├── favicon.svg
│   ├── icons.svg
│   └── imagens/           # Imagens usadas nas telas
│
├── scripts/               # Scripts auxiliares do projeto
│   ├── setup_db.ts        # Aplica o schema no PostgreSQL
│   └── test_validation.ts # Testes manuais da API
│
├── src/
│   ├── backend/           # API REST
│   │   ├── config/        # Configuração do banco
│   │   ├── controllers/   # Regras das operações da API
│   │   ├── errors/        # Erros customizados
│   │   ├── middlewares/   # Middlewares e validações
│   │   ├── routes/        # Rotas HTTP
│   │   ├── schemas/       # Schemas de validação com Zod
│   │   ├── app.ts         # Configuração do Express
│   │   └── server.ts      # Inicialização do servidor
│   │
│   └── frontend/          # Interface React
│       ├── assets/        # Assets importados pelo React
│       ├── components/    # Componentes reutilizáveis
│       ├── pages/         # Páginas da aplicação
│       ├── App.jsx        # Rotas da interface
│       ├── main.jsx       # Entrada do Vite
│       └── index.css      # Estilos globais
│
├── docker-compose.yml     # PostgreSQL local via Docker
├── index.html             # HTML base do Vite
├── package.json           # Scripts e dependências
├── tsconfig.json          # Configuração TypeScript do backend
└── vite.config.js         # Configuração do frontend
```

## Como rodar

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgres://postgres:postgrespassword@localhost:5432/petshop
PORT=3000
```

Suba o banco de dados:

```bash
docker compose up -d
```

Crie a estrutura do banco:

```bash
npm run db:setup
```

Inicie backend e frontend juntos:

```bash
npm run dev
```

Por padrão:

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Healthcheck: `GET /health`

## Scripts úteis

- `npm run dev`: inicia backend e frontend em modo desenvolvimento.
- `npm run dev:backend`: inicia apenas a API.
- `npm run dev:frontend`: inicia apenas o Vite.
- `npm run build`: compila o backend TypeScript.
- `npm run build:frontend`: gera o build do frontend.
- `npm run db:setup`: aplica `database/schema.sql` no PostgreSQL.
- `npm run lint`: executa o linter.

## Principais endpoints

| Módulo | Endpoint base |
| --- | --- |
| Clientes | `/api/clientes` |
| Pets | `/api/pets` |
| Funcionários | `/api/funcionarios` |
| Serviços | `/api/servicos` |
| Agendamentos | `/api/agendamentos` |
| Produtos | `/api/produtos` |
| Vendas | `/api/vendas` |
| Insumos | `/api/insumos` |
| Prontuários | `/api/prontuarios` |
| Animais para adoção | `/api/animais-adocao` |

## Objetivo acadêmico

O projeto foi desenvolvido para praticar modelagem relacional, criação de tabelas, chaves primárias e estrangeiras, consultas SQL, triggers, funções em PL/pgSQL, API REST, validação de dados e integração entre backend, frontend e PostgreSQL.
