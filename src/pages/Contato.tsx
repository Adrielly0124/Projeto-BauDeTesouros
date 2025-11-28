import React, { useState } from 'react';
import '../styles/contato.css';

type Form = { nome: string; email: string; assunto: string; mensagem: string };

export default function Contato() {
  const [form, setForm] = useState<Form>({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function onChange<K extends keyof Form>(key: K, v: Form[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  function validar(f: Form) {
    if (!f.nome.trim()) return 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return 'E-mail inválido.';
    if (!f.assunto.trim()) return 'Informe o assunto.';
    if (!f.mensagem.trim()) return 'Escreva sua mensagem.';
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    const erro = validar(form);
    if (erro) return setErr(erro);
    setErr(null);
    setSending(true);

    // TODO: integrar com backend / e-mail (ex: API /contato ou serviço como EmailJS)
    await new Promise((r) => setTimeout(r, 700));
    setOk('Mensagem enviada com sucesso! Responderemos em breve.');
    setForm({ nome: '', email: '', assunto: '', mensagem: '' });
    setSending(false);
  }

  function limpar() {
    setForm({ nome: '', email: '', assunto: '', mensagem: '' });
    setErr(null);
    setOk(null);
  }

  return (
    <>
        <h2 className="ct-title">Fale Conosco – Baú de Tesouros</h2>

        <section className="ct-card">
          <p className="ct-intro">
            Prezado(a) cliente,
            <br />
            Utilize o formulário abaixo para entrar em contato conosco. Responderemos o mais breve possível.
          </p>

          <form className="ct-form" onSubmit={onSubmit}>
            <label>
              Nome Completo:
              <input
                value={form.nome}
                onChange={(e) => onChange('nome', e.target.value)}
                placeholder="Seu nome completo"
              />
            </label>

            <label>
              Seu E-mail:
              <input
                type="email"
                value={form.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="voce@email.com"
              />
            </label>

            <label>
              Assunto:
              <input
                value={form.assunto}
                onChange={(e) => onChange('assunto', e.target.value)}
                placeholder="Assunto da mensagem"
              />
            </label>

            <label>
              Sua Mensagem:
              <textarea
                rows={6}
                value={form.mensagem}
                onChange={(e) => onChange('mensagem', e.target.value)}
                placeholder="Escreva aqui sua mensagem"
              />
            </label>

            {err && <div className="ct-alert error">{err}</div>}
            {ok && <div className="ct-alert ok">{ok}</div>}

            <div className="ct-actions">
              <button className="ct-btn enviar" type="submit" disabled={sending}>
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
              <button className="ct-btn limpar" type="button" onClick={limpar}>
                Limpar
              </button>
            </div>
          </form>

          <div className="ct-footer">
            Para outras formas de contato, você também pode nos encontrar no Instagram pelo perfil
            <b> @baudetesouros_oficial</b> ou pelo e-mail <b>baudetesouros.contato@gmail.com</b>.
            <br />
            Estamos à disposição!
          </div>
        </section>
      </>
  );
}
