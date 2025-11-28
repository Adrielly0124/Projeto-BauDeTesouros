import { useEffect, useMemo, useState } from 'react'
import Card from '../../componentes/card/Card'
import Input from '../../componentes/input/Input'
import Select from '../../componentes/select/Select'
import Botao from '../../componentes/botao/Botao'
import Paginacao from '../../componentes/paginacao/Paginacao'
import { listar } from '../../infraestrutura/api/itens'
import { Link, useLocation } from 'react-router-dom'

const POR_PAG = 12

export default function ListaItens() {
  const loc = useLocation()
  const tipoDaRota: 'venda'|'doacao'|'troca'|'' =
    loc.pathname.startsWith('/venda') ? 'venda' :
    loc.pathname.startsWith('/doacao') ? 'doacao' :
    loc.pathname.startsWith('/troca') ? 'troca' : ''

  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState<'Brinquedos' | 'Roupas' | 'Livros' | 'Acessórios' | ''>('')
  const [ordenar, setOrdenar] = useState<'recentes'|'preco-asc'|'preco-desc' | ''>('recentes')
  const [pagina, setPagina] = useState(1)
  const [itens, setItens] = useState<any[]>([])
  const [carregando, setCarregando] = useState(false)

  async function carregar() {
    setCarregando(true)
    const r = await listar({ busca, categoria: categoria || undefined, ordenar: ordenar || undefined, tipoTransacao: tipoDaRota || undefined })
    setItens(r); setPagina(1)
    setCarregando(false)
  }

  useEffect(()=>{ carregar() }, [tipoDaRota])

  const totalPaginas = Math.max(1, Math.ceil(itens.length / POR_PAG))
  const visiveis = useMemo(()=>{
    const ini = (pagina-1)*POR_PAG
    return itens.slice(ini, ini+POR_PAG)
  }, [itens, pagina])

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <Card titulo='Catálogo'>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr 1fr auto' }}>
          <Input placeholder='Buscar itens' value={busca} onChange={e=>setBusca(e.target.value)} />
          <Select value={categoria} onChange={e=>setCategoria(e.target.value as typeof categoria)}>
            <option value=''>Todas as categorias</option>
            <option>Brinquedos</option>
            <option>Roupas</option>
            <option>Livros</option>
            <option>Acessórios</option>
          </Select>
          <Select value={ordenar} onChange={e=>setOrdenar(e.target.value as any)}>
            <option value='recentes'>Mais recentes</option>
            <option value='preco-asc'>Preço: menor → maior</option>
            <option value='preco-desc'>Preço: maior → menor</option>
          </Select>
          <Botao onClick={carregar} disabled={carregando}>Aplicar</Botao>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {visiveis.map((i) => (
          <Card key={i.id} titulo={i.titulo} acoes={<Link to={`/item/${i.id}`}>Abrir</Link>}>
            <img src={i.imagens?.[0]} alt='' style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} />
            <div style={{ display: 'grid', gap: 6 }}>
              <small>{i.categoria} · {i.condicao}</small>
              <strong>{i.preco ? `R$ ${i.preco.toFixed(2)}` : (i.tipoTransacao==='doacao' ? 'Doação' : 'Troca')}</strong>
            </div>
          </Card>
        ))}
      </div>

      <Paginacao pagina={pagina} totalPaginas={totalPaginas} onMudar={setPagina} />
    </section>
  )
}
