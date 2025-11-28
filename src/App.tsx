import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Layouts
import Topbar from "./componentes/Topbar";
import Sidebar from "./componentes/Sidebar";

// Páginas
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Venda from "./pages/Venda";
import Doacao from "./pages/Doacao";
import Troca from "./pages/Troca";
import Perfil from "./pages/Perfil";
import Contato from "./pages/Contato";
import VendaNovo from "./pages/VendaNovo";
import TrocaNovo from "./pages/TrocaNovo";
import DoacaoNovo from "./pages/DoacaoNovo";
import ItemDetalhes from "./pages/ItemDetalhes";

function MainLayout() {
  return (
    <div className="bt-shell">
      <Topbar />
      <Sidebar />
      <div className="bt-content">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página inicial sem layout (Landing, Login, Cadastro etc.) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />


        {/* Rotas internas com layout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/venda" element={<Venda />} />
          <Route path="/doacao" element={<Doacao />} />
          <Route path="/troca" element={<Troca />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/item/:id" element={<ItemDetalhes />} />


          {/* Subpáginas */}
          <Route path="/venda/novo" element={<VendaNovo />} />
          <Route path="/troca/novo" element={<TrocaNovo />} />
          <Route path="/doacao/novo" element={<DoacaoNovo />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
