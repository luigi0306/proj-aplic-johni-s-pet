import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRoutes from './routes';

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

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

export default app;
