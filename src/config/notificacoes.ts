import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";

export async function criarNotificacao(data: {
  itemId: string;
  itemTitulo: string;
  donoId: string;
  interessadoId: string;
  interessadoNome: string;
  tipo: "troca" | "doacao";
  mensagem: string;
}) {
  return await addDoc(collection(db, "notificacoes"), {
    ...data,
    criadoEm: new Date(),
    lido: false,
  });
}
