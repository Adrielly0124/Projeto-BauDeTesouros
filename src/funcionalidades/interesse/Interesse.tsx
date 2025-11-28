import Card from '@componentes/card/Card'
import Input from '@componentes/input/Input'
import Select from '@componentes/select/Select'
import Botao from '@componentes/botao/Botao'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { propor } from '@infraestrutura/api/negocios'
import { useUI } from '@aplicacao/provedores'

export default function Interesse() {
  const { id } = useParams()
  const { notificar } = useUI()
  const nav = useNavigate()

  const [tipo, setTipo] = useState<'compra'|'troca'|'doacao'>('compra')
  const [mensagem, setMensagem] = useState('Olá! Tenho interesse.')
  const [valor, setValor] = useState<number | ''>('')

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    await propor({
      idItem: id!, idProponente: 'usr_local', tipo,
      mensagem, valorProposto: tipo==='compra' ? Number(valor || 0) : null, itensOfertados: []
    })
    notificar('Interesse enviado!')
    nav('/troca')
  }

  return (
    <Card titulo='Confirmar interesse'>
      <form onSubmit={enviar} style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
        <Select rotulo='Tipo de negociação' value={tipo} onChange={e=>setTipo(e.target.value as any)}>
          <option value='compra'>Compra</option>
          <option value='troca'>Troca</option>
          <option value='doacao'>Doação</option>
        </Select>
        {tipo==='compra' && (
          <Input rotulo='Valor proposto (R$)' type='number' min='0' step='0.01' value={valor} onChange={e=>setValor(e.target.value ? Number(e.target.value) : '')} required />
        )}
        <Input rotulo='Mensagem' value={mensagem} onChange={e=>setMensagem(e.target.value)} />
        <div><Botao>Enviar</Botao></div>
      </form>
    </Card>
  )
}
