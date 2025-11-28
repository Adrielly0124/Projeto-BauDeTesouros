// storage.ts — versão temporária SEM upload

export async function uploadImagens(_files: any[]): Promise<string[]> {
  console.warn("⚠ Upload de imagens desativado temporariamente.");
  return []; // retorna array vazio
}
