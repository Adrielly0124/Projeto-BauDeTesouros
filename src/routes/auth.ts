import { Router } from "express";
import { db } from "../config/firebase"; // <-- seu arquivo de config do Firebase
import { collection, doc, getDoc, query, where, getDocs, setDoc } from "firebase/firestore";

const router = Router();

// 🔹 Registrar usuário no Firestore
router.post("/register", async (req, res) => {
  try {
    const { uid, nome, email, tipo } = req.body;

    if (!uid || !email || !nome) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    // 🔍 Verifica se já existe usuário com o mesmo e-mail
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    // 🔹 Cria usuário no Firestore usando o UID
    await setDoc(doc(db, "usuarios", uid), {
      uid,
      nome,
      email,
      tipo: tipo ?? "responsavel",
      createdAt: new Date(),
    });

    res.json({
      message: "Usuário registrado com sucesso",
      user: { uid, nome, email, tipo: tipo ?? "responsavel" },
    });

  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Erro ao registrar usuário" });
  }
});

export default router;
