import Input from '../../componentes/input/Input'
import Select from '../../componentes/select/Select'
import Checkbox from '../../componentes/checkbox/Checkbox'
import Botao from '../../componentes/botao/Botao'
import Card from '../../componentes/card/Card'
import { useState, useEffect } from 'react'
import { criar, obter, atualizar } from '../../infraestrutura/api/itens'
import { useNavigate, useParams } from 'react-router-dom'
import { useUI } from '../../aplicacao/provedores'

const CATEGORIAS = ['Brinquedos','Roupas','Livros','Acessórios'] as const
const CONDICOES = ['Novo','Pouco uso','Usado'] as const

export default function FormularioItem() {
  const nav = useNavigate()
  const { id } = useParams()
  const { notificar } = useUI()

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState<'Brinquedos'|'Roupas'|'Livros'|'Acessórios'>(CATEGORIAS[0])
  const [condicao, setCondicao] = useState<'Novo'|'Pouco uso'|'Usado'>(CONDICOES[0])
  const [tipoTransacao, setTipoTransacao] = useState<'venda'|'doacao'|'troca'>('venda')
  const [preco, setPreco] = useState<number | ''>('')
  const [aceitaTroca, setAceitaTroca] = useState(true)
  const [imagens, setImagens] = useState<string[]>([])
  const [localizacaoCidade, setCidade] = useState('Limeira')
  const [localizacaoEstado, setEstado] = useState('SP')

  useEffect(()=>{
    if (!id) return
    obter(id).then((i)=>{
      if(!i) return
      setTitulo(i.titulo); setDescricao(i.descricao); setCategoria(i.categoria); setCondicao(i.condicao)
      setTipoTransacao(i.tipoTransacao); setPreco(i.preco ?? ''); setAceitaTroca(i.aceitaTroca); setImagens(i.imagens)
      setCidade(i.localizacaoCidade); setEstado(i.localizacaoEstado)
    })
  },[id])

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      titulo, descricao, categoria, condicao, tipoTransacao,
      preco: tipoTransacao==='venda' ? Number(preco || 0) : null,
      aceitaTroca, imagens: imagens.length ? imagens : ['https://singlecolorimage.com/get/3b82f6/640x480'],
      localizacaoCidade, localizacaoEstado
    }
    if (id) { await atualizar(id, payload); notificar('Item atualizado!'); nav(`/item/${id}`) }
    else { const novo = await criar(payload as any); notificar('Item publicado!'); nav(`/item/${novo.id}`) }
  }

  return (
    <Card titulo={id ? 'Editar item' : 'Novo item'}>
      <form onSubmit={salvar} style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        <Input rotulo='Título' value={titulo} onChange={e=>setTitulo(e.target.value)} required />
        <Input rotulo='Descrição' value={descricao} onChange={e=>setDescricao(e.target.value)} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Select rotulo='Categoria' value={categoria} onChange={e=>setCategoria(e.target.value as typeof categoria)}>{CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}</Select>
          <Select rotulo='Condição' value={condicao} onChange={e=>setCondicao(e.target.value as typeof condicao)}>{CONDICOES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
          <Select rotulo='Transação' value={tipoTransacao} onChange={e=>setTipoTransacao(e.target.value as any)}>
            <option value='venda'>Venda</option><option value='doacao'>Doação</option><option value='troca'>Troca</option>
          </Select>
        </div>
        {tipoTransacao==='venda' && <Input rotulo='Preço (R$)' type='number' min='0' step='0.01' value={preco} onChange={e=>setPreco(e.target.value ? Number(e.target.value) : '')} required />}
        <Checkbox rotulo='Aceita troca' checked={aceitaTroca} onChange={e=>setAceitaTroca(e.target.checked)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input rotulo='Cidade' value={localizacaoCidade} onChange={e=>setCidade(e.target.value)} required />
          <Input rotulo='Estado' value={localizacaoEstado} onChange={e=>setEstado(e.target.value)} required />
        </div>
        <div><Botao>{id ? 'Salvar alterações' : 'Publicar item'}</Botao></div>
      </form>
    </Card>
  )
}
