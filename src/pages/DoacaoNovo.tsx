import React from "react";
import { useNavigate } from "react-router";
import logo from "../assets/banner.png";

import ItemForm, { ItemFormData } from "../componentes/forms/ItemForm";
import { uploadImagens } from "../config/storage";
import { criarItem } from "../config/itens";

export default function DoacaoNovo() {
  const nav = useNavigate();

  async function handleSubmit(data: ItemFormData) {
    try {
      // 1. Upload das imagens
        const urls: string[] = []; 

      // 2. Salvar no Firestore
      await criarItem({
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: "doacao",
        preco: 0, // Doação não tem preço
        condicao: data.condicao,
        faixaEtaria: data.faixaEtaria,
        local: data.local,
        imagens: urls,
        criadoEm: new Date(),
      });

      alert("Doação cadastrada com sucesso!");
      nav("/doacao");

    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar item!");
    }
  }

  return (
    <>
      <section className="bt-banner">
        <div className="illus">
          <img 
            src={logo} 
            alt="Baú de Tesouros" 
            style={{ width: "100%", maxWidth: "1000px" }} 
          />
        </div>
      </section>

      <ItemForm
        kind="doacao"
        onSubmit={handleSubmit}
        onCancel={() => nav("/doacao")}
      />
    </>
  );
}
