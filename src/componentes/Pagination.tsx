import React from 'react';
import Button from './ui/Button';

type Props = {
  page: number;
  total: number;   // total de páginas
  onChange: (p: number) => void;
};

export default function Pagination({ page, total, onChange }: Props){
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(total, page + 1));

  return (
    <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:14 }}>
      <Button variant="neutral" size="sm" onClick={prev} disabled={page===1}>◀</Button>
      <div style={{ alignSelf:'center', fontWeight:800 }}>{page} / {total}</div>
      <Button variant="neutral" size="sm" onClick={next} disabled={page===total}>▶</Button>
    </div>
  );
}
