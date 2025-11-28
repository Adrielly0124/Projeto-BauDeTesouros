import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import authRoutes from '../routes/auth.js';
import itemRoutes from '../routes/items.js';
import contatoRoutes from '../routes/contato.js';
//npm install --save-dev @types/dotenv
dotenv.config();

const app = express();

// CORS + JSON
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

// servir imagens estáticas (uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// rotas principais
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/contato', contatoRoutes);

// rota raiz
app.get('/', (_req, res) => res.send('🚀 API Baú de Tesouros rodando!'));

// inicializar servidor
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Servidor ativo na porta ${PORT}`));
  })
  .catch((err) => console.error('Erro ao conectar ao banco:', err));
