import React, { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import '../../styles/cadastroItem.css';
import ImageUploader, { UploadFile } from './ImageUploader';

export type ItemKind = 'venda' | 'troca' | 'doacao';

export type ItemFormData = {
  titulo: string;
  descricao: string;
  preco?: number | null;   // <--- corrigido!
  condicao: 'novo' | 'seminovo' | 'usado';
  faixaEtaria?: string;
  local: string;
  imagens: UploadFile[];
};

export default function ItemForm({
  kind,
  onSubmit,
  onCancel
}: {
  kind: ItemKind;
  onSubmit: (data: ItemFormData) => Promise<void> | void;
  onCancel?: () => void;
}) {
  
  const [data, setData] = useState<ItemFormData>({
    titulo: '',
    descricao: '',
    preco: null,              // <--- corrigido!
    condicao: 'seminovo',
    faixaEtaria: '6-8 anos',
    local: '',
    imagens: []
  });

  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function validate(): string | null {
    if (!data.titulo.trim()) return 'Informe o título do item.';
    if (kind === 'venda' && (data.preco == null || isNaN(data.preco))) {
      return 'Informe o preço.';
    }
    if (!data.local.trim()) return 'Informe a localização.';
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);

    setSending(true);
    await onSubmit(data);
    setSending(false);
  }

  return (
    <form onSubmit={submit} className="cad-container cad-form">
      <h3 style={{ textAlign: 'center', marginBottom: 12 }}>
        {kind === 'venda'
          ? 'Cadastrar Novo Item para Venda'
          : kind === 'troca'
          ? 'Cadastrar Novo Item para Troca'
          : 'Cadastrar Nova Doação'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            Título do item:
            <Input
              value={data.titulo}
              onChange={(e) => setData((d) => ({ ...d, titulo: e.target.value }))}
            />
          </label>

          {kind === 'venda' && (
            <label>
              Preço (R$):
              <Input
                type="number"
                step="0.01"
                value={data.preco ?? ''}  // <--- corrigido
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    preco: e.target.value === '' ? null : Number(e.target.value)
                  }))
                }
              />
            </label>
          )}

          <label>
            Condição:
            <Select
              value={data.condicao}
              onChange={(e) =>
                setData((d) => ({ ...d, condicao: e.target.value as any }))
              }
            >
              <option value="novo">Novo</option>
              <option value="seminovo">Seminovo</option>
              <option value="usado">Usado</option>
            </Select>
          </label>

          <label>
            Faixa etária:
            <Select
              value={data.faixaEtaria}
              onChange={(e) =>
                setData((d) => ({ ...d, faixaEtaria: e.target.value }))
              }
            >
              <option>0-2 anos</option>
              <option>3-5 anos</option>
              <option>6-8 anos</option>
              <option>9-12 anos</option>
              <option>13+ anos</option>
            </Select>
          </label>

          <label>
            Localização (Cidade - UF):
            <Input
              value={data.local}
              onChange={(e) => setData((d) => ({ ...d, local: e.target.value }))}
            />
          </label>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            Descrição:
            <Textarea
              rows={8}
              value={data.descricao}
              onChange={(e) =>
                setData((d) => ({ ...d, descricao: e.target.value }))
              }
            />
          </label>

          <label>
            Imagens:
            <ImageUploader
              files={data.imagens}
              onChange={(f) => setData((d) => ({ ...d, imagens: f }))}
            />
          </label>
        </div>
      </div>

      {err && (
        <div
          style={{
            marginTop: 12,
            background: '#ffe6e6',
            border: '2px solid #ffb3c0',
            color: '#b30020',
            borderRadius: 10,
            padding: '10px 12px',
            fontWeight: 700
          }}
        >
          {err}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
        <Button
          type="submit"
          variant={
            kind === 'venda' ? 'danger' :
            kind === 'troca' ? 'primary' : 'success'
          }
        >
          {sending ? 'Salvando...' : 'Salvar'}
        </Button>

        {onCancel && (
          <Button type="button" variant="neutral" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
