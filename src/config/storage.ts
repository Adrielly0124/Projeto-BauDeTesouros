import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Recebe uma lista de objetos { file: File }
 * Retorna uma lista de URLs publicadas no Firebase Storage
 */
export async function uploadImagens(files: { file: File }[]): Promise<string[]> {
  const urls: string[] = [];

  for (const f of files) {
    const fileName = `${Date.now()}-${f.file.name}`;
    const storageRef = ref(storage, `itens/${fileName}`);

    const snap = await uploadBytes(storageRef, f.file);
    const url = await getDownloadURL(snap.ref);

    urls.push(url);
  }

  return urls;
}
