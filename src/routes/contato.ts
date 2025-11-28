import { Router } from 'express';
import Contato from '../models/Contato.js';

const router = Router();

router.post('/', async (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;
  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).json({ error: 'Campos obrigatórios' });
  }
  const novo = await Contato.create({ nome, email, assunto, mensagem });
  res.json(novo);
});

export default router;
