import { ler, gravar } from '../../infraestrutura/armazenamento/local'
import { gerarItens, type Item } from './seed'
import { uid } from '../../utilitarios/uid'

const CH = 'api_itens'
const delay = <T,>(v: T, ms = 300) => new Promise<T>((r) => setTimeout(() => r(v), ms))

function init(): Item[] {
  let dados = ler<Item[]>(CH, [])
  if (!dados.length) {
    dados = gerarItens(42)
    gravar(CH, dados)
  }
  return dados
}

export type FiltroItens = Partial<Item> & {
  busca?: string
  ordenar?: 'recentes' | 'preco-asc' | 'preco-desc'
}

/** Lista com filtros básicos e ordenação */
export async function listar(filtro?: FiltroItens): Promise<Item[]> {
  const dados = init()
  let r = [...dados]

  if (filtro?.busca) {
    const b = filtro.busca.toLowerCase()
    r = r.filter(
      (i) =>
        i.titulo.toLowerCase().includes(b) ||
        i.descricao.toLowerCase().includes(b)
    )
  }
  if (filtro?.categoria) r = r.filter((i) => i.categoria === filtro.categoria)
  if (filtro?.tipoTransacao) r = r.filter((i) => i.tipoTransacao === filtro.tipoTransacao)

  switch (filtro?.ordenar) {
    case 'recentes':
      r.sort((a, b) => +new Date(b.criadoEm) - +new Date(a.criadoEm))
      break
    case 'preco-asc':
      r.sort((a, b) => (a.preco ?? 1e12) - (b.preco ?? 1e12))
      break
    case 'preco-desc':
      r.sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0))
      break
  }

  return delay(r)
}

export async function obter(id: string): Promise<Item | null> {
  const dados = init()
  return delay(dados.find((i) => i.id === id) || null)
}

export type NovoItem = Omit<Item, 'id' | 'criadoEm' | 'idUsuario'>

/** Cria um novo item */
export async function criar(parcial: NovoItem): Promise<Item> {
  const dados = init()
  const novo: Item = {
    ...parcial,
    id: uid('item'),
    criadoEm: new Date().toISOString(),
    idUsuario: uid('usr'),
  }
  dados.unshift(novo)
  gravar(CH, dados)
  return delay(novo)
}

/** Atualiza campos do item */
export async function atualizar(id: string, parcial: Partial<Item>): Promise<Item | null> {
  const dados = init()
  const ix = dados.findIndex((i) => i.id === id)
  if (ix >= 0) {
    dados[ix] = { ...dados[ix], ...parcial }
    gravar(CH, dados)
    return delay(dados[ix])
  }
  return delay(null)
}

/** Remove um item por id */
export async function remover(id: string): Promise<boolean> {
  const dados = init()
  const restante = dados.filter((i) => i.id !== id)
  gravar(CH, restante)
  return delay(true)
}
