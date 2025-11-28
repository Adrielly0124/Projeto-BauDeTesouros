import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import logo from "../assets/logo.png";
import "../styles/topbar.css";
import { getUsuario } from "../services/authService";


export default function Topbar() {
  const [user, setUser] = useState<any>(null);

 useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (u) => {
    if (u) {
      const dados = await getUsuario(u.uid); // ← pega do Firestore
      setUser({
        email: u.email,
        nome: dados?.nome || "Usuário",
      });
    } else {
      setUser(null);
    }
  });

  return () => unsub();
}, []);

  async function handleLogout() {
    await signOut(auth);
    window.location.href = "/login"; // redireciona
  }

  return (
    <header className="bt-topbar">
      {/* LOGO */}
      <div className="bt-logo">
        <img src={logo} alt="Baú de Tesouros" />
      </div>

      {/* DIREITA: informações do usuário */}
      <div className="bt-topbar-right">

        {user ? (
          <>
            <div className="user-info">
              <strong>{user.nome}</strong>
              <span>{user.email}</span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <span className="user-info">Não logado</span>
        )}
      </div>
    </header>
  );
}
