import { uid } from '../../utilitarios/uid'

export type Item = {
  id: string
  titulo: string
  descricao: string
  categoria: 'Brinquedos' | 'Roupas' | 'Livros' | 'Acessórios'
  condicao: 'Novo' | 'Pouco uso' | 'Usado'
  tipoTransacao: 'venda' | 'doacao' | 'troca'
  preco?: number | null
  aceitaTroca: boolean
  imagens: string[]
  localizacaoCidade: string
  localizacaoEstado: string
  criadoEm: string
  idUsuario: string
}

const categorias = ['Brinquedos', 'Roupas', 'Livros', 'Acessórios'] as const
const condicoes = ['Novo', 'Pouco uso', 'Usado'] as const
const cor = (i: number) => ['f59e0b', '10b981', '3b82f6', '8b5cf6', 'ef4444'][i % 5]
const img = (i: number) => `https://singlecolorimage.com/get/${cor(i)}/640x480`

/** Gera itens falsos para popular o catálogo */
export function gerarItens(qtd = 36): Item[] {
  const arr: Item[] = []
  for (let i = 0; i < qtd; i++) {
    const id = uid('item')
    arr.push({
      id,
      titulo: `Item ${i + 1}`,
      descricao: 'Item infantil em bom estado. Descrição resumida...',
      categoria: categorias[i % categorias.length],
      condicao: condicoes[i % condicoes.length],
      tipoTransacao: (['venda', 'doacao', 'troca'] as const)[i % 3],
      preco: i % 3 === 0 ? Math.round((20 + i * 2) * 100) / 100 : null,
      aceitaTroca: i % 2 === 0,
      imagens: [img(i), img(i + 1), img(i + 2)],
      localizacaoCidade: 'Limeira',
      localizacaoEstado: 'SP',
      criadoEm: new Date(Date.now() - i * 86400000).toISOString(),
      idUsuario: uid('usr'),
    })
  }
  return arr
}
