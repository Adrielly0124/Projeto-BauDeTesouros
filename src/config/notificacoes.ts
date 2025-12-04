import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc
} from "firebase/firestore";

// Criar notificação de interesse
export async function criarNotificacao(data: any) {
  return await addDoc(collection(db, "notificacoes"), {
    ...data,
    tipo: "interesse",
    status: "pendente",
    criadoEm: new Date(),
  });
}

// Listar notificações destinadas ao dono do item
export async function listarNotificacoesDoUsuario(uid: string) {
  const q = query(
    collection(db, "notificacoes"),
    where("donoId", "==", uid),
    orderBy("criadoEm", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Atualizar status
export async function atualizarStatusNotificacao(id: string, status: string) {
  await updateDoc(doc(db, "notificacoes", id), { status });
}

// Criar notificação de resposta SEM ERRO
export async function criarNotificacaoResposta({
  donoId,
  donoNome,
  donoEmail,
  donoTelefone,
  interessadoId,
  itemId,
  itemTitulo,
  resposta,
}: any) {

  if (!resposta) {
    console.warn("⚠ criarNotificacaoResposta chamada sem 'resposta'. Definindo como 'indefinida'.");
    resposta = "indefinida"; // evita undefined no Firestore
  }

  return await addDoc(collection(db, "notificacoes"), {
    tipo: "resposta",
    donoId,
    interessadoId,
    itemId,
    itemTitulo,
    resposta,
    criadoEm: new Date(),
  });
}
