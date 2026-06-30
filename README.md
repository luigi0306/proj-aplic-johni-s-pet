# Johni's Pet API

API REST desenvolvida para a disciplina de **Projeto Aplicado para Banco de Dados**.

O projeto simula o gerenciamento de um pet shop, permitindo o cadastro e controle de clientes, pets, funcionários, serviços, agendamentos, produtos, vendas, insumos, prontuários e animais para adoção.

---

## Tecnologias utilizadas

* Node.js
* TypeScript
* Express
* PostgreSQL
* Docker Compose
* Zod
* dotenv
* CORS

---

## Funcionalidades

O sistema possui operações de cadastro, consulta, atualização e exclusão para os principais módulos do pet shop:

* Clientes
* Pets
* Funcionários
* Serviços
* Agendamentos
* Produtos
* Vendas
* Insumos
* Prontuários
* Animais para adoção

Além disso, o banco de dados possui relacionamentos entre entidades, tabelas associativas, tipos enumerados e regras automatizadas para controle de insumos.

---

## Estrutura do projeto

```text
proj-aplic-johni-s-pet/
│
├── src/
│   ├── config/          # Configuração de banco de dados
│   ├── controllers/     # Lógica das operações da API
│   ├── errors/          # Tratamento de erros
│   ├── middlewares/     # Validações e interceptadores
│   ├── routes/          # Rotas da aplicação
│   ├── schemas/         # Schemas de validação com Zod
│   ├── app.ts           # Configuração do Express
│   └── server.ts        # Inicialização do servidor
│
├── scripts/             # Scripts auxiliares
├── BANCO PET SHOP.sql   # Estrutura do banco de dados
├── BANCO_PET_SHOP_DML.sql # Dados iniciais para testes
├── docker-compose.yml   # Configuração do PostgreSQL com Docker
├── package.json
└── tsconfig.json
```

---

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js 18 ou superior
* Docker e Docker Compose
* Git

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/luigi0306/proj-aplic-johni-s-pet.git
```

Acesse a pasta do projeto:

```bash
cd proj-aplic-johni-s-pet
```

Instale as dependências:

```bash
npm install
```

---

## Configuração das variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto:

```env
DATABASE_URL=postgres://postgres:postgrespassword@localhost:5432/petshop
PORT=3000
```

---

## Banco de dados

Inicie o PostgreSQL usando Docker:

```bash
docker compose up -d
```

Execute o script de criação e população do banco:

```bash
npm run db:setup
```

---

## Executando a aplicação

Para iniciar em modo de desenvolvimento:

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

Para verificar se a aplicação está funcionando:

```text
GET /health
```

---

## Principais endpoints

| Módulo              | Endpoint base         |
| ------------------- | --------------------- |
| Clientes            | `/api/clientes`       |
| Pets                | `/api/pets`           |
| Funcionários        | `/api/funcionarios`   |
| Serviços            | `/api/servicos`       |
| Agendamentos        | `/api/agendamentos`   |
| Produtos            | `/api/produtos`       |
| Vendas              | `/api/vendas`         |
| Insumos             | `/api/insumos`        |
| Prontuários         | `/api/prontuarios`    |
| Animais para adoção | `/api/animais-adocao` |

---

## Exemplo de criação de cliente

**POST** `/api/clientes`

```json
{
  "cpf": "123.456.789-00",
  "nome": "João Silva",
  "telefone": "(61) 99999-9999",
  "endereco": "Rua Exemplo, 123"
}
```

---

## Objetivo acadêmico

O projeto foi desenvolvido para aplicar conhecimentos de:

* Modelagem de banco de dados relacional;
* Criação de tabelas e relacionamentos;
* Chaves primárias e estrangeiras;
* Consultas SQL;
* Operações CRUD;
* Triggers e funções em PLpgSQL;
* Desenvolvimento de API REST;
* Validação de dados;
* Integração entre backend e PostgreSQL.

---

## Possíveis melhorias futuras

* Implementação de autenticação com JWT;
* Documentação interativa com Swagger;
* Criação de testes automatizados;
* Interface web para operação do pet shop;
* Dashboard com indicadores de vendas e agendamentos;
* Controle automático de estoque de produtos;
* Deploy da API em ambiente cloud.

---

## Equipe

Projeto desenvolvido para a disciplina de Projeto Aplicado para Banco de Dados.
