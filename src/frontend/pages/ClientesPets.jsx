import { useState } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

// Mock — substituir por chamada real ao endpoint de clientes/pets (FastAPI)
// quando o backend tiver isso pronto (GET/POST /clientes, com pets aninhados).
const CLIENTES_INICIAIS = [
  {
    id: 1,
    nome: "Carla Mendes",
    cpf: "123.456.789-00",
    endereco: "Rua das Flores, 200 — Brasília",
    email: "carla.mendes@email.com",
    telefone: "(61) 99123-4567",
    pets: [
      { id: 1, nome: "Amora", raca: "SRD", porte: "Pequeno", faixaEtaria: "Adulto", historico: "Vacina antirrábica em dia. Sem alergias conhecidas." },
    ],
  },
  {
    id: 2,
    nome: "Rafael Souza",
    cpf: "987.654.321-00",
    endereco: "Av. Central, 55 — Brasília",
    email: "rafael.souza@email.com",
    telefone: "(61) 98877-1122",
    pets: [
      { id: 2, nome: "Thor", raca: "Labrador", porte: "Grande", faixaEtaria: "Adulto", historico: "Castrado. Alergia a frango." },
      { id: 3, nome: "Fred", raca: "SRD", porte: "Médio", faixaEtaria: "Idoso", historico: "Consulta de rotina, peso estável." },
    ],
  },
];

const PORTES = ["Pequeno", "Médio", "Grande"];
const FAIXAS_ETARIAS = ["Filhote", "Jovem", "Adulto", "Idoso"];

function novoPetVazio() {
  return { id: Date.now() + Math.random(), nome: "", raca: "", porte: "Pequeno", faixaEtaria: "Filhote", historico: "" };
}

export default function ClientesPets() {
  const [clientes, setClientes] = useState(CLIENTES_INICIAIS);

  // ---- formulário de cadastro ----
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [petsForm, setPetsForm] = useState([novoPetVazio()]);
  const [mensagemCadastro, setMensagemCadastro] = useState("");

  function atualizarPet(id, campo, valor) {
    setPetsForm(function (prev) {
      return prev.map(function (p) {
        if (p.id === id) {
          return { ...p, [campo]: valor };
        }
        return p;
      });
    });
  }

  function adicionarPet() {
    setPetsForm(function (prev) {
      return [...prev, novoPetVazio()];
    });
  }

  function removerPet(id) {
    setPetsForm(function (prev) {
      if (prev.length === 1) return prev;
      return prev.filter(function (p) { return p.id !== id; });
    });
  }

  function handleCadastrar(e) {
    e.preventDefault();
    if (!nome || !cpf || !email || !telefone || !senha) return;

    // TODO: enviar para o backend (POST /clientes, com pets aninhados) quando disponível
    const novoCliente = {
      id: Date.now(),
      nome,
      cpf,
      endereco,
      email,
      telefone,
      pets: petsForm
        .filter(function (p) { return p.nome; })
        .map(function (p) {
          return { id: p.id, nome: p.nome, raca: p.raca, porte: p.porte, faixaEtaria: p.faixaEtaria, historico: p.historico };
        }),
    };

    setClientes([novoCliente, ...clientes]);
    setMensagemCadastro("Cliente \"" + nome + "\" cadastrado com sucesso, junto com " + novoCliente.pets.length + " pet(s).");

    setNome("");
    setCpf("");
    setEndereco("");
    setEmail("");
    setTelefone("");
    setSenha("");
    setPetsForm([novoPetVazio()]);
  }

  // ---- busca ----
  const [busca, setBusca] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const termoBusca = busca.trim().toLowerCase();
  const resultadosBusca = termoBusca
    ? clientes.filter(function (c) {
        const noCliente = c.nome.toLowerCase().includes(termoBusca) || c.cpf.includes(termoBusca);
        const noPet = c.pets.some(function (p) { return p.nome.toLowerCase().includes(termoBusca); });
        return noCliente || noPet;
      })
    : [];

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Clientes e Pets</h1>
      </div>

      <div className="chew-content-grid">
        <div className="chew-panel">
          <h2 className="chew-panel-title">Cadastrar cliente e pet(s)</h2>
          <form onSubmit={handleCadastrar}>
            <label className="chew-field-label">Nome</label>
            <input className="chew-input-dark" value={nome} onChange={function (e) { setNome(e.target.value); }} required />

            <label className="chew-field-label">CPF</label>
            <input className="chew-input-dark" placeholder="000.000.000-00" value={cpf} onChange={function (e) { setCpf(e.target.value); }} required />

            <label className="chew-field-label">Endereço</label>
            <input className="chew-input-dark" value={endereco} onChange={function (e) { setEndereco(e.target.value); }} />

            <label className="chew-field-label">Email</label>
            <input type="email" className="chew-input-dark" value={email} onChange={function (e) { setEmail(e.target.value); }} required />

            <label className="chew-field-label">Telefone</label>
            <input className="chew-input-dark" placeholder="(00) 00000-0000" value={telefone} onChange={function (e) { setTelefone(e.target.value); }} required />

            <label className="chew-field-label">Senha</label>
            <input type="password" className="chew-input-dark" value={senha} onChange={function (e) { setSenha(e.target.value); }} required />

            <div style={{ borderTop: "1px solid var(--chew-border)", margin: "0.6rem 0 1rem", paddingTop: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--chew-text-dark)", marginBottom: "0.8rem" }}>Pet(s) do cliente</h3>

              {petsForm.map(function (p, i) {
                return (
                  <div key={p.id} style={{ background: "var(--chew-content-bg)", borderRadius: 10, padding: "0.9rem", marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--chew-text-muted-light)" }}>Pet {i + 1}</span>
                      {petsForm.length > 1 && (
                        <button
                          type="button"
                          onClick={function () { removerPet(p.id); }}
                          style={{ background: "transparent", border: "none", color: "var(--chew-badge-cancelado-text)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                        >
                          Remover
                        </button>
                      )}
                    </div>

                    <label className="chew-field-label">Nome do pet</label>
                    <input
                      className="chew-input-dark"
                      value={p.nome}
                      onChange={function (e) { atualizarPet(p.id, "nome", e.target.value); }}
                    />

                    <label className="chew-field-label">Raça</label>
                    <input
                      className="chew-input-dark"
                      value={p.raca}
                      onChange={function (e) { atualizarPet(p.id, "raca", e.target.value); }}
                    />

                    <label className="chew-field-label">Porte</label>
                    <select
                      className="chew-input-dark"
                      value={p.porte}
                      onChange={function (e) { atualizarPet(p.id, "porte", e.target.value); }}
                    >
                      {PORTES.map(function (op) { return <option key={op} value={op}>{op}</option>; })}
                    </select>

                    <label className="chew-field-label">Faixa etária</label>
                    <select
                      className="chew-input-dark"
                      value={p.faixaEtaria}
                      onChange={function (e) { atualizarPet(p.id, "faixaEtaria", e.target.value); }}
                    >
                      {FAIXAS_ETARIAS.map(function (op) { return <option key={op} value={op}>{op}</option>; })}
                    </select>

                    <label className="chew-field-label">Histórico médico</label>
                    <textarea
                      className="chew-textarea-dark"
                      placeholder="Vacinas, alergias, cirurgias, observações..."
                      value={p.historico}
                      onChange={function (e) { atualizarPet(p.id, "historico", e.target.value); }}
                    />
                  </div>
                );
              })}

              <button
                type="button"
                onClick={adicionarPet}
                style={{ width: "100%", background: "transparent", border: "1.5px dashed var(--chew-border)", color: "var(--chew-text-muted-light)", borderRadius: 10, padding: "0.6rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
              >
                + Adicionar outro pet
              </button>
            </div>

            <button type="submit" className="chew-btn-orange">
              Cadastrar cliente
            </button>
          </form>

          {mensagemCadastro && <div className="chew-success-hint" style={{ marginTop: "1rem" }}>{mensagemCadastro}</div>}
        </div>

        <div className="chew-panel">
          <h2 className="chew-panel-title">Buscar cliente ou pet</h2>

          <input
            className="chew-input-dark"
            placeholder="Nome do cliente, CPF ou nome do pet..."
            value={busca}
            onChange={function (e) { setBusca(e.target.value); setClienteSelecionado(null); }}
          />

          {!termoBusca && (
            <p style={{ color: "var(--chew-text-muted-light)", fontSize: "0.85rem" }}>
              Digite pra buscar entre {clientes.length} cliente(s) cadastrado(s).
            </p>
          )}

          {termoBusca && resultadosBusca.length === 0 && (
            <p style={{ color: "var(--chew-text-muted-light)", fontSize: "0.85rem" }}>
              Nenhum cliente ou pet encontrado para "{busca}".
            </p>
          )}

          {termoBusca && !clienteSelecionado && resultadosBusca.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {resultadosBusca.map(function (c) {
                return (
                  <div
                    key={c.id}
                    onClick={function () { setClienteSelecionado(c); }}
                    style={{ cursor: "pointer", background: "var(--chew-content-bg)", borderRadius: 10, padding: "0.8rem 1rem" }}
                  >
                    <div style={{ fontWeight: 700, color: "var(--chew-text-dark)", fontSize: "0.9rem" }}>{c.nome}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--chew-text-muted-light)" }}>
                      {c.pets.length} pet(s): {c.pets.map(function (p) { return p.nome; }).join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {clienteSelecionado && (
            <div>
              <button
                onClick={function () { setClienteSelecionado(null); }}
                style={{ background: "transparent", border: "none", color: "var(--chew-teal-dark)", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", marginBottom: "0.8rem", padding: 0 }}
              >
                ← Voltar para os resultados
              </button>

              <div style={{ marginBottom: "1.2rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--chew-text-dark)", marginBottom: "0.4rem" }}>{clienteSelecionado.nome}</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--chew-text-muted-light)", margin: "0.15rem 0" }}>CPF: {clienteSelecionado.cpf}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--chew-text-muted-light)", margin: "0.15rem 0" }}>Email: {clienteSelecionado.email}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--chew-text-muted-light)", margin: "0.15rem 0" }}>Telefone: {clienteSelecionado.telefone}</p>
                {clienteSelecionado.endereco && (
                  <p style={{ fontSize: "0.82rem", color: "var(--chew-text-muted-light)", margin: "0.15rem 0" }}>Endereço: {clienteSelecionado.endereco}</p>
                )}
              </div>

              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--chew-text-dark)", marginBottom: "0.6rem" }}>Pets</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {clienteSelecionado.pets.map(function (p) {
                  return (
                    <div key={p.id} className="chew-atendimento-card">
                      <div className="chew-atendimento-top">
                        <span className="chew-atendimento-pet">{p.nome}</span>
                        <span className="chew-atendimento-data">{p.porte} • {p.faixaEtaria}</span>
                      </div>
                      <p className="chew-atendimento-desc">Raça: {p.raca || "não informada"}</p>
                      <p className="chew-atendimento-desc">{p.historico || "Sem histórico registrado ainda."}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PainelFuncionarioLayout>
  );
}