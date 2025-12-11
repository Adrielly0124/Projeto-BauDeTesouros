import React, { useEffect, useState } from 'react';
import logo from '../assets/banner.png';
import ItemCard from '../componentes/ItemCard';
import '../styles/landing.css';
import { listarTodosItens } from '../config/itens';
import Layout from '../componentes/Layout';

export default function Home() {
  const [itens, setItens] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const todos = await listarTodosItens();

        const mapped = todos
          .filter((it: any) => it.status !== "indisponivel")
          .sort((a: any, b: any) => (b.criadoEm?.seconds || 0) - (a.criadoEm?.seconds || 0))
          .map((it: any) => ({
            id: it.id,
            name: it.titulo,
            kind: it.tipo,
            image: it.imagens?.[0] || "",
          }));

        setItens(mapped);
      } catch (err) {
        console.error("Erro ao carregar itens da Home:", err);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  const filtrados = itens.filter((it) =>
    it.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Layout>
      {/* Banner */}
      <section className="bt-banner">
        <div className="illus">
          <img src={logo} alt="Logo Baú de Tesouros" />
        </div>
      </section>

      {/* Conteúdo */}
      <section className="bt-row">

        {/* Anúncio */}
        <div className="bt-ads">Espaço para anúncio</div>

        <div className="bt-list">
          <h3>Itens Cadastrados Recentemente</h3>

          {/* Busca */}
          <input
            className="bt-search-bar"
            placeholder="Buscar brinquedos, roupas ou livros..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          {loading && (
            <p style={{ textAlign: "center" }}>Carregando itens...</p>
          )}

          {!loading && filtrados.length === 0 && (
            <p style={{ textAlign: "center", opacity: 0.7 }}>
              Nenhum item encontrado.
            </p>
          )}

          {!loading && filtrados.length > 0 && (
            <div className="bt-grid">
              {filtrados.map((it) => (
                <ItemCard
                  key={it.id}
                  id={it.id}
                  name={it.name}
                  kind={it.kind ?? ""}
                  image={it.image}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
