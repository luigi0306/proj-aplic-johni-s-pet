import { useState } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

// Mock — substituir por chamada real ao endpoint de agendamentos (FastAPI)
const AGENDAMENTOS_INICIAIS = [
  { id: 1, pet: "Amora", tutor: "Carla Mendes", data: "9 de julho", horario: "10:00", tipo: "Banho", status: "agendado" },
  { id: 2, pet: "Thor", tutor: "Rafael Souza", data: "9 de julho", horario: "14:30", tipo: "Consulta", status: "confirmado" },
  { id: 3, pet: "Fred", tutor: "Juliana Alves", data: "8 de julho", horario: "09:00", tipo: "Vacina", status: "concluido" },
  { id: 4, pet: "Bartô", tutor: "Diego Martins", data: "7 de julho", horario: "16:00", tipo: "Tosa", status: "cancelado" },
];

const LABEL_STATUS = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const OPCOES_STATUS = ["agendado", "confirmado", "concluido", "cancelado"];
const OPCOES_TIPO = ["Consulta", "Vacinação", "Banho", "Tosa", "Exames", "Retorno"];

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_INICIAIS);

  const [novoPet, setNovoPet] = useState("");
  const [novoTutor, setNovoTutor] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");
  const [novoTipo, setNovoTipo] = useState(OPCOES_TIPO[0]);

  function mudarStatus(id, novoStatus) {
    // TODO: enviar para o backend (PATCH /agendamentos/:id) quando disponível
    setAgendamentos(function (prev) {
      return prev.map(function (a) {
        if (a.id === id) {
          return { ...a, status: novoStatus };
        }
        return a;
      });
    });
  }

  function handleNovoAgendamento(e) {
    e.preventDefault();
    if (!novoPet || !novoTutor || !novaData || !novoHorario) return;

    // TODO: enviar para o backend (POST /agendamentos) quando disponível
    const novo = {
      id: Date.now(),
      pet: novoPet,
      tutor: novoTutor,
      data: novaData,
      horario: novoHorario,
      tipo: novoTipo,
      status: "agendado",
    };

    setAgendamentos([novo, ...agendamentos]);
    setNovoPet("");
    setNovoTutor("");
    setNovaData("");
    setNovoHorario("");
  }

  const total = agendamentos.length;
  const contagem = OPCOES_STATUS.reduce(function (acc, status) {
    acc[status] = agendamentos.filter(function (a) { return a.status === status; }).length;
    return acc;
  }, {});

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Agendamentos</h1>
      </div>

      <div className="chew-content-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: "1.5rem" }}>
        <div className="chew-panel" style={{ textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--chew-text-dark)" }}>{total}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--chew-text-muted-light)" }}>Total</div>
        </div>
        <div className="chew-panel" style={{ textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--chew-badge-agendado-text)" }}>{contagem.agendado || 0}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--chew-text-muted-light)" }}>Agendados</div>
        </div>
        <div className="chew-panel" style={{ textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--chew-badge-confirmado-text)" }}>{contagem.confirmado || 0}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--chew-text-muted-light)" }}>Confirmados</div>
        </div>
        <div className="chew-panel" style={{ textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--chew-badge-concluido-text)" }}>{contagem.concluido || 0}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--chew-text-muted-light)" }}>Concluídos</div>
        </div>
        <div className="chew-panel" style={{ textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--chew-badge-cancelado-text)" }}>{contagem.cancelado || 0}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--chew-text-muted-light)" }}>Cancelados</div>
        </div>
      </div>

      <div className="chew-content-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="chew-panel">
          <h2 className="chew-panel-title">Novo agendamento</h2>
          <form onSubmit={handleNovoAgendamento}>
            <label className="chew-field-label">Pet</label>
            <input
              className="chew-input-dark"
              placeholder="Nome do pet"
              value={novoPet}
              onChange={function (e) { setNovoPet(e.target.value); }}
              required
            />

            <label className="chew-field-label">Tutor</label>
            <input
              className="chew-input-dark"
              placeholder="Nome do tutor"
              value={novoTutor}
              onChange={function (e) { setNovoTutor(e.target.value); }}
              required
            />

            <label className="chew-field-label">Data</label>
            <input
              className="chew-input-dark"
              placeholder="Ex: 15 de julho"
              value={novaData}
              onChange={function (e) { setNovaData(e.target.value); }}
              required
            />

            <label className="chew-field-label">Horário</label>
            <input
              className="chew-input-dark"
              placeholder="Ex: 11:00"
              value={novoHorario}
              onChange={function (e) { setNovoHorario(e.target.value); }}
              required
            />

            <label className="chew-field-label">Tipo</label>
            <select
              className="chew-input-dark"
              value={novoTipo}
              onChange={function (e) { setNovoTipo(e.target.value); }}
            >
              {OPCOES_TIPO.map(function (t) {
                return <option key={t} value={t}>{t}</option>;
              })}
            </select>

            <button type="submit" className="chew-btn-orange">
              Criar agendamento
            </button>
          </form>
        </div>

        <div className="chew-panel">
          <h2 className="chew-panel-title">Todos os agendamentos</h2>
          <div style={{ maxHeight: "420px", overflowY: "auto" }}>
            <table className="chew-table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Tutor</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map(function (a) {
                  return (
                    <tr key={a.id}>
                      <td>{a.pet}</td>
                      <td>{a.tutor}</td>
                      <td>{a.data} • {a.horario}</td>
                      <td>
                        <span className={"chew-badge " + a.status}>
                          {LABEL_STATUS[a.status]}
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

      <div className="chew-panel">
        <h2 className="chew-panel-title">Atualizar status</h2>
        <table className="chew-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Pet</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Atualizar</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map(function (a) {
              return (
                <tr key={a.id}>
                  <td>{a.data}</td>
                  <td>{a.horario}</td>
                  <td>{a.pet}</td>
                  <td>{a.tipo}</td>
                  <td>
                    <span className={"chew-badge " + a.status}>
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