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
  const ref = collection(db, "notificacoes");

  // Notificações onde o usuário é DONO do item
  const q1 = query(ref, where("donoId", "==", uid));

  // Notificações onde o usuário é o INTERESSADO
  const q2 = query(ref, where("interessadoId", "==", uid));

  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

  const lista: any[] = [
    ...snap1.docs.map((d) => ({ id: d.id, ...d.data() })),
    ...snap2.docs.map((d) => ({ id: d.id, ...d.data() })),
  ];

  // Ordenar do mais novo para o mais antigo
  lista.sort((a, b) => {
    const t1 = a.criadoEm?.seconds || 0;
    const t2 = b.criadoEm?.seconds || 0;
    return t2 - t1;
  });

  return lista;
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
