/**
 * Módulo de persistência local da aplicação.
 * Fornece leitura, escrita e manipulação de coleções no localStorage.
 * 
 * Todas as funções são seguras e tipadas.
 */

export function gravar<T = any>(chave: string, valor: T): void {
  try {
    const texto = JSON.stringify(valor)
    window.localStorage.setItem(chave, texto)
  } catch (erro) {
    console.error(`Erro ao gravar no localStorage (${chave}):`, erro)
  }
}

export function ler<T = any>(chave: string, padrao: T): T {
  try {
    const texto = window.localStorage.getItem(chave)
    if (texto === null) return padrao
    return JSON.parse(texto) as T
  } catch (erro) {
    console.error(`Erro ao ler do localStorage (${chave}):`, erro)
    return padrao
  }
}

export function remover(chave: string): void {
  try {
    window.localStorage.removeItem(chave)
  } catch (erro) {
    console.error(`Erro ao remover do localStorage (${chave}):`, erro)
  }
}

export function limparTudo(): void {
  try {
    window.localStorage.clear()
  } catch (erro) {
    console.error('Erro ao limpar o localStorage:', erro)
  }
}

/**
 * Lista todos os registros de uma coleção salva (array JSON).
 * Se não existir, retorna um array vazio.
 */
export function listar<T = any>(chave: string): T[] {
  try {
    const dados = ler<T[]>(chave, [])
    return Array.isArray(dados) ? dados : []
  } catch (erro) {
    console.error(`Erro ao listar registros (${chave}):`, erro)
    return []
  }
}

/**
 * Atualiza um registro dentro de uma coleção.
 * - Localiza o item pelo campo `id`.
 * - Atualiza os campos informados.
 * - Persiste novamente o array.
 */
export function atualizar<T extends { id: string }>(
  chave: string,
  id: string,
  parcial: Partial<T>
): T | null {
  try {
    const todos = listar<T>(chave)
    const indice = todos.findIndex((x) => x.id === id)
    if (indice < 0) return null

    const atualizado = { ...todos[indice], ...parcial }
    todos[indice] = atualizado
    gravar(chave, todos)
    return atualizado
  } catch (erro) {
    console.error(`Erro ao atualizar registro (${chave} / ${id}):`, erro)
    return null
  }
}
