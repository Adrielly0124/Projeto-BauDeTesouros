import React from "react";
import { useNavigate } from "react-router";
import logo from "../assets/banner.png";

import ItemForm, { ItemFormData } from "../componentes/forms/ItemForm";
import { uploadImagens } from "../config/storage";
import { criarItem } from "../config/itens";

import { auth } from "../config/firebase";
import { getUsuario } from "../services/authService";
import { criarNotificacao } from "../config/notificacoes";

export default function TrocaNovo() {
  const nav = useNavigate();

  async function handleSubmit(data: ItemFormData) {
    try {
      // ----------------------
      // 1) Upload imagens
      const urls = await uploadImagens(data.imagens);

      // ----------------------
      // 2) Criar item e pegar ID
      const novoItemRef = await criarItem({
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: "troca",
        preco: 0,
        condicao: data.condicao,
        faixaEtaria: data.faixaEtaria,
        local: data.local,
        imagens: urls,
        criadoEm: new Date(),
        donoId: auth.currentUser?.uid, // DONO DO ITEM
      });
      const novoItemId = novoItemRef.id;

      // ----------------------
      // 3) Obter dados do usuário logado
      const user = auth.currentUser;
      if (user) {
        const usuario = await getUsuario(user.uid);

        // ----------------------
        // 4) Criar notificação (opcional)
        await criarNotificacao({
          itemId: novoItemId,
          itemTitulo: data.titulo,
          donoId: user.uid,
          interessadoId: user.uid, // porque foi o criador do item
          interessadoNome: usuario?.nome || "Usuário",
          tipo: "troca",
          mensagem: `Seu item "${data.titulo}" foi cadastrado com sucesso e está disponível para trocas!`,
        });
      }

      alert("Item de TROCA cadastrado com sucesso!");
      nav("/troca");

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
        kind="troca"
        onSubmit={handleSubmit}
        onCancel={() => nav("/troca")}
      />
    </>
  );
}
