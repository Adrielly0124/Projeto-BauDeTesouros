import { db } from "../config/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";

import { auth } from "../config/firebase";

/**
 * Criar item no Firestore (funciona sem imagens)
 */
export async function criarItem(data: any) {
  if (!auth.currentUser) {
    throw new Error("Usuário não logado!");
  }

  return await addDoc(collection(db, "itens"), {
    titulo: data.titulo,
    descricao: data.descricao,
    tipo: data.tipo,
    preco: data.preco ?? null,
    condicao: data.condicao,
    faixaEtaria: data.faixaEtaria ?? null,
    local: data.local,

    // 🔥 sempre garantir um array
    imagens: Array.isArray(data.imagens) ? data.imagens : [],

    usuarioId: auth.currentUser.uid,
    criadoEm: new Date(),
  });
}

/**
 * Lista itens por tipo (venda, troca, doacao)
 */
export async function listarItensPorTipo(tipo: string) {
  const q = query(collection(db, "itens"), where("tipo", "==", tipo));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Lista apenas os itens do usuário logado
 */
export async function listarMeusItens() {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "itens"),
    where("usuarioId", "==", auth.currentUser.uid)
  );

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * ⭐ NOVO: Lista TODOS os itens cadastrados
 * Ordenados pelo mais recente
 */
export async function listarTodosItens() {
  const q = query(
    collection(db, "itens"),
    orderBy("criadoEm", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 🔍 Busca simples por título (case insensitive)
export async function buscarItens(texto: string) {
  const snap = await getDocs(collection(db, "itens"));
  const termo = texto.toLowerCase();

  return snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((it: any) =>
      it.titulo?.toLowerCase().includes(termo)
    );
}
