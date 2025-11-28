import { addDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "./firebase";

// Criar notificação
export async function criarNotificacao(data: {
  donoId: string;
  interessadoId: string;
  interessadoNome: string;
  itemId: string;
  itemTitulo: string;
  tipo: "troca" | "doacao";
  mensagem: string;
}) {
  return addDoc(collection(db, "notificacoes"), {
    ...data,
    lido: false,
    criadoEm: new Date()
  });
}

// Listar notificações do dono
export async function listarNotificacoesDoUsuario(uid: string) {
  const ref = collection(db, "notificacoes");
  const q = query(
    ref,
    where("donoId", "==", uid),
    orderBy("criadoEm", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
