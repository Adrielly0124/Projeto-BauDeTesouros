import { createContext, useContext, useMemo, useState, PropsWithChildren } from 'react'
import Snackbar from '../componentes/snackbar/Snackbar'

/** ===== UI (snackbar global) ===== */
type UIState = { mensagem?: string; notificar: (m: string) => void }
const UIContext = createContext<UIState | undefined>(undefined)

export function useUI(): UIState {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI deve ser usado dentro de <Provedores>')
  return ctx
}

/** ===== Auth (mock) ===== */
export type Usuario = { id: string; nome: string; email: string; tipo: 'responsavel' | 'admin' }
type AuthState = {
  usuario: Usuario | null
  entrar: (email: string, senha: string) => Promise<void>
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>
  sair: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <Provedores>')
  return ctx
}

/** helper para import dinâmico do módulo de auth */
const authApi = () => import('../infraestrutura/api/auth')

export default function Provedores({ children }: PropsWithChildren) {
  // UI
  const [mensagem, setMensagem] = useState<string | undefined>()
  const ui = useMemo<UIState>(() => ({
    mensagem,
    notificar: (m: string) => setMensagem(m),
  }), [mensagem])

  // Auth
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  async function entrar(email: string, senha: string) {
    const { autenticar } = await authApi()
    const u = await autenticar(email, senha)
    setUsuario(u)
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    const { registrar } = await authApi()
    const u = await registrar(nome, email, senha)
    setUsuario(u)
  }

  function sair() {
    // mantém a assinatura síncrona de AuthState.sair
    authApi()
      .then(({ sair }) => sair())
      .finally(() => setUsuario(null))
  }

  const auth = useMemo<AuthState>(() => ({
    usuario,
    entrar,
    cadastrar,
    sair,
  }), [usuario])

  return (
    <UIContext.Provider value={ui}>
      <AuthContext.Provider value={auth}>
        {children}
        <Snackbar mensagem={mensagem} />
      </AuthContext.Provider>
    </UIContext.Provider>
  )
}
