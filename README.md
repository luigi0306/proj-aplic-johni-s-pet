# CHEW!! 🐾

Site de e-commerce e serviços para pet shop, desenvolvido em **React + Vite** no frontend e **Node.js/Express/TypeScript + PostgreSQL** no backend, com foco em experiência de usuário fofa, moderna e funcional.

Projeto pessoal de portfólio, desenvolvido como parte da disciplina de Projeto Aplicado para Banco de Dados/Sistemas.

## 🚀 Tecnologias utilizadas

* React 19
* Vite
* React Router DOM
* Node.js + Express + TypeScript
* PostgreSQL
* Zod
* LocalStorage (persistência temporária de carrinho, login e pedidos no frontend, enquanto a integração completa com o backend está em andamento)

---

## ✨ Funcionalidades

### Área do cliente
* **Home** — hero animado, carrossel de categorias, destaques de serviços, depoimentos de clientes
* **Veterinária** — consultas, vacinas, destaques do serviço com cards interativos
* **Tosa e Banho** — serviços de banho, tosa e coloração de pelos
* **Adoção** — catálogo de pets disponíveis
* **Produtos** — catálogo completo por categoria (cachorro, gato, pássaro, hamster), com seções de ração, banho, brinquedos, acessórios e roupinhas
* **Login/Cadastro** — autenticação simulada no frontend, com formulários de entrar e criar conta
* **Carrinho** — carrinho de compras completo, com escolha de método de pagamento (cartão, Pix, boleto) e confirmação de pedido

### Painel do funcionário
* **Login por cargo** — Atendente, Veterinário, Gerente e Limpeza, cada um com acesso a telas diferentes
* **Prontuário** — histórico de atendimentos por pet, com busca
* **Agendamentos** — visão geral com resumo numérico, criação de novo agendamento e atualização de status
* **Insumos** — controle de uso e solicitação de compra
* **Gerenciar equipe** — cadastro de funcionários (todos os cargos)
* **Áreas de limpeza** — controle de status por setor
* **Relatório** — geração de PDF de faturamento e gastos
* **Solicitações de adoção** — aprovação/recusa pelo Veterinário e Gerente

### Recursos técnicos
* Autenticação simulada via `localStorage`, com proteção de rotas (o carrinho e o painel de funcionário exigem login e redirecionam automaticamente)
* Fluxo de carrinho que redireciona pra agendamento quando há consultas/vacinas no pedido
* Animações de parallax, fade+zoom e transições suaves em cards, imagens e seções
* Design responsivo com paleta de cores e tipografia customizadas por seção

---

## 📁 Estrutura do projeto

```text
CHEEW-repositorio/
│
├── database/               # Scripts SQL do banco de dados
│   ├── schema.sql
│   └── seed.sql
│
├── public/
│   └── imagens/            # Fotos de produtos, pets, serviços, etc.
│
├── scripts/
│   └── setup_db.ts         # Aplica o schema no PostgreSQL
│
├── src/
│   ├── backend/            # API REST
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── frontend/           # Interface React
│       ├── assets/
│       ├── components/     # Componentes reutilizáveis (Reveal, BackToTop, PawTrail, etc.)
│       ├── pages/          # Páginas do site e do painel de funcionário
│       ├── App.jsx
│       └── main.jsx
│
├── docker-compose.yml      # PostgreSQL local via Docker
├── package.json
└── vite.config.js
```

---

## 🔧 Rodando o projeto localmente

Clone o repositório:

```bash
git clone https://github.com/GioduarteDev/CHEEW-repsotorio-.git
```

Acesse a pasta do projeto:

```bash
cd CHEEW-repsotorio-
```

Instale as dependências:

```bash
npm install
```

Rode só o frontend (não precisa de banco de dados pra isso):

```bash
npm run dev:frontend
```

O site estará disponível em `http://localhost:5173` (ou a próxima porta livre, tipo 5174, 5175...).

Para rodar frontend e backend juntos (precisa do PostgreSQL configurado, veja abaixo):

```bash
npm run dev
```

Para gerar a versão de produção do frontend:

```bash
npm run build:frontend
npm run preview
```

### Configurando o backend (opcional, pra rodar tudo)

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgres://postgres:postgrespassword@localhost:5432/petshop
PORT=3000
```

Suba o banco de dados com Docker:

```bash
docker compose up -d
```

Crie a estrutura do banco:

```bash
npm run db:setup
```

---

## 🗄️ Próximos passos

* Conectar as telas do painel de funcionário (Relatório, Prontuário, Agendamentos etc.) às rotas reais do backend
* Autenticação real de usuários e funcionários (com senha criptografada e JWT)
* Persistência de pedidos e produtos em banco de dados
* Deploy em