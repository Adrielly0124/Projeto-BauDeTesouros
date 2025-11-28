import { useParams } from 'react-router-dom'

export default function DetalheItem() {
  const { id } = useParams()
  return (
    <section>
      <h2>Item #{id}</h2>
      <p>(Detalhes do item, galeria e ações)</p>
    </section>
  )
}
