import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { collection, query, where, onSnapshot } from "firebase/firestore";

const items = [
  { icon:'🏠', label:'INICIO',  path:'/Home' },
  { icon:'🛒', label:'VENDA',   path:'/venda' },
  { icon:'❤️', label:'DOACAO',  path:'/doacao' },
  { icon:'🔄', label:'TROCA',   path:'/troca' },
  { icon:'✉️', label:'CONTATO', path:'/contato' },
  { icon:'👤', label:'PERFIL',  path:'/perfil', isPerfil:true },
];

export default function Sidebar(){
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "notificacoes"),
      where("donoId", "==", auth.currentUser.uid),
      where("status", "==", "pendente")
    );

    const unsub = onSnapshot(q, snap => {
      setNotifCount(snap.size);
    });

    return () => unsub();
  }, [auth.currentUser]);

  return (
    <aside className="bt-sidebar">
      {items.map(it => (
        <NavLink
          key={it.label}
          to={it.path}
          className={({ isActive }) => "bt-navbtn" + (isActive ? " active" : "")}
        >

          {/* Ícone */}
          <span>{it.icon}</span>

          {/* Texto */}
          {it.label}

          {/* Badge apenas no PERFIL */}
          {it.isPerfil && notifCount > 0 && (
            <span className="notif-badge">{notifCount}</span>
          )}
        </NavLink>
      ))}
    </aside>
  );
}
