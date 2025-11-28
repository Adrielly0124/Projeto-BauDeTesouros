import { Router } from "express";
import { db } from "../config/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { upload } from "../utilitarios/upload";

const router = Router();

/**
 * 🔹 Criar item (com upload de imagens)
 * Dados do item + UID do usuário vêm do FRONTEND
 * Imagens são salvas pelo backend (multer)
 * Firestore salva o restante
 */
router.post(
  "/",
  upload.array("imagens", 8),
  async (req, res) => {
    try {
      const {
        titulo,
        descricao,
        tipo,
        preco,
        condicao,
        faixaEtaria,
        local,
        uid,          // 🔥 UID do Firebase
      } = req.body;

      if (!uid) {
        return res.status(400).json({ error: "UID do usuário é obrigatório" });
      }

      // 🔹 URLs das imagens armazenadas pelo backend
      const imagens = Array.isArray(req.files)
        ? req.files.map((f: any) => `/uploads/${f.filename}`)
        : [];

      // 🔹 Salvar tudo no Firestore
      const docRef = await addDoc(collection(db, "items"), {
        titulo,
        descricao,
        tipo,
        preco: tipo === "venda" && preco ? Number(preco) : null,
        condicao,
        faixaEtaria,
        local,
        imagens,
        usuarioUid: uid,
        createdAt: new Date(),
      });

      res.json({
        message: "Item cadastrado com sucesso",
        id: docRef.id,
      });

    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Erro ao cadastrar item" });
    }
  }
);

export default router;
