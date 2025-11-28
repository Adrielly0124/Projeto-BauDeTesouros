import React, { useEffect, useState } from 'react';
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
  preco?: number | null;
  condicao: 'novo' | 'seminovo' | 'usado';
  faixaEtaria?: string;
  local: string;
  imagens: UploadFile[];
};

export default function ItemForm({
  kind,
  onSubmit,
  onCancel,
  initialData
}: {
  kind: ItemKind;
  onSubmit: (data: ItemFormData) => Promise<void> | void;
  onCancel?: () => void;
  initialData?: Partial<ItemFormData>;
}) {

  const [data, setData] = useState<ItemFormData>({
    titulo: '',
    descricao: '',
    preco: null,
    condicao: 'seminovo',
    faixaEtaria: '6-8 anos',
    local: '',
    imagens: []
  });

  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // 🔥 Quando estiver editando → preenche automaticamente
  useEffect(() => {
    if (initialData) {
      setData(d => ({
        ...d,
        titulo: initialData.titulo ?? '',
        descricao: initialData.descricao ?? '',
        preco: initialData.preco ?? null,
        condicao: initialData.condicao ?? 'seminovo',
        faixaEtaria: initialData.faixaEtaria ?? '6-8 anos',
        local: initialData.local ?? '',
        imagens: [] // imagens antigas NÃO são UploadFile (serão mantidas no backend)
      }));
    }
  }, [initialData]);

  function validate(): string | null {
    if (!data.titulo.trim()) return 'Informe o título do item.';
    if (kind === 'venda' && (data.preco === null || isNaN(Number(data.preco)))) {
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
        {initialData
          ? 'Editar Item'
          : kind === 'venda'
          ? 'Cadastrar Novo Item para Venda'
          : kind === 'troca'
          ? 'Cadastrar Novo Item para Troca'
          : 'Cadastrar Nova Doação'}
      </h3>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

        {/* COLUNA ESQUERDA */}
        <div style={{ display:'grid', gap:12 }}>
          
          <label>
            Título do item:
            <Input 
              value={data.titulo}
              onChange={e => setData(d => ({ ...d, titulo: e.target.value }))}
            />
          </label>

          {/* SOMENTE PARA VENDA */}
          {kind === 'venda' && (
            <label>
              Preço (R$):
              <Input
                type="number"
                step="0.01"
                value={data.preco ?? ""}
                onChange={e =>
                  setData(d => ({
                    ...d,
                    preco: e.target.value === "" ? null : Number(e.target.value)
                  }))
                }
              />
            </label>
          )}

          <label>
            Condição:
            <Select
              value={data.condicao}
              onChange={e => setData(d => ({ ...d, condicao: e.target.value as any }))}
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
              onChange={e => setData(d => ({ ...d, faixaEtaria: e.target.value }))}
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
              onChange={e => setData(d => ({ ...d, local: e.target.value }))}
            />
          </label>
        </div>

        {/* COLUNA DIREITA */}
        <div style={{ display:'grid', gap:12 }}>
          
          <label>
            Descrição:
            <Textarea
              rows={8}
              value={data.descricao}
              onChange={e => setData(d => ({ ...d, descricao: e.target.value }))}
            />
          </label>

          <label>
            Imagens (envie novas imagens para substituir):
            <ImageUploader
              files={data.imagens}
              onChange={f => setData(d => ({ ...d, imagens:f }))}
            />
          </label>

          {initialData?.imagens?.length ? (
            <p style={{ fontSize:13, opacity:0.7 }}>
              Este item já possui imagens salvas.  
              Se você enviar novas imagens, as antigas serão substituídas.
            </p>
          ) : null}
        </div>
      </div>

      {/* ERRO */}
      {err && (
        <div
          style={{
            marginTop:12,
            background:'#ffe6e6',
            border:'2px solid #ffb3c0',
            color:'#b30020',
            borderRadius:10,
            padding:'10px 12px',
            fontWeight:700
          }}
        >
          {err}
        </div>
      )}

      {/* BOTÕES */}
      <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:16 }}>
        
        <Button
          type="submit"
          variant={
            kind === 'venda'
              ? 'danger'
              : kind === 'troca'
              ? 'primary'
              : 'success'
          }
        >
          {sending ? 'Salvando...' : (initialData ? 'Salvar Alterações' : 'Salvar')}
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
