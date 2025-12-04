import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from './ui/Badge';
import Button from './ui/Button';

export type Kind = 'venda' | 'troca' | 'doacao' | '';  // ← aceitamos vazio

export type ItemCardProps = {
  id: string;
  name: string;
  image?: string;
  kind?: Kind; // ← agora é opcional
};

export default function ItemCard({ id, name, image, kind = "" }: ItemCardProps) {
  const nav = useNavigate();

  function abrirDetalhes() {
    nav(`/item/${id}`);
  }

  return (
    <div className="bt-card">
      <div
        className="thumb"
        onClick={abrirDetalhes}
        style={{ cursor: "pointer" }}
      >
        {image ? <img src={image} alt={name} /> : <span>📦</span>}
      </div>

      <div className="body">
        {/* Só mostra o Badge se houver tipo */}
        {kind && <Badge kind={kind} />}

        <div className="name">{name}</div>

        <Button variant="neutral" size="sm" onClick={abrirDetalhes}>
          Saiba Mais
        </Button>
      </div>
    </div>
  );
}
