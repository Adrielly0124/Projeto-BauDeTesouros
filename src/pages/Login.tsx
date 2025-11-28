import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

import "../styles/login.css";
import logo from "../assets/logo.png";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    setMensagem("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);

      navigate("/home");
      
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/wrong-password") {
        setMensagem("Senha incorreta.");
      } else if (error.code === "auth/user-not-found") {
        setMensagem("Usuário não encontrado.");
      } else if (error.code === "auth/invalid-email") {
        setMensagem("E-mail inválido.");
      } else {
        setMensagem("Erro ao fazer login.");
      }
    }

    setLoading(false);
  }

  return (
    <div className="login-bg">
      <div className="login-card">

        <img src={logo} alt="Baú de Tesouros" className="login-logo" />

        <h2 className="login-title">Login</h2>

        <label className="login-label">E-MAIL</label>
        <input
          type="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="login-label">SENHA</label>
        <input
          type="password"
          className="login-input"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <a href="/Home"><button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "ENTRAR"}
        </button></a>

        {mensagem && <p className="login-msg">{mensagem}</p>}
      </div>
    </div>
  );
};

export default Login;
