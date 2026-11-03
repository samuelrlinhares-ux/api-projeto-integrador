import express from 'express';
import path from 'path';
import authRoutes from './routes/authRoutes';
import empresaRoutes from './routes/empresaRoutes';
import eventoRoutes from './routes/eventoRoutes';
import notaRoutes from './routes/notaRoutes';

const app = express();
const porta = Number(process.env.PORT || 3000);
const host = process.env.APP_HOST || '0.0.0.0';
app.set('trust proxy', true);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', authRoutes);
app.use('/api', empresaRoutes);
app.use('/api', eventoRoutes);
app.use('/api', notaRoutes);
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
app.listen(porta, host, () => {
  console.log(`Servidor disponível em http://localhost:${porta}`);
  if (host === '0.0.0.0') {
    console.log('A API também aceita conexões de outros computadores da rede local.');
  }
});
