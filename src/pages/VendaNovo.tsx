import React from "react";
import { useNavigate } from "react-router";
import logo from "../assets/banner.png";

import ItemForm, { ItemFormData } from "../componentes/forms/ItemForm";
import { uploadImagens } from "../config/storage";
import { criarItem } from "../config/itens";

export default function VendaNovo() {
  const nav = useNavigate();

  async function handleSubmit(data: ItemFormData) {
    try {
      // 🔥 Upload real das imagens
      const urls = await uploadImagens(data.imagens);

      // 🔥 Salvando no Firestore
      await criarItem({
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: "venda",
        preco: data.preco ?? 0,
        condicao: data.condicao,
        faixaEtaria: data.faixaEtaria,
        local: data.local,
        imagens: urls,          // agora vai com URLs válidas!
        criadoEm: new Date(),
      });

      alert("Item de VENDA cadastrado com sucesso!");
      nav("/venda");

    } catch (err) {
      console.error("Erro ao cadastrar item:", err);
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

      <ItemForm
        kind="venda"
        onSubmit={handleSubmit}
        onCancel={() => nav("/venda")}
      />
    </>
  );
}
