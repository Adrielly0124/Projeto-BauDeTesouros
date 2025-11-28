import React from 'react';

type Kind = 'venda' | 'troca' | 'doacao';

const colors: Record<Kind, string> = {
  venda:  'var(--rosa)',
  troca:  'var(--azul)',
  doacao: 'var(--verde)'
};

export default function Badge({ kind, children }: { kind: Kind; children?: React.ReactNode }) {
  return (
    <span
      className="bt-chip"
      style={{ background: colors[kind] }}
    >
      {children ?? (kind === 'venda' ? 'VENDA' : kind === 'troca' ? 'TROCA' : 'DOAÇÃO')}
    </span>
  );
}
