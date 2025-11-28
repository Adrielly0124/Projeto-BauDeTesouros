import React from "react";
import { useNavigate } from "react-router";
import logo from "../assets/banner.png";

import ItemForm, { ItemFormData } from "../componentes/forms/ItemForm";
import { uploadImagens } from "../config/storage";
import { criarItem } from "../config/itens";

import { auth } from "../config/firebase";
import { getUsuario } from "../services/authService";
import { criarNotificacao } from "../config/notificacoes";

export default function DoacaoNovo() {
  const nav = useNavigate();

  async function handleSubmit(data: ItemFormData) {
    try {
      // ---------------------------------------
      // 1) Upload real das imagens
      const urls = await uploadImagens(data.imagens);

      // ---------------------------------------
      // 2) Criar item e obter o ID retornado
      const novoItemId = await criarItem({
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: "doacao",
        preco: 0,
        condicao: data.condicao,
        faixaEtaria: data.faixaEtaria,
        local: data.local,
        imagens: urls,
        criadoEm: new Date(),
        donoId: auth.currentUser?.uid, // <<< DONO DO ITEM
      });

      // ---------------------------------------
      // 3) Buscar usuário logado
      const user = auth.currentUser;

      if (user) {
        const usuario = await getUsuario(user.uid);

        // ---------------------------------------
        // 4) Criar notificação da doação
        await criarNotificacao({
          itemId: novoItemId.id,
          itemTitulo: data.titulo,
          donoId: user.uid,
          interessadoId: user.uid, // é o criador do item
          interessadoNome: usuario?.nome || "Usuário",
          tipo: "doacao",
          mensagem: `Seu item de doação "${data.titulo}" foi cadastrado e está disponível para interessados.`,
        });
      }

      alert("Doação cadastrada com sucesso!");
      nav("/doacao");

    } catch (err) {
      console.error("Erro ao cadastrar item:", err);
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
