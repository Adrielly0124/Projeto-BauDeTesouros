import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

import ItemForm, { ItemFormData } from "../componentes/forms/ItemForm";
import { uploadImagens } from "../config/storage";
import "../styles/itemEditar.css";

export default function ItemEditar() {
  const { id } = useParams();
  const nav = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [dataOriginal, setDataOriginal] = useState<any>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const ref = doc(db, "itens", id!);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Item não encontrado!");
          return nav(-1);
        }

        const dados = snap.data();

        setDataOriginal({
          ...dados,
          imagensExistentes: dados.imagens || [],
        });

      } catch (e) {
        console.error(e);
        alert("Erro ao carregar item.");
      }

      setCarregando(false);
    }
    carregar();
  }, [id, nav]);

  async function handleSalvar(data: ItemFormData) {
    try {
      let urls = dataOriginal.imagensExistentes;

      // Se tiver novas imagens, faz upload e substitui tudo
      if (data.imagens && data.imagens.length > 0) {
        urls = await uploadImagens(data.imagens);
      }

      await updateDoc(doc(db, "itens", id!), {
        titulo: data.titulo,
        descricao: data.descricao,
        condicao: data.condicao,
        faixaEtaria: data.faixaEtaria,
        local: data.local,
        preco: data.preco ?? null,
        imagens: urls,
      });

      alert("Item atualizado com sucesso!");
      nav("/perfil");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações!");
    }
  }

  if (carregando) return <p className="loading">Carregando...</p>;
  if (!dataOriginal) return null;

  return (
    <div className="editar-container">
      <h2>Editar Item</h2>

      <ItemForm
        kind={dataOriginal.tipo}
        initialData={dataOriginal}   // ⭐ IMPORTANTE: preenche o formulário
        onSubmit={handleSalvar}
        onCancel={() => nav(-1)}
      />
    </div>
  );
}
