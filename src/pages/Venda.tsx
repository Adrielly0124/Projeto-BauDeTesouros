import React, { useEffect, useMemo, useState } from 'react';
import logo from '../assets/banner.png';
import ProductGrid, { Produto } from '../componentes/ProductGrid';
import Button from '../componentes/ui/Button';
import { Link } from 'react-router';
import '../styles/home.css';
import { listarItensPorTipo } from '../config/itens';

export default function Venda() {
  const [data, setData] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  // Paginação
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    async function carregar() {
      try {
        const itens = await listarItensPorTipo("venda");

        // 🔥 Agora mapeamos corretamente para o formato do ProductGrid
        const mapped: Produto[] = itens.map((it: any) => ({
          id: it.id,
          name: it.titulo,                 // ✔ Campo correto
          kind: it.tipo,                   // ✔ Campo correto
          imagem: it.imagens?.[0] || ""    // ✔ Pega a primeira imagem
        }));

        setData(mapped);

      } catch (err) {
        console.error("Erro ao carregar itens:", err);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  const totalPages = Math.max(1, Math.ceil(data.length / perPage));

  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  }, [data, page]);

  return (
    <>
      <section className="bt-banner">
        <div className="illus">
          <img 
            src={logo} 
            alt="Baú de Tesouros" 
            style={{ width: '100%', maxWidth: '1000px' }} 
          />
        </div>
      </section>

      <section className="bt-list" style={{ marginTop: 18 }}>
        <h3>Produtos Classificados para Venda</h3>

        {loading && <p style={{ textAlign: "center" }}>Carregando produtos...</p>}

        {!loading && data.length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            Nenhum item encontrado para venda.
          </p>
        )}

        {!loading && data.length > 0 && (
          <ProductGrid items={pageItems} />
        )}

        {/* Paginação */}
        {data.length > perPage && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
            <Button variant="neutral" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              ◀
            </Button>

            <div style={{ alignSelf: 'center', fontWeight: 800 }}>
              {page} / {totalPages}
            </div>

            <Button variant="neutral" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              ▶
            </Button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/venda/novo" style={{ textDecoration: 'none' }}>
            <Button variant="danger">➕ CADASTRAR NOVO ITEM PARA VENDA</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
