import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/cadastro.css";

import { registrarUsuario } from "../services/authService";
import logo from "../assets/logo.png";

export default function Cadastro() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Avatares disponíveis
  const AVATARES = ["🧒", "👧", "👦", "🧑", "👩", "👨"];

  type TipoUsuario = "" | "responsavel" | "Instituicao";

  const [form, setForm] = useState<{
    tipo: TipoUsuario;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    repetirSenha: string;
    avatar: string;
  }>({
    tipo: "",
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    repetirSenha: "",
    avatar: AVATARES[0], // avatar padrão
  });

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!form.tipo) return setErro("Selecione o tipo de usuário.");
    if (!form.nome.trim()) return setErro("Digite o nome.");
    if (!form.email.includes("@")) return setErro("E-mail inválido.");
    if (!form.cpf.trim()) return setErro("Digite o CPF/CNPJ.");
    if (form.senha.length < 6) return setErro("Senha mínima de 6 caracteres.");
    if (form.senha !== form.repetirSenha) return setErro("As senhas não coincidem.");

    setErro("");
    setLoading(true);

    try {
      await registrarUsuario({
        tipo: form.tipo,
        nome: form.nome,
        email: form.email,
        cpf: form.cpf,
        senha: form.senha,
        avatar: form.avatar, // <-- ENVIA O AVATAR ESCOLHIDO
      });

      navigate("/login");
    } catch (error: any) {
      console.error(error);

      let msg = "Erro ao cadastrar.";

      if (error.code === "auth/email-already-in-use") msg = "E-mail já está em uso.";
      if (error.code === "auth/invalid-email") msg = "E-mail inválido.";
      if (error.code === "auth/weak-password") msg = "Senha muito fraca.";

      setErro(msg);
    }

    setLoading(false);
  }

  return (
    <div className="cadastro-bg">
      <div className="cadastro-card">
          
        {erro && <div className="cadastro-erro">{erro}</div>}

        <form onSubmit={handleSubmit} className="cadastro-form">

          <label>Tipo de usuário</label>
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="responsavel">Responsável</option>
            <option value="instituicao">Instituição</option>
          </select>

          <label>Nome Completo</label>
          <input name="nome" value={form.nome} onChange={handleChange} />

          <label>E-mail</label>
          <input name="email" value={form.email} onChange={handleChange} />

          <label>CPF/CNPJ</label>
          <input name="cpf" value={form.cpf} onChange={handleChange} />

          <label>Senha</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
          />

          <label>Confirmar Senha</label>
          <input
            type="password"
            name="repetirSenha"
            value={form.repetirSenha}
            onChange={handleChange}
          />

          {/* ------------------ AVATAR ------------------ */}
          <label>Escolha seu avatar</label>
          <div className="avatar-grid">
            {AVATARES.map((a) => (
              <div
                key={a}
                className={`avatar-opcao ${form.avatar === a ? "selected" : ""}`}
                onClick={() => setForm({ ...form, avatar: a })}
              >
                {a}
              </div>
            ))}
          </div>

          {/* Botão corrigido */}
          <button type="submit" className="cadastro-btn" disabled={loading}>
            {loading ? "Cadastrando..." : "CADASTRAR"}
          </button>
        </form>
      </div>
    </div>
  );
}
