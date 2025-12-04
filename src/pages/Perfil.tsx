import React, { useEffect, useState } from "react";
import "../styles/perfil.css";

import { auth, db } from "../config/firebase";
import { getUsuario } from "../services/authService";
import { listarMeusItens, marcarItemComoIndisponivel } from "../config/itens";

import {
  listarNotificacoesDoUsuario,
  atualizarStatusNotificacao,
  criarNotificacaoResposta,
} from "../config/notificacoes";

import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const AVATARES = ["👦", "👧", "🧒", "🐻", "🐱", "🧸", "🎀", "🌟"];

export default function Perfil() {
  const [usuario, setUsuario] = useState<any>(null);
  const [meusItens, setMeusItens] = useState<any[]>([]);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    local: "",
    avatar: "👦",
  });

  // ---------------------------------------------------------
  // CARREGAR PERFIL + ITENS + NOTIFICAÇÕES
  // ---------------------------------------------------------
  useEffect(() => {
    async function carregar() {
      const u = auth.currentUser;
      if (!u) return;

      const dados = await getUsuario(u.uid);
      setUsuario({ uid: u.uid, ...dados });

      setForm({
        nome: dados?.nome || "",
        email: dados?.email || u.email || "",
        local: dados?.local || "",
        avatar: dados?.avatar || "👦",
      });

      const itens = await listarMeusItens();
      setMeusItens(itens);

      const notifs = await listarNotificacoesDoUsuario(u.uid);

      // ⭐ Aqui corrigimos o filtro
      const filtradas = notifs
        .filter((n: any) =>
          (n.tipo === "troca" || n.tipo === "doacao") &&
          n.status === "pendente"
        )
        .map((n: any) => ({
          id: n.id,
          tipo: n.tipo,
          interessadoId: n.interessadoId,
          interessadoNome: n.interessadoNome,
          itemId: n.itemId,
          itemTitulo: n.itemTitulo,
          criadoEm: n.criadoEm,
        }));

      setNotificacoes(filtradas);
      setLoading(false);
    }

    carregar();
  }, []);

  // ---------------------------------------------------------
  // SALVAR PERFIL
  // ---------------------------------------------------------
  async function salvarPerfil(e: React.FormEvent) {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "usuarios", usuario.uid), {
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

  // ---------------------------------------------------------
  // EXCLUIR ITEM
  // ---------------------------------------------------------
  async function excluirItem(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      await deleteDoc(doc(db, "itens", id));
      setMeusItens(prev => prev.filter(p => p.id !== id));
      alert("Item excluído com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir item!");
    }
  }

  // ---------------------------------------------------------
  // ACEITAR INTERESSE
  // ---------------------------------------------------------
  async function aceitar(n: any) {
    try {
      await atualizarStatusNotificacao(n.id, "aceita");
      await marcarItemComoIndisponivel(n.itemId);

      await criarNotificacaoResposta({
        donoId: usuario.uid,
        interessadoId: n.interessadoId,
        itemId: n.itemId,
        itemTitulo: n.itemTitulo,
        resposta: "aceita",
      });

      // Atualiza estado sem recarregar a página
      setNotificacoes(prev => prev.filter(x => x.id !== n.id));
      alert("Interesse aceito!");

    } catch (err) {
      console.error(err);
      alert("Erro ao aceitar interesse.");
    }
  }

  // ---------------------------------------------------------
  // RECUSAR INTERESSE
  // ---------------------------------------------------------
  async function recusar(n: any) {
    try {
      await atualizarStatusNotificacao(n.id, "recusada");

      await criarNotificacaoResposta({
        donoId: usuario.uid,
        interessadoId: n.interessadoId,
        itemId: n.itemId,
        itemTitulo: n.itemTitulo,
        resposta: "recusada",
      });

      setNotificacoes(prev => prev.filter(x => x.id !== n.id));
      alert("Interesse recusado!");

    } catch (err) {
      console.error(err);
      alert("Erro ao recusar interesse.");
    }
  }

  // ---------------------------------------------------------
  // INTERFACE MANTIDA EXATAMENTE COMO A SUA
  // ---------------------------------------------------------
  if (loading) return <p style={{ textAlign: "center" }}>Carregando...</p>;

  return (
    <>
      <h2 className="pf-title">Perfil do Usuário</h2>

      <div className="pf-grid">

        {/* ---------- CARD DE ATUALIZAR PERFIL (inalterado) ---------- */}
        <section className="pf-card pf-form">
          <p className="pf-help">Atualize suas informações abaixo.</p>

          <form onSubmit={salvarPerfil} className="pf-form-fields">
            
            <label>Nome Completo:
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </label>

            <label>E-mail:
              <input type="email" value={form.email} disabled />
            </label>

            <label>Localização:
              <input
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
              />
            </label>

            <label>Avatar:
              <div className="pf-avatar-options">
                {AVATARES.map(a => (
                  <span
                    key={a}
                    className={`pf-avatar-choice ${form.avatar === a ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, avatar: a })}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </label>

            <button className="pf-btn salvar" type="submit">Salvar</button>
          </form>
        </section>

        {/* ---------- CARD DO USUÁRIO (inalterado) ---------- */}
        <section className="pf-user-card">
          <div className="pf-avatar">{form.avatar}</div>
          <div className="pf-user-info">
            <div className="pf-name">{form.nome}</div>
            <div className="pf-email">{form.email}</div>
            <div className="pf-local">{form.local}</div>
          </div>
        </section>

        {/* ---------- NOTIFICAÇÕES (layout mantido) ---------- */}
        <section className="pf-notifs-card">
          <h3 className="pf-subtitle">Notificações de Interesse ({notificacoes.length})</h3>

          {notificacoes.length === 0 && (
            <p style={{ opacity: 0.6 }}>Nenhuma notificação.</p>
          )}

          {notificacoes.map(n => (
            <div key={n.id} className="pf-notif-card">
              <p>
                <strong>{n.interessadoNome}</strong> demonstrou interesse em <strong>{n.itemTitulo}</strong>.
              </p>
              <small>{new Date(n.criadoEm.seconds * 1000).toLocaleString()}</small>

              <div className="pf-notif-actions">
                <button className="pf-btn aceitar" onClick={() => aceitar(n)}>✔ Aceitar</button>
                <button className="pf-btn recusar" onClick={() => recusar(n)}>✖ Recusar</button>
              </div>
            </div>
          ))}
        </section>

        {/* ---------- MEUS ITENS (inalterado) ---------- */}
        <section className="pf-items-card">
          <h3 className="pf-subtitle">Meus Itens Cadastrados</h3>

          <div className="pf-products">
            {meusItens.map(p => (
              <article key={p.id} className="pf-prod-card">

                <div className="pf-prod-thumb">
                  {p.imagens?.[0]
                    ? <img src={p.imagens[0]} alt={p.titulo} />
                    : <span>🧩</span>}
                </div>

                <div className="pf-prod-body">
                  <div className="pf-prod-name">{p.titulo}</div>
                  <div className="pf-prod-status">{p.tipo?.toUpperCase()}</div>
                </div>

                <button className="pf-btn excluir" onClick={() => excluirItem(p.id)}>
                  🗑 Excluir
                </button>

              </article>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
