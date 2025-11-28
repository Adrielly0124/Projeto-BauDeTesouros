import { Navigate } from 'react-router-dom'
import { PropsWithChildren } from 'react'
import { useAuth } from '../aplicacao/provedores'

type Props = PropsWithChildren & { somenteAdmin?: boolean }

export default function RotaProtegida({ children, somenteAdmin }: Props) {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to='/login' replace />
  if (somenteAdmin && usuario.tipo !== 'admin') return <Navigate to='/' replace />
  return <>{children}</>
}
