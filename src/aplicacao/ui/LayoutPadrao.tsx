import BarraNavegacao from '../ui/barra-navegacao/BarraNavegacao'
import Rodape from '../ui/rodape/Rodape'
import { PropsWithChildren } from 'react'

export default function LayoutPadrao({ children }: PropsWithChildren) {
  return (
    <div data-layout='padrao'>
      <BarraNavegacao />
      <main className='container' style={{ paddingBlock: 'var(--esp-8)' }}>{children}</main>
      <Rodape />
    </div>
  )
}
