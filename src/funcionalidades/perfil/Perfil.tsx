import Card from '@componentes/card/Card'
import { listarTransacoes } from '../../infraestrutura/api/negocio'
import { useEffect, useState } from 'react'
export default function Perfil() {
  const [tx, setTx] = useState<any[]>([])
  useEffect(()=>{ listarTransacoes().then(setTx) },[])
  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <Card titulo='Meu perfil'><p>Minhas informações e configurações (em breve).</p></Card>
      <Card titulo='Minhas transações'>
        {tx.length===0 ? <p>Você ainda não possui transações.</p> : (<ul>{tx.map(t => <li key={t.id}>{t.tipo} — {t.status} — {new Date(t.data).toLocaleDateString()}</li>)}</ul>)}
      </Card>
    </section>
  )
}
