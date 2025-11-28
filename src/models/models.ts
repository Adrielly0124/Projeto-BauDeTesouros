/** Modelos de domínio compartilhados (tipos centrais da aplicação) */

export type ID = string

export type TipoUsuario = 'responsavel' | 'admin'

export interface Usuario {
  id: ID
  nome: string
  email: string
  tipo: TipoUsuario
}

export type TipoTransacao = 'venda' | 'doacao' | 'troca'
export type CondicaoItem = 'Novo' | 'Pouco uso' | 'Usado'
export type CategoriaItem = 'Brinquedos' | 'Roupas' | 'Livros' | 'Acessórios'

export interface Item {
  id: ID
  titulo: string
  descricao: string
  categoria: CategoriaItem
  condicao: CondicaoItem
  tipoTransacao: TipoTransacao
  preco?: number | null
  aceitaTroca: boolean
  imagens: string[]
  localizacaoCidade: string
  localizacaoEstado: string
  criadoEm: string
  idUsuario: ID
}

export type TipoProposta = 'compra' | 'troca' | 'doacao'
export type StatusProposta = 'pendente' | 'aceita' | 'rejeitada' | 'contraproposta'

export interface Proposta {
  id: ID
  idItem: ID
  idProponente: ID
  tipo: TipoProposta
  mensagem?: string
  valorProposto?: number | null
  itensOfertados?: string[]
  status: StatusProposta
  data: string
}

export type TipoTransacaoEfetiva = 'compra' | 'troca' | 'doacao'
export type StatusTransacao = 'em_andamento' | 'concluida' | 'cancelada'

export interface Transacao {
  id: ID
  idItem: ID
  idVendedor: ID
  idComprador: ID
  tipo: TipoTransacaoEfetiva
  status: StatusTransacao
  data: string
}

export type StatusDenuncia = 'aberta' | 'em_analise' | 'fechada'

export interface Denuncia {
  id: ID
  idItem?: ID | null
  idUsuario?: ID | null
  motivo: string
  descricao?: string
  status: StatusDenuncia
  data: string
}
