import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rotas
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎓 EDUKKARE API - Sistema Inteligente para Educação Infantil',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      students: '/api/students',
      evaluations: '/api/evaluations',
      evidences: '/api/evidences',
      dashboard: '/api/dashboard',
    },
  });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

export default app;

