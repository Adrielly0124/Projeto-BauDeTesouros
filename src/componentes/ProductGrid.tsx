import React from 'react';
import ItemCard, { Kind } from './ItemCard';
import { Link } from "react-router-dom";

export type Produto = { 
  id: string; 
  name: string; 
  imagem?: string; 
  kind: Kind 
};

export default function ProductGrid({ items }: { items: Produto[] }) {
  if (!items?.length) {
    return (
      <div className="bt-list" style={{ textAlign:'center', padding: 24 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Nenhum item encontrado</div>
        <div style={{ color:'#666' }}>Tente ajustar os filtros ou a busca.</div>
      </div>
    );
  }

  return (
    <div className="bt-grid">
      {items.map((p) => (
        <Link 
          to={`/item/${p.id}`} 
          key={p.id} 
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ItemCard 
            id={p.id}          // <-- obrigatório
            name={p.name}
            image={p.imagem}
            kind={p.kind}
          />
        </Link>
      ))}
    </div>
  );
}
