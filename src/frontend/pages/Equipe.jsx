import { useState } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

const EQUIPE_INICIAL = [
  { id: 1, nome: "Maria Souza", cargo: "Gerente", salario: 4500 },
  { id: 2, nome: "João Lima", cargo: "Atendente", salario: 2200 },
  { id: 3, nome: "Carla Dias", cargo: "Groomer", salario: 1900 },
];

export default function Equipe() {
  const [equipe, setEquipe] = useState(EQUIPE_INICIAL);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cargo, setCargo] = useState("Groomer");
  const [salario, setSalario] = useState("");

  function handleCadastrar(e) {
    e.preventDefault();
    if (!nome || !cpf || !salario) {
      return;
    }

    // TODO: enviar para o backend (POST /funcionarios) quando disponível
    const novo = {
      id: Date.now(),
      nome: nome,
      cargo: cargo,
      salario: Number(salario),
    };

    setEquipe(equipe.concat([novo]));
    setNome("");
    setCpf("");
    setSalario("");
  }

  function formatarSalario(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Gerenciar equipe</h1>
      </div>

      <div className="chew-content-grid">
        <div className="chew-panel">
          <h2 className="chew-panel-title">Cadastrar funcionário</h2>
          <form onSubmit={handleCadastrar}>
            <label className="chew-field-label">Nome</label>
            <input
              className="chew-input-dark"
              value={nome}
              onChange={function (e) { setNome(e.target.value); }}
              required
            />

            <label className="chew-field-label">CPF</label>
            <input
              className="chew-input-dark"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={function (e) { setCpf(e.target.value); }}
              required
            />

            <label className="chew-field-label">Cargo</label>
            <select
              className="chew-input-dark"
              value={cargo}
              onChange={function (e) { setCargo(e.target.value); }}
            >
              <option>Estoquista</option>
              <option>Groomer</option>
              <option>Limpeza</option>
              <option>Atendente</option>
              <option>Veterinario</option>
              <option>Gerente</option>
            </select>

            <label className="chew-field-label">Salário</label>
            <input
              type="number"
              step="0.01"
              className="chew-input-dark"
              placeholder="0.00"
              value={salario}
              onChange={function (e) { setSalario(e.target.value); }}
              required
            />

            <button type="submit" className="chew-btn-orange">
              Cadastrar
            </button>
          </form>
          <p className="chew-login-hint" style={{ color: "var(--chew-text-muted-light)" }}>
           
          </p>
        </div>

        <div className="chew-panel">
          <table className="chew-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Salário</th>
              </tr>
            </thead>
            <tbody>
              {equipe.map(function (f) {
                return (
                  <tr key={f.id}>
                    <td>{f.nome}</td>
                    <td>{f.cargo}</td>
                    <td>{formatarSalario(f.salario)}</td>
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