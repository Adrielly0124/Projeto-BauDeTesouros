import { ler, gravar } from '../../infraestrutura/armazenamento/local'
import { uid } from '../../utilitarios/uid'

export type StatusDenuncia = 'aberta' | 'em_analise' | 'fechada'
export type Denuncia = {
  id: string
  idItem?: string | null
  idUsuario?: string | null
  motivo: string
  descricao?: string
  status: StatusDenuncia
  data: string
}

const CH = 'api_denuncias'
const delay = <T,>(v: T, ms = 300) => new Promise<T>((r) => setTimeout(() => r(v), ms))

/** Cria uma denúncia para moderação */
export async function denunciar(d: Omit<Denuncia, 'id' | 'status' | 'data'>): Promise<Denuncia> {
  const todas = ler<Denuncia[]>(CH, [])
  const nova: Denuncia = {
    ...d,
    id: uid('den'),
    status: 'aberta',
    data: new Date().toISOString(),
  }
  todas.unshift(nova)
  gravar(CH, todas)
  return delay(nova)
}

/** Lista todas as denúncias (admin) */
export async function listar(): Promise<Denuncia[]> {
  return delay(ler<Denuncia[]>(CH, []))
}

/** Atualiza o status da denúncia */
export async function atualizar(id: string, status: StatusDenuncia): Promise<Denuncia | null> {
  const todas = ler<Denuncia[]>(CH, [])
  const ix = todas.findIndex((x) => x.id === id)
  if (ix >= 0) {
    todas[ix].status = status
    gravar(CH, todas)
    return delay(todas[ix])
  }
  return delay(null)
}
