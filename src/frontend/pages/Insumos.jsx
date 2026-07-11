import { useState } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

// Mock — substituir por chamada real ao endpoint de estoque (FastAPI)
const ESTOQUE_INICIAL = [
  { id: 1, nome: "Shampoo neutro", quantidade: 35 },
  { id: 2, nome: "Luvas descartáveis (par)", quantidade: 200 },
  { id: 3, nome: "Seringas", quantidade: 150 },
  { id: 4, nome: "Álcool 70%", quantidade: 8 },
];

const LIMITE_ESTOQUE_BAIXO = 10;

// Mock — lista de pedidos de compra. Substituir por endpoint real
// (POST/GET /insumos/pedidos) quando o backend tiver isso pronto.
const PEDIDOS_INICIAIS = [
  { id: 1, nome: "Álcool 70%", quantidade: 20, status: "pendente" },
];

const LABEL_STATUS_PEDIDO = {
  pendente: "Pendente",
  comprado: "Comprado",
};

export default function Insumos() {
  const [estoque, setEstoque] = useState(ESTOQUE_INICIAL);
  const [insumoSelecionado, setInsumoSelecionado] = useState(
    ESTOQUE_INICIAL[0].nome
  );
  const [quantidadeUsada, setQuantidadeUsada] = useState(1);
  const [mensagem, setMensagem] = useState("");

  const [pedidos, setPedidos] = useState(PEDIDOS_INICIAIS);
  const [nomePedido, setNomePedido] = useState("");
  const [quantidadePedido, setQuantidadePedido] = useState(1);

  function handleRegistrar(e) {
    e.preventDefault();
    const qtd = Number(quantidadeUsada);
    if (!qtd || qtd <= 0) {
      return;
    }

    // TODO: enviar para o backend (POST /insumos/uso) quando disponível
    const novoEstoque = estoque.map(function (item) {
      if (item.nome === insumoSelecionado) {
        const restante = item.quantidade - qtd;
        const quantidadeFinal = restante < 0 ? 0 : restante;
        return { id: item.id, nome: item.nome, quantidade: quantidadeFinal };
      }
      return item;
    });

    setEstoque(novoEstoque);
    setMensagem("Baixa de " + qtd + " unidade(s) registrada — estoque atualizado automaticamente.");
  }

  function getClasseEstoque(quantidade) {
    if (quantidade <= LIMITE_ESTOQUE_BAIXO) {
      return "chew-badge estoque-baixo";
    }
    return "";
  }

  function handleRegistrarPedido(e) {
    e.preventDefault();
    if (!nomePedido || !quantidadePedido) {
      return;
    }

    // TODO: enviar para o backend (POST /insumos/pedidos) quando disponível
    const novo = {
      id: Date.now(),
      nome: nomePedido,
      quantidade: Number(quantidadePedido),
      status: "pendente",
    };

    setPedidos([novo, ...pedidos]);
    setNomePedido("");
    setQuantidadePedido(1);
  }

  function marcarComoComprado(id) {
    // TODO: enviar para o backend (PATCH /insumos/pedidos/:id) quando disponível
    setPedidos(function (prev) {
      return prev.map(function (p) {
        if (p.id === id) {
          return { id: p.id, nome: p.nome, quantidade: p.quantidade, status: "comprado" };
        }
        return p;
      });
    });
  }

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Insumos</h1>
      </div>

      <div className="chew-content-grid">
        <div className="chew-panel">
          <h2 className="chew-panel-title">Registrar uso de insumo</h2>
          <form onSubmit={handleRegistrar}>
            <label className="chew-field-label">Insumo</label>
            <select
              className="chew-input-dark"
              value={insumoSelecionado}
              onChange={function (e) { setInsumoSelecionado(e.target.value); }}
            >
              {estoque.map(function (item) {
                return (
                  <option key={item.id} value={item.nome}>
                    {item.nome}
                  </option>
                );
              })}
            </select>

            <label className="chew-field-label">Quantidade usada</label>
            <input
              type="number"
              min="1"
              className="chew-input-dark"
              value={quantidadeUsada}
              onChange={function (e) { setQuantidadeUsada(e.target.value); }}
            />

            <button type="submit" className="chew-btn-orange">
              Registrar uso
            </button>
          </form>

          {mensagem && <div className="chew-success-hint">{mensagem}</div>}
        </div>

        <div className="chew-panel">
          <h2 className="chew-panel-title">Estoque atual</h2>
          <table className="chew-table">
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Estoque atual</th>
              </tr>
            </thead>
            <tbody>
              {estoque.map(function (item) {
                return (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>
                      <span
                        className={
                          item.quantidade <= LIMITE_ESTOQUE_BAIXO
                            ? "chew-badge estoque-baixo"
                            : ""
                        }
                      >
                        {item.quantidade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chew-content-grid" style={{ marginTop: "1.5rem" }}>
        <div className="chew-panel">
          <h2 className="chew-panel-title">Solicitar compra</h2>
          <form onSubmit={handleRegistrarPedido}>
            <label className="chew-field-label">O que precisa comprar</label>
            <input
              className="chew-input-dark"
              placeholder="Ex: Shampoo antipulgas"
              value={nomePedido}
              onChange={function (e) { setNomePedido(e.target.value); }}
              required
            />

            <label className="chew-field-label">Quantidade desejada</label>
            <input
              type="number"
              min="1"
              className="chew-input-dark"
              value={quantidadePedido}
              onChange={function (e) { setQuantidadePedido(e.target.value); }}
            />

            <button type="submit" className="chew-btn-orange">
              Registrar pedido
            </button>
          </form>
        </div>

        <div className="chew-panel">
          <h2 className="chew-panel-title">Pedidos de compra</h2>
          <table className="chew-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qtd.</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(function (p) {
                return (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.quantidade}</td>
                    <td>
                      <span
                        className={
                          "chew-badge " +
                          (p.status === "comprado" ? "concluido" : "confirmado")
                        }
                      >
                        {LABEL_STATUS_PEDIDO[p.status]}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {p.status === "pendente" && (
                        <button
                          className="chew-btn-orange"
                          style={{ width: "auto", padding: "6px 14px", fontSize: "0.75rem" }}
                          onClick={function () { marcarComoComprado(p.id); }}
                        >
                          Marcar comprado
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PainelFuncionarioLayout>
  );
}