import { ler, gravar } from '../../infraestrutura/armazenamento/local'
import { uid } from '../../utilitarios/uid'

export type Proposta = {
  id: string
  idItem: string
  idProponente: string
  tipo: 'compra' | 'troca' | 'doacao'
  mensagem?: string
  valorProposto?: number | null
  itensOfertados?: string[]
  status: 'pendente' | 'aceita' | 'rejeitada' | 'contraproposta'
  data: string
}

export type Transacao = {
  id: string
  idItem: string
  idVendedor: string
  idComprador: string
  tipo: 'compra' | 'troca' | 'doacao'
  status: 'em_andamento' | 'concluida' | 'cancelada'
  data: string
}

const CH_P = 'api_propostas'
const CH_T = 'api_transacoes'
const delay = <T,>(v: T, ms = 300) => new Promise<T>((r) => setTimeout(() => r(v), ms))

/** Envia uma proposta de interesse (compra/troca/doação) */
export async function propor(p: Omit<Proposta, 'id' | 'status' | 'data'>): Promise<Proposta> {
  const todas = ler<Proposta[]>(CH_P, [])
  const nova: Proposta = { ...p, id: uid('prop'), status: 'pendente', data: new Date().toISOString() }
  todas.unshift(nova)
  gravar(CH_P, todas)
  return delay(nova)
}

/** Lista propostas do sistema (no mundo real: filtraria por usuário logado) */
export async function listarPropostas(): Promise<Proposta[]> {
  return delay(ler<Proposta[]>(CH_P, []))
}

/** Atualiza o status de uma proposta */
export async function responderProposta(id: string, status: Proposta['status']): Promise<Proposta | null> {
  const todas = ler<Proposta[]>(CH_P, [])
  const ix = todas.findIndex((p) => p.id === id)
  if (ix >= 0) {
    todas[ix].status = status
    gravar(CH_P, todas)
    return delay(todas[ix])
  }
  return delay(null)
}

/** Cria uma transação após aceite/fechamento de proposta */
export async function criarTransacao(t: Omit<Transacao, 'id' | 'data' | 'status'>): Promise<Transacao> {
  const todas = ler<Transacao[]>(CH_T, [])
  const nova: Transacao = { ...t, id: uid('txn'), data: new Date().toISOString(), status: 'em_andamento' }
  todas.unshift(nova)
  gravar(CH_T, todas)
  return delay(nova)
}

/** Lista transações do sistema (no mundo real: por usuário logado) */
export async function listarTransacoes(): Promise<Transacao[]> {
  return delay(ler<Transacao[]>(CH_T, []))
}
