import { useState } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

// Mock — substituir por chamada real ao endpoint de solicitações
// (GET /adocoes/solicitacoes, PATCH /adocoes/solicitacoes/:id) quando
// o backend tiver isso pronto.
const SOLICITACOES_INICIAIS = [
  { id: 1, pet: "Amora", nomeInteressado: "Carla Mendes", telefone: "(61) 99123-4567", data: "09/07/2026", status: "pendente" },
  { id: 2, pet: "Thor", nomeInteressado: "Rafael Souza", telefone: "(61) 98877-1122", data: "08/07/2026", status: "pendente" },
  { id: 3, pet: "Bartô", nomeInteressado: "Juliana Alves", telefone: "(61) 99234-5566", data: "05/07/2026", status: "aprovada" },
  { id: 4, pet: "Pipoca", nomeInteressado: "Diego Martins", telefone: "(61) 98765-4321", data: "02/07/2026", status: "recusada" },
];

const LABEL_STATUS = {
  pendente: "Pendente",
  aprovada: "Aprovada",
  recusada: "Recusada",
};

const CLASSE_STATUS = {
  pendente: "confirmado",
  aprovada: "concluido",
  recusada: "cancelado",
};

export default function SolicitacoesAdocao() {
  const [solicitacoes, setSolicitacoes] = useState(SOLICITACOES_INICIAIS);

  function decidir(id, novoStatus) {
    // TODO: enviar para o backend (PATCH /adocoes/solicitacoes/:id) quando disponível
    setSolicitacoes(function (prev) {
      return prev.map(function (s) {
        if (s.id === id) {
          return {
            id: s.id,
            pet: s.pet,
            nomeInteressado: s.nomeInteressado,
            telefone: s.telefone,
            data: s.data,
            status: novoStatus,
          };
        }
        return s;
      });
    });
  }

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Solicitações de adoção</h1>
      </div>

      <div className="chew-panel">
        <table className="chew-table">
          <thead>
            <tr>
              <th>Pet</th>
              <th>Interessado</th>
              <th>Contato</th>
              <th>Data</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {solicitacoes.map(function (s) {
              return (
                <tr key={s.id}>
                  <td>{s.pet}</td>
                  <td>{s.nomeInteressado}</td>
                  <td>{s.telefone}</td>
                  <td>{s.data}</td>
                  <td>
                    <span className={"chew-badge " + CLASSE_STATUS[s.status]}>
                      {LABEL_STATUS[s.status]}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    {s.status === "pendente" && (
                      <>
                        <button
                          className="chew-btn-orange"
                          style={{ width: "auto", padding: "6px 14px", fontSize: "0.75rem", marginRight: "8px" }}
                          onClick={function () { decidir(s.id, "aprovada"); }}
                        >
                          Aprovar
                        </button>
                        <button
                          style={{
                            width: "auto",
                            padding: "6px 14px",
                            fontSize: "0.75rem",
                            background: "transparent",
                            border: "1px solid var(--chew-badge-cancelado-text)",
                            color: "var(--chew-badge-cancelado-text)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontWeight: 700,
                          }}
                          onClick={function () { decidir(s.id, "recusada"); }}
                        >
                          Recusar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PainelFuncionarioLayout>
  );
}