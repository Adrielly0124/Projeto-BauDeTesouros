import React, { useState } from 'react';
import '../styles/perfil.css';

type Produto = {
  id: string;
  nome: string;
  imagem?: string;
  status: 'NAO_VENDIDO' | 'VENDIDO';
  data: string; // dd/mm/aa
};

export default function Perfil() {
  // Mock do usuário
  const [usuario, setUsuario] = useState({
    handle: '@Mamãe Criativa',
    nomeCompleto: 'Gislaine Pereira Araújo',
    email: 'gis.laine.arau@gmail.com',
    localizacao: 'Limeira - SP',
  });

  // Mock de produtos
  const [produtos] = useState<Produto[]>([
    { id: '1', nome: 'Brinquedo Interativo', status: 'NAO_VENDIDO', data: '12/03/25' },
    { id: '2', nome: 'Brinquedo Interativo', status: 'NAO_VENDIDO', data: '12/03/25' },
    { id: '3', nome: 'Jogo Educativo', status: 'VENDIDO', data: '02/04/25' },
  ]);

  // State do formulário (edição)
  const [form, setForm] = useState({
    usuario: 'mamae.criativa',
    nome: usuario.nomeCompleto,
    email: usuario.email,
    local: usuario.localizacao,
  });

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    setUsuario({
      handle: form.usuario?.startsWith('@') ? form.usuario : `@${form.usuario}`,
      nomeCompleto: form.nome,
      email: form.email,
      localizacao: form.local,
    });
    // aqui no futuro: chamar API
    alert('Perfil atualizado com sucesso!');
  }

  function cancelar() {
    setForm({
      usuario: usuario.handle.replace(/^@/, ''),
      nome: usuario.nomeCompleto,
      email: usuario.email,
      local: usuario.localizacao,
    });
  }

  return (
    <>
        <h2 className="pf-title">Página de Perfil do Usuário</h2>

        <div className="pf-grid">
          {/* Formulário à esquerda */}
          <section className="pf-card pf-form">
            <p className="pf-help">
              Olá! Você pode editar as informações do seu perfil na Baú de Tesouros.
              Por favor, preencha os campos abaixo com as informações que você deseja atualizar.
            </p>

            <form onSubmit={salvar} className="pf-form-fields">
              <label>
                Nome de Usuário:
                <input
                  value={form.usuario}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                  placeholder="seu.usuario"
                  required
                />
              </label>

              <label>
                Seu Nome Completo:
                <input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Seu nome"
                  required
                />
              </label>

              <label>
                Seu E-mail:
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="voce@email.com"
                  required
                />
              </label>

              <label>
                Sua Localização (Cidade, Estado):
                <input
                  value={form.local}
                  onChange={(e) => setForm({ ...form, local: e.target.value })}
                  placeholder="Cidade - UF"
                />
              </label>

              <div className="pf-actions">
                <button type="submit" className="pf-btn salvar">Salvar</button>
                <button type="button" className="pf-btn cancelar" onClick={cancelar}>Cancelar</button>
              </div>
            </form>
          </section>

          {/* Card do usuário à direita */}
          <section className="pf-right">
            <div className="pf-user">
              <div className="pf-avatar" aria-hidden>
                <div className="pf-avatar-icon">👤</div>
              </div>
<br></br>
              <div className="pf-user-info">
                <div className="pf-handle">{usuario.handle}</div>
                <div className="pf-name">{usuario.nomeCompleto}</div>
                <div className="pf-email">{usuario.email}</div>
                <div className="pf-local">{usuario.localizacao}</div>
              </div>
            </div>

            <h3 className="pf-subtitle">Produtos Cadastrados</h3>

            <div className="pf-products">
              {produtos.map((p) => (
                <article key={p.id} className="pf-prod-card">
                  <div className="pf-prod-thumb">
                    {/* quando tiver imagem real, troque pelo src */}
                    <span role="img" aria-label="produto">🧩</span>
                  </div>
                  <div className="pf-prod-body">
                    <div className="pf-prod-name">{p.nome}</div>
                    <div className="pf-prod-status">{p.status === 'NAO_VENDIDO' ? 'NÃO VENDIDO' : 'VENDIDO'}</div>
                    <div className="pf-prod-date">cadastrado em {p.data}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </>
  );
}
