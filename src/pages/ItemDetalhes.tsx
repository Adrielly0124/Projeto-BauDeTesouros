import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import "../styles/itemDetalhes.css";
import logo from "../assets/banner.png";
import Button from "../componentes/ui/Button";

export default function ItemDetalhes() {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados — TROCA
  const [abrirTroca, setAbrirTroca] = useState(false);
  const [meuItem, setMeuItem] = useState("");
  const [trocaMsg, setTrocaMsg] = useState("");

  // Estados — DOAÇÃO
  const [abrirDoacao, setAbrirDoacao] = useState(false);
  const [nomeInteressado, setNomeInteressado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensagemD, setMensagemD] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const ref = doc(db, "itens", id!);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Item não encontrado!");
          return nav(-1);
        }

        setData({ id: snap.id, ...snap.data() });

      } catch (error) {
        console.error("Erro ao carregar item:", error);
        alert("Erro ao carregar item.");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id, nav]);

  if (loading) return <p className="loading">Carregando item...</p>;
  if (!data) return null;

  return (
    <>
      {/* Banner */}
      <section className="bt-banner">
        <div className="illus">
          <img 
            src={logo}
            alt="Baú de Tesouros"
            style={{ width: "100%", maxWidth: "1000px" }}
          />
        </div>
      </section>

      <div className="det-container">

        {/* ------- Imagens ------- */}
        <div className="det-imagens">
          {data.imagens?.length > 0 ? (
            data.imagens.map((url: string, i: number) => (
              <img key={i} src={url} alt={`Foto ${i + 1}`} />
            ))
          ) : (
            <div className="sem-imagem">Sem imagens</div>
          )}
        </div>

        {/* ------- Informações ------- */}
        <div className="det-info">

          <h2>{data.titulo}</h2>

          {data.tipo === "venda" && data.preco != null && (
            <p className="det-preco">R$ {Number(data.preco).toFixed(2)}</p>
          )}

          <p><strong>Descrição:</strong> {data.descricao}</p>
          <p><strong>Condição:</strong> {data.condicao}</p>

          {data.faixaEtaria && (
            <p><strong>Faixa etária:</strong> {data.faixaEtaria}</p>
          )}

          <p><strong>Localização:</strong> {data.local}</p>
          <p><strong>Categoria:</strong> {data.tipo.toUpperCase()}</p>

          {/* ------- Botões ------- */}
          <div className="det-btns">

            <Button variant="neutral" onClick={() => nav(-1)}>
              ← Voltar
            </Button>

            <Button variant="primary">
              📩 Conversar com o responsável
            </Button>

            {/* BOTÃO TROCA */}
            {data.tipo === "troca" && (
              <Button 
                variant="success"
                onClick={() => setAbrirTroca(v => !v)}
              >
                🔄 Quero trocar este item
              </Button>
            )}

            {/* BOTÃO DOAÇÃO */}
            {data.tipo === "doacao" && (
              <Button 
                variant="success"
                onClick={() => setAbrirDoacao(v => !v)}
              >
                🎁 Quero receber esta doação
              </Button>
            )}
          </div>

          {/* ------- FORMULÁRIO TROCA ------- */}
          {abrirTroca && (
            <div className="troca-form">
              <h3>Propor troca</h3>

              <label>
                Seu item para troca:
                <input
                  type="text"
                  placeholder="Ex: Motoca azul em bom estado"
                  value={meuItem}
                  onChange={(e) => setMeuItem(e.target.value)}
                />
              </label>

              <label>
                Mensagem:
                <textarea
                  placeholder="Explique sua proposta..."
                  value={trocaMsg}
                  onChange={(e) => setTrocaMsg(e.target.value)}
                />
              </label>

              <div className="troca-buttons">
                <Button 
                  variant="primary"
                  onClick={() => {
                    if (!meuItem.trim()) return alert("Informe seu item.");
                    alert("Proposta enviada!");
                    setAbrirTroca(false);
                  }}
                >
                  Enviar Proposta
                </Button>

                <Button 
                  variant="neutral"
                  onClick={() => setAbrirTroca(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* ------- FORMULÁRIO DOAÇÃO ------- */}
          {abrirDoacao && (
            <div className="doacao-form">
              <h3>Demonstrar interesse</h3>

              <label>
                Seu nome:
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={nomeInteressado}
                  onChange={(e) => setNomeInteressado(e.target.value)}
                />
              </label>

              <label>
                Por que deseja o item?
                <textarea
                  placeholder="Explique o motivo..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </label>

              <label>
                Mensagem adicional (opcional):
                <textarea
                  placeholder="Escreva sua mensagem..."
                  value={mensagemD}
                  onChange={(e) => setMensagemD(e.target.value)}
                />
              </label>

              <div className="doacao-buttons">
                <Button 
                  variant="primary"
                  onClick={() => {
                    if (!nomeInteressado.trim()) return alert("Informe seu nome.");
                    if (!motivo.trim()) return alert("Explique por que deseja o item.");
                    alert("Interesse enviado!");
                    setAbrirDoacao(false);
                  }}
                >
                  Enviar Interesse
                </Button>

                <Button 
                  variant="neutral"
                  onClick={() => setAbrirDoacao(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
