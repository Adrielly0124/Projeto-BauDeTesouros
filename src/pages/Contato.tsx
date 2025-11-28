import React, { useState } from "react";
import "../styles/contato.css";
import { enviarContato } from "../services/emailService";

type Form = { nome: string; email: string; assunto: string; mensagem: string };

export default function Contato() {
  const [form, setForm] = useState<Form>({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function onChange<K extends keyof Form>(key: K, v: Form[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  function validar(f: Form) {
    if (!f.nome.trim()) return "Informe seu nome completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return "E-mail inválido.";
    if (!f.assunto.trim()) return "Informe o assunto.";
    if (!f.mensagem.trim()) return "Escreva sua mensagem.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    const erro = validar(form);
    if (erro) return setErr(erro);

    try {
      setSending(true);

      await enviarContato(form);

      setOk("Mensagem enviada com sucesso! Retornaremos em breve no endereço de email enviado.");
      setForm({ nome: "", email: "", assunto: "", mensagem: "" });

    } catch (error) {
      console.error(error);
      setErr("Erro ao enviar mensagem. Tente novamente mais tarde.");
    }

    setSending(false);
  }

  function limpar() {
    setForm({ nome: "", email: "", assunto: "", mensagem: "" });
    setErr(null);
    setOk(null);
  }

  return (
    <>
      <h2 className="ct-title">Fale Conosco – Baú de Tesouros</h2>

      <section className="ct-card">
        <p className="ct-intro">
          Utilize o formulário abaixo para entrar em contato conosco.
        </p>

        <form className="ct-form" onSubmit={onSubmit}>
          <label>
            Nome Completo:
            <input
              value={form.nome}
              onChange={(e) => onChange("nome", e.target.value)}
              placeholder="Seu nome completo"
            />
          </label>

          <label>
            Seu E-mail:
            <input
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="voce@email.com"
            />
          </label>

          <label>
            Assunto:
            <input
              value={form.assunto}
              onChange={(e) => onChange("assunto", e.target.value)}
              placeholder="Assunto da mensagem"
            />
          </label>

          <label>
            Sua Mensagem:
            <textarea
              rows={6}
              value={form.mensagem}
              onChange={(e) => onChange("mensagem", e.target.value)}
              placeholder="Escreva sua mensagem"
            />
          </label>

          {err && <div className="ct-alert error">{err}</div>}
          {ok && <div className="ct-alert ok">{ok}</div>}

          <div className="ct-actions">
            <button className="ct-btn enviar" type="submit" disabled={sending}>
              {sending ? "Enviando..." : "Enviar"}
            </button>

            <button className="ct-btn limpar" type="button" onClick={limpar}>
              Limpar
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
