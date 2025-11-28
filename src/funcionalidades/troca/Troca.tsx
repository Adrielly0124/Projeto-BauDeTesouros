import Card from '../../componentes/card/Card'
import Botao from '../../componentes/botao/Botao'
import { listarPropostas, responderProposta } from '../../infraestrutura/api/negocio'
import { useEffect, useState } from 'react'
import Badge from '../../componentes/badge/Badge'
import { useUI } from '../../aplicacao/provedores'

export default function Troca() {
  const [propostas, setPropostas] = useState<any[]>([])
  const { notificar } = useUI()
  async function carregar() { setPropostas(await listarPropostas()) }
  useEffect(()=>{ carregar() }, [])
  async function acao(id: string, status: 'aceita'|'rejeitada'|'contraproposta') {
    await responderProposta(id, status as any); notificar(`Proposta ${status}`); carregar()
  }
  return (
    <Card titulo='Minhas propostas de troca'>
      {propostas.length===0 ? <p>Você ainda não possui propostas.</p> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {propostas.map(p => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
              <div><strong>{p.tipo.toUpperCase()}</strong> · Item: {p.idItem} · Mensagem: {p.mensagem || '—'} <Badge texto={p.status} cor={p.status==='aceita' ? 'sucesso' : p.status==='rejeitada' ? 'erro' : 'padrao'} /></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Botao variante='fantasma' onClick={()=>acao(p.id,'contraproposta')}>Contrapropor</Botao>
                <Botao variante='fantasma' onClick={()=>acao(p.id,'rejeitada')}>Rejeitar</Botao>
                <Botao onClick={()=>acao(p.id,'aceita')}>Aceitar</Botao>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
