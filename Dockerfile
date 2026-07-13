# ╔══════════════════════════════════════════════════════════════════╗
# ║  Stage 1 — builder                                              ║
# ║  Instala todas as dependências e compila backend + frontend      ║
# ╚══════════════════════════════════════════════════════════════════╝
FROM node:22-alpine AS builder

WORKDIR /app

# Copia manifestos de dependência primeiro (aproveita cache de camadas)
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do código-fonte
COPY . .

# 1. Compila o backend TypeScript → dist/src/backend/...
RUN npm run build

# 2. Compila o frontend React/Vite → dist/public/
RUN npm run build:frontend


# ╔══════════════════════════════════════════════════════════════════╗
# ║  Stage 2 — runner (imagem de produção, leve)                    ║
# ╚══════════════════════════════════════════════════════════════════╝
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Instala somente as dependências de produção
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copia os artefatos compilados do builder
COPY --from=builder /app/dist ./dist

# Copia os SQLs de schema/seed e scripts de setup do banco
COPY database/ ./database/
COPY scripts/ ./scripts/
COPY tsconfig.json ./

# Porta que o Express escuta (deve coincidir com PORT no .env)
EXPOSE 3000

# Inicia o servidor Express (serve API + frontend estático)
CMD ["node", "dist/src/backend/server.js"]
