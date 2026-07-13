import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes';
import { AppError } from './errors/AppError';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Healthcheck Route
app.get('/health', async (req: Request, res: Response): Promise<void> => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Central API Routes
app.use('/api', apiRoutes);

// ── Servir frontend em produção ───────────────────────────────────────────────
// Em produção (Docker/build), o Express serve os arquivos estáticos gerados
// pelo Vite em dist/public. Qualquer rota não-API retorna o index.html para
// suportar o roteamento client-side do React Router.
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', '..', '..', 'public');
  app.use(express.static(frontendPath));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Global Error Handler Middleware
app.use((err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  // Erro operacional lançado intencionalmente pela aplicação
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { message: err.message } });
    return;
  }

  // Violação de chave estrangeira no PostgreSQL (ex: id_pet inexistente)
  if (typeof err === 'object' && err !== null && (err as any).code === '23503') {
    res.status(400).json({ error: { message: 'Recurso relacionado não encontrado.' } });
    return;
  }

  // Erro inesperado — loga o stack e retorna 500 genérico
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: { message: 'Internal Server Error' } });
});

export default app;
