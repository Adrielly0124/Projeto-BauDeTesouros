import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { icon:'🏠', label:'INICIO',  path:'/Home' },
  { icon:'🛒', label:'VENDA',   path:'/venda' },
  { icon:'❤️', label:'DOACAO',  path:'/doacao' },
  { icon:'🔄', label:'TROCA',   path:'/troca' },
  { icon:'✉️', label:'CONTATO', path:'/contato' },
  { icon:'👤', label:'PERFIL',  path:'/perfil' },
];

export default function Sidebar(){
  return (
    <aside className="bt-sidebar">
      {items.map(it => (
        <NavLink
          key={it.label}
          to={it.path}
          className={({ isActive }) => "bt-navbtn" + (isActive ? " active" : "")}
        >
          <span>{it.icon}</span>
          {it.label}
        </NavLink>
      ))}
    </aside>
  );
}
