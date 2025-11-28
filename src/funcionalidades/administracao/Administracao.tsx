import Card from '../../componentes/card/Card'
import Botao from '../../componentes/botao/Botao'
import Badge from '../../componentes/badge/Badge'
import { useEffect, useState } from 'react'
import { useUI } from '../../aplicacao/provedores'

// importe da API de denúncias (não do armazenamento)
import {
  listar as listarDenuncias,
  atualizar as atualizarDenuncia,
  type Denuncia,
  type StatusDenuncia,
} from '../../infraestrutura/api/denuncia'

export default function Administracao() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const { notificar } = useUI()

  async function carregar() {
    const dados = await listarDenuncias()
    setDenuncias(dados)
  }

  useEffect(() => { carregar() }, [])

  async function mudar(id: string, status: StatusDenuncia) {
    await atualizarDenuncia(id, status)
    notificar('Status atualizado')
    carregar()
  }

  return (
    <Card titulo='Moderação e denúncias'>
      {denuncias.length === 0 ? (
        <p>Sem denúncias.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {denuncias.map((d) => (
            <div
              key={d.id}
              style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}
            >
              <div>
                <strong>{d.motivo}</strong> · {d.descricao || '—'} · <Badge texto={d.status} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Botao variante='fantasma' onClick={() => mudar(d.id, 'em_analise')}>Analisar</Botao>
                <Botao onClick={() => mudar(d.id, 'fechada')}>Fechar</Botao>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
