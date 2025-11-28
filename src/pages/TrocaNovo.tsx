import React from "react";
import { useNavigate } from "react-router";
import logo from "../assets/banner.png";

import ItemForm, { ItemFormData } from "../componentes/forms/ItemForm";
import { uploadImagens } from "../config/storage";
import { criarItem } from "../config/itens";

export default function TrocaNovo() {
  const nav = useNavigate();

  async function handleSubmit(data: ItemFormData) {
    try {
        const urls: string[] = []; 

      await criarItem({
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: "troca",
        preco: 0,
        condicao: data.condicao,
        faixaEtaria: data.faixaEtaria,
        local: data.local,
        imagens: urls,
        criadoEm: new Date(),
      });

      alert("Item de TROCA cadastrado com sucesso!");
      nav("/troca");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar item!");
    }
  }

  return (
    <>
      <section className="bt-banner">
        <div className="illus">
          <img src={logo} alt="Baú de Tesouros" />
        </div>
      </section>

      <ItemForm kind="troca" onSubmit={handleSubmit} onCancel={() => nav("/troca")} />
    </>
  );
}
