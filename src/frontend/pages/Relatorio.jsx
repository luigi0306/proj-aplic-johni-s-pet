import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

// TODO: trocar pela URL real da API quando o backend estiver pronto.
// O endpoint precisa devolver um JSON no formato:
// {
//   "faturamento": number,
//   "gastos": number,
//   "vendas": [{ "categoria": string, "total": number }],
//   "despesas": [{ "categoria": string, "total": number }]
// }
const URL_API_RELATORIO = "/api/relatorio";

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Relatorio() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(function () {
    async function buscarDados() {
      try {
        const resposta = await fetch(URL_API_RELATORIO);
        if (!resposta.ok) {
          throw new Error("Resposta não OK");
        }
        const json = await resposta.json();
        setDados(json);
        setErro("");
      } catch (e) {
        setErro(
          "Não foi possível carregar os dados do relatório. O endpoint " +
            URL_API_RELATORIO +
            " ainda não está disponível no backend."
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  function gerarPdf() {
    if (!dados) return;

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Relatório CHEW!! - Faturamento e Gastos", 14, y);
    y += 12;

    doc.setFontSize(11);
    const hoje = new Date().toLocaleDateString("pt-BR");
    doc.text("Emitido em: " + hoje, 14, y);
    y += 14;

    doc.setFontSize(13);
    doc.text("Resumo geral", 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.text("Faturamento: " + formatarMoeda(dados.faturamento), 14, y);
    y += 7;
    doc.text("Gastos: " + formatarMoeda(dados.gastos), 14, y);
    y += 7;
    doc.text("Saldo: " + formatarMoeda(dados.faturamento - dados.gastos), 14, y);
    y += 14;

    doc.setFontSize(13);
    doc.text("Vendas por categoria", 14, y);
    y += 8;
    doc.setFontSize(11);
    dados.vendas.forEach(function (v) {
      doc.text(v.categoria + ": " + formatarMoeda(v.total), 14, y);
      y += 7;
    });
    y += 8;

    doc.setFontSize(13);
    doc.text("Despesas por categoria", 14, y);
    y += 8;
    doc.setFontSize(11);
    dados.despesas.forEach(function (d) {
      doc.text(d.categoria + ": " + formatarMoeda(d.total), 14, y);
      y += 7;
    });

    doc.save("relatorio-chew.pdf");
  }

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Relatório</h1>
      </div>

      {carregando && (
        <div className="chew-panel">
          <p style={{ color: "var(--chew-text-muted-light)" }}>Carregando dados...</p>
        </div>
      )}

      {!carregando && erro && (
        <div className="chew-panel">
          <p style={{ color: "var(--chew-badge-cancelado-text)", fontWeight: 700 }}>{erro}</p>
        </div>
      )}

      {!carregando && !erro && dados && (
        <>
          <div className="chew-content-grid">
            <div className="chew-panel">
              <h2 className="chew-panel-title">Resumo do mês</h2>
              <table className="chew-table">
                <tbody>
                  <tr>
                    <td>Faturamento</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      {formatarMoeda(dados.faturamento)}
                    </td>
                  </tr>
                  <tr>
                    <td>Gastos</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      {formatarMoeda(dados.gastos)}
                    </td>
                  </tr>
                  <tr>
                    <td>Saldo</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      {formatarMoeda(dados.faturamento - dados.gastos)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="chew-panel">
              <h2 className="chew-panel-title">Vendas por categoria</h2>
              <table className="chew-table">
                <tbody>
                  {dados.vendas.map(function (v) {
                    return (
                      <tr key={v.categoria}>
                        <td>{v.categoria}</td>
                        <td style={{ textAlign: "right" }}>{formatarMoeda(v.total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="chew-panel" style={{ marginTop: "1.5rem" }}>
            <h2 className="chew-panel-title">Despesas por categoria</h2>
            <table className="chew-table">
              <tbody>
                {dados.despesas.map(function (d) {
                  return (
                    <tr key={d.categoria}>
                      <td>{d.categoria}</td>
                      <td style={{ textAlign: "right" }}>{formatarMoeda(d.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button
              className="chew-btn-orange"
              style={{ width: "auto", padding: "12px 28px", marginTop: "1.2rem" }}
              onClick={gerarPdf}
            >
              Baixar PDF do relatório
            </button>
          </div>
        </>
      )}
    </PainelFuncionarioLayout>
  );
}