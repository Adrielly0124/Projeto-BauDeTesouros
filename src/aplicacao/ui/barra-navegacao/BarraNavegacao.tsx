import estilos from '../../ui/barra-navegacao/BarraNavegacao.module.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../aplicacao/provedores'

export default function BarraNavegacao() {
  const { usuario, sair } = useAuth()
    return (
    <header className={estilos.topo}>
      <div className='container'>
        <nav className={estilos.nav}>
          <Link to='/' className={estilos.logo} aria-label='Página inicial'>
            Baú de Tesouros
          </Link>
          <ul className={estilos.links}>
            <li><Link to='/venda'>Venda</Link></li>
            <li><Link to='/doacao'>Doação</Link></li>
            <li><Link to='/troca'>Troca</Link></li>            {usuario ? (
              <>
                <li><Link to='/perfil'>Olá, {usuario.nome.split(' ')[0]}</Link></li>
                {usuario.tipo === 'admin' && <li><Link to='/admin'>Admin</Link></li>}
                <li><button className={estilos.sair} onClick={sair}>Sair</button></li>
              </>
            ) : (
              <li><Link to='/login' className={estilos.entrar}>Entrar</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
