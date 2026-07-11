import { useState } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

// Mock — lugares fictícios por enquanto. Substituir pelo endpoint real
// de áreas/setores quando o backend tiver isso pronto.
const AREAS_INICIAIS = [
  { id: 1, nome: "Clínica Veterinária", status: "pendente" },
  { id: 2, nome: "Loja", status: "limpo" },
  { id: 3, nome: "Sala de Banho e Tosa", status: "urgente" },
  { id: 4, nome: "Canil", status: "pendente" },
  { id: 5, nome: "Gatil", status: "limpo" },
  { id: 6, nome: "Recepção", status: "pendente" },
  { id: 7, nome: "Estoque", status: "limpo" },
];

const LABEL_STATUS = {
  limpo: "Limpo",
  pendente: "Pendente",
  urgente: "Urgente",
};

// reaproveitando as cores de badge que já existem no painel:
// concluido (verde) = limpo, confirmado (âmbar) = pendente, cancelado (vermelho) = urgente
const CLASSE_STATUS = {
  limpo: "concluido",
  pendente: "confirmado",
  urgente: "cancelado",
};

const OPCOES_STATUS = ["limpo", "pendente", "urgente"];

export default function Limpeza() {
  const [areas, setAreas] = useState(AREAS_INICIAIS);

  function mudarStatus(id, novoStatus) {
    // TODO: enviar para o backend (PATCH /areas/:id) quando disponível
    setAreas(function (prev) {
      return prev.map(function (a) {
        if (a.id === id) {
          return { id: a.id, nome: a.nome, status: novoStatus };
        }
        return a;
      });
    });
  }

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Áreas de limpeza</h1>
      </div>

      <div className="chew-panel">
        <table className="chew-table">
          <thead>
            <tr>
              <th>Área</th>
              <th>Status</th>
              <th>Atualizar status</th>
            </tr>
          </thead>
          <tbody>
            {areas.map(function (a) {
              return (
                <tr key={a.id}>
                  <td>{a.nome}</td>
                  <td>
                    <span className={"chew-badge " + CLASSE_STATUS[a.status]}>
                      {LABEL_STATUS[a.status]}
                    </span>
                  </td>
                  <td>
                    <select
                      className="chew-input-dark"
                      style={{ marginBottom: 0, width: "auto", minWidth: "150px" }}
                      value={a.status}
                      onChange={function (e) { mudarStatus(a.id, e.target.value); }}
                    >
                      {OPCOES_STATUS.map(function (op) {
                        return (
                          <option key={op} value={op}>
                            {LABEL_STATUS[op]}
                          </option>
                        );
                      })}
                    </select>
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