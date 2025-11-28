import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Usuario } from "../models/Usuario";

export async function registrarUsuario(data: {
  tipo: string;
  nome: string;
  email: string;
  cpf: string;
  senha: string;
}) {
  const cred = await createUserWithEmailAndPassword(auth, data.email, data.senha);
  const uid = cred.user.uid;

  const usuario: Usuario = {
    id: uid,
    tipo: data.tipo,
    nome: data.nome,
    email: data.email,
    cpf: data.cpf,
    criadoEm: new Date().toISOString(),
  };

  await setDoc(doc(db, "usuarios", uid), usuario);

  return usuario;
}

export async function login(email: string, senha: string) {
  return await signInWithEmailAndPassword(auth, email, senha);
}

export async function getUsuario(uid: string): Promise<Usuario | null> {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Usuario) : null;
}
