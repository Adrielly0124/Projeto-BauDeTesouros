import { Route, Routes, Navigate } from 'react-router-dom'
import PaginaInicial from '../funcionalidades/catalogo/PaginaInicial'
import Login from '../funcionalidades/autenticacao/Login'
import Cadastro from '../funcionalidades/autenticacao/Cadastro'
import Perfil from '../funcionalidades/perfil/Perfil'
import DetalheItem from '../funcionalidades/catalogo/DetalheItem'
import ListaItens from '../funcionalidades/catalogo/ListaItens'
import FormularioItem from '../funcionalidades/item/FormularioItem'
import Troca from '../funcionalidades/troca/Troca'
import Administracao from '../funcionalidades/administracao/Administracao'
import Interesse from '../funcionalidades/interesse/Interesse'
import LayoutPadrao from './ui/LayoutPadrao'
import RotaProtegida from './RotaProtegida'
//npm install react-router-dom && npm install -D @types/react @types/react-dom @types/react-router-dom
export default function Rotas() {
  return (
    <LayoutPadrao>
      <Routes>
        <Route path='/' element={<PaginaInicial />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />} />

        <Route path='/venda' element={<ListaItens />} />
        <Route path='/doacao' element={<ListaItens />} />
        <Route path='/troca' element={
          <RotaProtegida>
            <Troca />
          </RotaProtegida>
        } />
        <Route path='/venda/novo' element={
          <RotaProtegida>
            <FormularioItem />
          </RotaProtegida>
        } />
        <Route path='/item/:id' element={<DetalheItem />} />
        <Route path='/item/:id/editar' element={
          <RotaProtegida>
            <FormularioItem />
          </RotaProtegida>
        } />

        <Route path='/interesse/:id' element={
          <RotaProtegida>
            <Interesse />
          </RotaProtegida>
        } />

        <Route path='/perfil' element={
          <RotaProtegida>
            <Perfil />
          </RotaProtegida>
        } />

        <Route path='/admin' element={
          <RotaProtegida somenteAdmin>
            <Administracao />
          </RotaProtegida>
        } />

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </LayoutPadrao>
  )
}
