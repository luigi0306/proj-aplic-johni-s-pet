import { useState } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

// Mock — substituir por chamada real ao endpoint de prontuários (FastAPI)
const ATENDIMENTOS_INICIAIS = [
  {
    id: 1,
    pet: "Amora",
    data: "08/07/2026",
    descricao: "Vacina antirrábica aplicada, sem reações.",
    autor: "joao.atendente",
  },
  {
    id: 2,
    pet: "Fred",
    data: "07/07/2026",
    descricao: "Consulta de rotina, peso estável.",
    autor: "maria.gerente",
  },
  {
    id: 3,
    pet: "Amora",
    data: "22/03/2026",
    descricao: "Vermifugação e exame de fezes, resultado normal.",
    autor: "maria.gerente",
  },
  {
    id: 4,
    pet: "Thor",
    data: "15/02/2026",
    descricao: "Cirurgia de castração, pós-operatório sem intercorrências.",
    autor: "joao.atendente",
  },
  {
    id: 5,
    pet: "Fred",
    data: "10/12/2025",
    descricao: "Primeira consulta, aplicação de vacina múltipla V10.",
    autor: "maria.gerente",
  },
];

export default function Prontuario() {
  const [atendimentos, setAtendimentos] = useState(ATENDIMENTOS_INICIAIS);
  const [pet, setPet] = useState("");
  const [data, setData] = useState("09/07/2026");
  const [descricao, setDescricao] = useState("");
  const [busca, setBusca] = useState("");

  const cargo = localStorage.getItem("chew_funcionario_cargo");
  const email = localStorage.getItem("chew_funcionario_email");
  const autor = email
    ? email.split("@")[0]
    : cargo === "Gerente"
    ? "maria.gerente"
    : "joao.atendente";

  function handleSalvar(e) {
    e.preventDefault();
    if (!pet || !descricao) return;

    const novo = {
      id: Date.now(),
      pet,
      data,
      descricao,
      autor,
    };

    // TODO: enviar para o backend (POST /prontuarios) quando disponível
    setAtendimentos([novo, ...atendimentos]);
    setPet("");
    setDescricao("");
  }

  const termoBusca = busca.trim().toLowerCase();
  const atendimentosFiltrados = termoBusca
    ? atendimentos.filter(function (a) {
        return a.pet.toLowerCase().includes(termoBusca);
      })
    : atendimentos;

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Prontuário</h1>
      </div>

      <div className="chew-content-grid">
        <div className="chew-panel">
          <h2 className="chew-panel-title">Registrar atendimento</h2>
          <form onSubmit={handleSalvar}>
            <label className="chew-field-label">Pet</label>
            <input
              className="chew-input-dark"
              placeholder="Nome do pet"
              value={pet}
              onChange={(e) => setPet(e.target.value)}
              required
            />

            <label className="chew-field-label">Data</label>
            <input
              className="chew-input-dark"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />

            <label className="chew-field-label">Descrição</label>
            <textarea
              className="chew-textarea-dark"
              placeholder="Vacinação, exame, observações..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />

            <button type="submit" className="chew-btn-orange">
              Salvar prontuário
            </button>
          </form>
        </div>

        <div className="chew-panel">
          <h2 className="chew-panel-title">Histórico de atendimentos</h2>

          <input
            className="chew-input-dark"
            placeholder="Buscar pelo nome do pet..."
            value={busca}
            onChange={function (e) { setBusca(e.target.value); }}
          />

          {atendimentosFiltrados.length === 0 && (
            <p style={{ color: "var(--chew-text-muted-light)", fontSize: "0.85rem" }}>
              Nenhum atendimento encontrado para "{busca}".
            </p>
          )}

          <div style={{ maxHeight: "420px", overflowY: "auto" }}>
            {atendimentosFiltrados.map(function (a) {
              return (
                <div key={a.id} className="chew-atendimento-card">
                  <div className="chew-atendimento-top">
                    <span className="chew-atendimento-pet">{a.pet}</span>
                    <span className="chew-atendimento-data">{a.data}</span>
                  </div>
                  <p className="chew-atendimento-desc">{a.descricao}</p>
                  <span className="chew-atendimento-autor">
                    Atendido por {a.autor}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PainelFuncionarioLayout>
  );
}