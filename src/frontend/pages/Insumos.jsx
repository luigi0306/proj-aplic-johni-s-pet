import { useState, useEffect } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

const LIMITE_ESTOQUE_BAIXO = 10;

const PEDIDOS_INICIAIS = [
  { id: 1, nome: "Álcool 70%", quantidade: 20, status: "pendente" },
];

const LABEL_STATUS_PEDIDO = {
  pendente: "Pendente",
  comprado: "Comprado",
};

export default function Insumos() {
  const [estoque, setEstoque] = useState([]);
  const [insumoSelecionado, setInsumoSelecionado] = useState("");
  const [quantidadeUsada, setQuantidadeUsada] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const [pedidos, setPedidos] = useState([]);
  const [nomePedido, setNomePedido] = useState("");
  const [quantidadePedido, setQuantidadePedido] = useState(1);
  const [loading, setLoading] = useState(true);

  async function carregarEstoque() {
    try {
      const res = await fetch("http://localhost:3000/api/insumos");
      if (!res.ok) throw new Error("Erro ao buscar estoque de insumos.");
      const data = await res.json();
      setEstoque(data);
      if (data.length > 0) {
        setInsumoSelecionado(function (prev) {
          const existe = data.some(item => item.id_insumo === Number(prev));
          return existe ? prev : data[0].id_insumo;
        });
      }
    } catch (err) {
      console.error(err);
      setMensagem("Não foi possível carregar o estoque: " + err.message);
      setTipoMensagem("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarEstoque();

    try {
      const savedPedidos = localStorage.getItem("chew_pedidos_compra");
      if (savedPedidos) {
        setPedidos(JSON.parse(savedPedidos));
      } else {
        setPedidos(PEDIDOS_INICIAIS);
        localStorage.setItem("chew_pedidos_compra", JSON.stringify(PEDIDOS_INICIAIS));
      }
    } catch (e) {
      console.error("Erro ao ler pedidos do localStorage", e);
      setPedidos(PEDIDOS_INICIAIS);
    }
  }, []);

  async function handleRegistrar(e) {
    e.preventDefault();
    const qtd = Number(quantidadeUsada);
    if (!qtd || qtd <= 0 || !insumoSelecionado) {
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/insumos/uso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_insumo: Number(insumoSelecionado),
          quantidade_usada: qtd,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || "Erro ao registrar uso.");
      }

      const insumo = estoque.find(item => item.id_insumo === Number(insumoSelecionado));
      const nomeInsumo = insumo ? insumo.nome : "insumo";

      setMensagem(`Baixa de ${qtd} unidade(s) de "${nomeInsumo}" registrada — estoque atualizado.`);
      setTipoMensagem("success");
      setQuantidadeUsada(1);

      await carregarEstoque();
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao registrar uso: " + err.message);
      setTipoMensagem("error");
    }
  }

  function handleRegistrarPedido(e) {
    e.preventDefault();
    if (!nomePedido || !quantidadePedido) {
      return;
    }

    const novo = {
      id: Date.now(),
      nome: nomePedido,
      quantidade: Number(quantidadePedido),
      status: "pendente",
    };

    const novosPedidos = [novo, ...pedidos];
    setPedidos(novosPedidos);
    localStorage.setItem("chew_pedidos_compra", JSON.stringify(novosPedidos));
    setNomePedido("");
    setQuantidadePedido(1);
  }

  async function marcarComoComprado(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    try {
      const nomeNormalizado = pedido.nome.trim().toLowerCase();
      const insumoExistente = estoque.find(
        item => item.nome.trim().toLowerCase() === nomeNormalizado
      );

      if (insumoExistente) {
        const novaQtd = insumoExistente.quantidade_estoque + pedido.quantidade;
        const res = await fetch(`http://localhost:3000/api/insumos/${insumoExistente.id_insumo}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantidade_estoque: novaQtd
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || errData.message || "Erro ao atualizar estoque.");
        }
      } else {
        const res = await fetch("http://localhost:3000/api/insumos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: pedido.nome,
            quantidade_estoque: pedido.quantidade
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || errData.message || "Erro ao criar novo insumo.");
        }
      }

      const novosPedidos = pedidos.map(function (p) {
        if (p.id === id) {
          return { ...p, status: "comprado" };
        }
        return p;
      });
      setPedidos(novosPedidos);
      localStorage.setItem("chew_pedidos_compra", JSON.stringify(novosPedidos));

      setMensagem(`Pedido de "${pedido.nome}" comprado — estoque atualizado.`);
      setTipoMensagem("success");

      await carregarEstoque();
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao processar compra: " + err.message);
      setTipoMensagem("error");
    }
  }

  function recomprarPedido(id) {
    const novosPedidos = pedidos.map(function (p) {
      if (p.id === id) {
        return {
          ...p,
          status: "pendente",
        };
      }
      return p;
    });

    setPedidos(novosPedidos);
    localStorage.setItem(
      "chew_pedidos_compra",
      JSON.stringify(novosPedidos)
    );

    setMensagem("Pedido marcado para recompra.");
    setTipoMensagem("success");
  }

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Insumos</h1>
      </div>

      {loading ? (
        <div className="chew-panel" style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "var(--chew-text-muted-light)" }}>Carregando insumos...</p>
        </div>
      ) : (
        <>
          <div className="chew-content-grid">
            <div className="chew-panel">
              <h2 className="chew-panel-title">Registrar uso de insumo</h2>
              {estoque.length === 0 ? (
                <p style={{ color: "var(--chew-text-muted-light)" }}>Nenhum insumo disponível no estoque.</p>
              ) : (
                <form onSubmit={handleRegistrar}>
                  <label className="chew-field-label">Insumo</label>
                  <select
                    className="chew-input-dark"
                    value={insumoSelecionado}
                    onChange={function (e) { setInsumoSelecionado(Number(e.target.value)); }}
                  >
                    {estoque.map(function (item) {
                      return (
                        <option key={item.id_insumo} value={item.id_insumo}>
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
              )}

              {mensagem && (
                <div
                  className={tipoMensagem === "success" ? "chew-success-hint" : "chew-login-alert"}
                  style={{ marginTop: "1rem", marginBottom: "0rem" }}
                >
                  {mensagem}
                </div>
              )}
            </div>

            <div className="chew-panel">
              <h2 className="chew-panel-title">Estoque atual</h2>
              <div className="chew-table-scroll">
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
                        <tr key={item.id_insumo}>
                          <td>{item.nome}</td>
                          <td>
                            <span
                              className={
                                item.quantidade_estoque <= LIMITE_ESTOQUE_BAIXO
                                  ? "chew-badge estoque-baixo"
                                  : ""
                              }
                            >
                              {item.quantidade_estoque}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
              <div className="chew-table-scroll">
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
                            {p.status === "pendente" ? (
                              <button
                                className="chew-btn-orange"
                                style={{
                                  width: "auto",
                                  padding: "6px 14px",
                                  fontSize: "0.75rem",
                                }}
                                onClick={() => marcarComoComprado(p.id)}
                              >
                                Marcar comprado
                              </button>
                            ) : (
                              <button
                                className="chew-btn-orange"
                                style={{
                                  width: "auto",
                                  padding: "6px 14px",
                                  fontSize: "0.75rem",
                                  background: "#2e7d32",
                                }}
                                onClick={() => recomprarPedido(p.id)}
                              >
                                Recomprar
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
          </div>
        </>
      )}
    </PainelFuncionarioLayout>
  );
}