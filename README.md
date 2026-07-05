# CHEW!! 🐾

Site de e-commerce e serviços para pet shop, desenvolvido em **React + Vite**, com foco em experiência de usuário fofa, moderna e funcional.

Projeto pessoal de portfólio, desenvolvido como parte da disciplina de Projeto Aplicado para Banco de Dados/Sistemas — a parte de **frontend** do sistema CHEW!!.

---

## 🚀 Tecnologias utilizadas

* React 19
* Vite
* React Router DOM
* CSS-in-JS (inline styles)
* LocalStorage (persistência temporária de carrinho, login e pedidos)

---

## ✨ Funcionalidades

### Páginas
* **Home** — hero animado, carrossel de categorias, destaques de serviços, depoimentos de clientes
* **Veterinária** — consultas, vacinas, destaques do serviço com cards interativos
* **Tosa e Banho** — serviços de banho, tosa e coloração de pelos
* **Adoção** — catálogo de pets disponíveis, seção de apadrinhamento
* **Produtos** — catálogo completo por categoria (cachorro, gato, pássaro, hamster), com seções de ração, banho, brinquedos, acessórios e roupinhas
* **Login/Cadastro** — autenticação simulada no frontend, com formulários de entrar e criar conta
* **Carrinho** — carrinho de compras completo, com escolha de método de pagamento (cartão, Pix, boleto) e confirmação de pedido

### Recursos técnicos
* Autenticação simulada via `localStorage`, com proteção de rotas (o carrinho exige login e redireciona automaticamente)
* Carrinho de compras persistente entre páginas
* Menus suspensos (dropdown) de navegação
* Animações de hover, zoom e transições suaves em cards e imagens
* Design responsivo com paleta de cores e tipografia customizadas por seção

---

## 📁 Estrutura do projeto

```text
chew/
│
├── public/
│   └── imagens/          # Fotos de produtos, pets, serviços, etc.
│
├── src/
│   ├── components/       # Componentes reutilizáveis (Reveal, BackToTop)
│   ├── pages/            # Páginas do site (Home, Produtos, Carrinho, Login, etc.)
│   ├── App.jsx           # Definição das rotas
│   └── main.jsx          # Ponto de entrada da aplicação
│
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

Rode em modo de desenvolvimento:

```bash
npm run dev
```

O site estará disponível em:

```text
http://localhost:5173
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

---

## 🗄️ Próximos passos

* Conectar o frontend a um backend próprio (API REST + banco de dados)
* Autenticação real de usuários (com senha criptografada)
* Persistência de pedidos e produtos em banco de dados
* Deploy em produção (Vercel)

---

## 👩‍💻 Autora

Desenvolvido por **Gio Duarte** como projeto de portfólio e trabalho acadêmico.
