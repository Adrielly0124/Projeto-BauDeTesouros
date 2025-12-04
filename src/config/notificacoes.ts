// src/config/notificacoes.ts 
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

// ------------------------------------------------------
// 1) Criar notificação de interesse (para o dono)
// ------------------------------------------------------
export async function criarNotificacao({
  donoId,
  interessadoId,
  itemId,
  itemTitulo,
  resposta,
}: any) {
  return await addDoc(collection(db, "notificacoes"), {
    tipo: "resposta",
    donoId,                // quem enviou a resposta
    interessadoId,         // quem deve receber
    itemId,
    itemTitulo,
    resposta,              // "aceita" ou "recusada"
    criadoEm: new Date(),
  });
}


// ------------------------------------------------------
// 2) Listar notificações destinadas ao dono do item
// ------------------------------------------------------
export async function listarNotificacoesDoUsuario(uid: string) {
  const q = query(
    collection(db, "notificacoes"),
    where("donoId", "==", uid),
    orderBy("criadoEm", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ------------------------------------------------------
// 3) Atualizar status da notificação (aceita / recusada)
// ------------------------------------------------------
export async function atualizarStatusNotificacao(
  id: string,
  status: "aceita" | "recusada"
) {
  await updateDoc(doc(db, "notificacoes", id), { status });
}

// ------------------------------------------------------
// 4) Criar notificação de resposta para o interessado
// ------------------------------------------------------
export async function criarNotificacaoResposta({
  donoId,
  interessadoId,
  itemId,
  itemTitulo,
  resposta = null,   // <--- EVITA UNDEFINED
}: any) {
  return await addDoc(collection(db, "notificacoes"), {
    tipo: "resposta",
    donoId,
    interessadoId,
    itemId,
    itemTitulo,
    resposta,           // agora pode ser null sem erro
    criadoEm: new Date(),
  });
}

