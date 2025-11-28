import React, { useEffect, useState } from "react";
import "../styles/perfil.css";
import { auth, db } from "../config/firebase";
import { getUsuario } from "../services/authService";
import { listarMeusItens } from "../config/itens";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AVATARES = ["👦", "👧", "🧒", "🐻", "🐱", "🧸", "🎀", "🌟"];

export default function Perfil() {
  const nav = useNavigate();

  const [usuario, setUsuario] = useState<any>(null);
  const [meusItens, setMeusItens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    usuario: "",
    nome: "",
    email: "",
    local: "",
    avatar: "👦",
  });

  useEffect(() => {
    async function carregar() {
      const u = auth.currentUser;
      if (!u) return;

      const dados = await getUsuario(u.uid);
      setUsuario(dados);

      setForm({
        usuario: dados?.nome || "",
        nome: dados?.nome || "",
        email: dados?.email || "",
        local: dados?.local || "",
        avatar: dados?.avatar || "👦",
      });

      const itens = await listarMeusItens();
      setMeusItens(itens);

      setLoading(false);
    }

    carregar();
  }, []);

  // ------------ SALVAR PERFIL -------------
  async function salvarPerfil(e: React.FormEvent) {
    e.preventDefault();

    try {
      const ref = doc(db, "usuarios", auth.currentUser!.uid);

      await updateDoc(ref, {
        handle: form.usuario,
        nome: form.nome,
        local: form.local,
        avatar: form.avatar,
      });

      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar perfil!");
    }
  }

  // ------------ EXCLUIR ITEM -------------
  async function excluirItem(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      await deleteDoc(doc(db, "itens", id));
      setMeusItens((prev) => prev.filter((p) => p.id !== id));
      alert("Item excluído com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir item!");
    }
  }

  if (loading) return <p style={{ textAlign: "center" }}>Carregando...</p>;

  return (
    <>
      <h2 className="pf-title">Perfil do Usuário</h2>

      <div className="pf-grid">

        {/* -------- FORMULÁRIO -------- */}
        <section className="pf-card pf-form">
          <p className="pf-help">
            Atualize suas informações abaixo.
          </p>

          <form onSubmit={salvarPerfil} className="pf-form-fields">
            <label>
              Nome Completo:
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </label>

            <label>
              E-mail:
              <input type="email" value={form.email} disabled />
            </label>

            <label>
              Localização:
              <input
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
                placeholder="Cidade - UF"
              />
            </label>

            {/* --- ESCOLHA DE AVATAR --- */}
            <label>
              Escolha seu Avatar:
              <div className="pf-avatar-options">
                {AVATARES.map((a) => (
                  <span
                    key={a}
                    className={`pf-avatar-choice ${
                      form.avatar === a ? "selected" : ""
                    }`}
                    onClick={() => setForm({ ...form, avatar: a })}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </label>

            <div className="pf-actions">
              <button type="submit" className="pf-btn salvar">Salvar</button>
              <button type="button" className="pf-btn cancelar">
                Cancelar
              </button>
            </div>
          </form>
        </section>

        {/* -------- PRODUTOS -------- */}
        <section className="pf-right">

          {/* CARD DO USUÁRIO */}
          <div className="pf-user">
            <div className="pf-avatar">
              <div className="pf-avatar-icon">{form.avatar}</div>
            </div>

            <div className="pf-user-info">
              <div className="pf-handle">{form.usuario}</div>
              <div className="pf-name">{form.nome}</div>
              <div className="pf-email">{form.email}</div>
              <div className="pf-local">{form.local}</div>
            </div>
          </div>

          <h3 className="pf-subtitle">Meus Itens Cadastrados</h3>

          <div className="pf-products">
            {meusItens.length === 0 && (
              <p style={{ opacity: 0.7 }}>Você ainda não cadastrou itens.</p>
            )}

            {meusItens.map((p) => (
              <article key={p.id} className="pf-prod-card">

                <div className="pf-prod-thumb">
                  {p.imagens?.length > 0 ? (
                    <img src={p.imagens[0]} alt={p.titulo} />
                  ) : (
                    <span>🧩</span>
                  )}
                </div>

                <div className="pf-prod-body">
                  <div className="pf-prod-name">{p.titulo}</div>
                  <div className="pf-prod-status">{p.tipo.toUpperCase()}</div>
                  <div className="pf-prod-date">
                    cadastrado em{" "}
                    {new Date(
                      p.criadoEm?.seconds
                        ? p.criadoEm.seconds * 1000
                        : p.criadoEm
                    ).toLocaleDateString()}
                  </div>
                </div>

                <div className="pf-prod-actions">
                  <button
                    className="pf-btn editar"
                    onClick={() => nav(`/item/editar/${p.id}`)}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    className="pf-btn excluir"
                    onClick={() => excluirItem(p.id)}
                  >
                    🗑 Excluir
                  </button>
                </div>

              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
