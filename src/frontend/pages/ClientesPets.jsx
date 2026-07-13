import { useState, useEffect, useCallback } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

const PORTES = ["Pequeno", "Médio", "Grande"];
const FAIXAS_ETARIAS = ["Filhote", "Jovem", "Adulto", "Idoso"];

function novoPetVazio() {
  return {
    _localId: Date.now() + Math.random(),
    nome: "",
    raca: "",
    porte: "Pequeno",
    faixa_etaria: "Filhote",
    hist_medico: "",
  };
}

function getToken() {
  return localStorage.getItem("chew_funcionario_token") || "";
}

export default function ClientesPets() {
  // ---- formulário de cadastro ----
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [petsForm, setPetsForm] = useState([novoPetVazio()]);
  const [mensagemCadastro, setMensagemCadastro] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");
  const [enviando, setEnviando] = useState(false);

  // ---- busca ----
  const [busca, setBusca] = useState("");
  const [clientes, setClientes] = useState([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [buscando, setBuscando] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  // ── Carrega a contagem total de clientes ao montar ───────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch("/api/clientes/clientes-pets", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTotalClientes(data.length);
      })
      .catch(() => {});
  }, []);

  // ── Busca com debounce ───────────────────────────────────────────────────
  const buscarClientes = useCallback(
    async (termo) => {
      const token = getToken();
      if (!token) return;
      setBuscando(true);
      try {
        const url = termo.trim()
          ? `/api/clientes/clientes-pets?q=${encodeURIComponent(termo.trim())}`
          : `/api/clientes/clientes-pets`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setClientes(Array.isArray(data) ? data : []);
      } catch {
        setClientes([]);
      } finally {
        setBuscando(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      buscarClientes(busca);
    }, 350);
    return () => clearTimeout(timer);
  }, [busca, buscarClientes]);

  // ── Helpers do formulário de pets ────────────────────────────────────────
  function atualizarPet(localId, campo, valor) {
    setPetsForm((prev) =>
      prev.map((p) => (p._localId === localId ? { ...p, [campo]: valor } : p))
    );
  }

  function adicionarPet() {
    setPetsForm((prev) => [...prev, novoPetVazio()]);
  }

  function removerPet(localId) {
    setPetsForm((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((p) => p._localId !== localId);
    });
  }

  // ── Cadastro ─────────────────────────────────────────────────────────────
  async function handleCadastrar(e) {
    e.preventDefault();
    setErroCadastro("");
    setMensagemCadastro("");

    const token = getToken();
    if (!token) {
      setErroCadastro("Você precisa estar logado como funcionário.");
      return;
    }

    setEnviando(true);
    try {
      const payload = {
        cpf,
        nome,
        telefone,
        endereco,
        email,
        senha,
        pets: petsForm
          .filter((p) => p.nome.trim() !== "")
          .map((p) => ({
            nome: p.nome,
            raca: p.raca || null,
            porte: p.porte || null,
            faixa_etaria: p.faixa_etaria || null,
            hist_medico: p.hist_medico || null,
          })),
      };

      const res = await fetch("/api/clientes/cadastro-completo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.error?.message ||
          (Array.isArray(data?.error) ? data.error.map((e) => e.message).join("; ") : null) ||
          "Erro ao cadastrar cliente.";
        setErroCadastro(msg);
        return;
      }

      setMensagemCadastro(
        `Cliente "${data.nome}" cadastrado com sucesso, junto com ${data.pets?.length ?? 0} pet(s)!`
      );
      setTotalClientes((t) => t + 1);

      // limpa formulário
      setNome("");
      setCpf("");
      setEndereco("");
      setEmail("");
      setTelefone("");
      setSenha("");
      setPetsForm([novoPetVazio()]);

      // se havia busca ativa, recarrega
      if (busca.trim()) buscarClientes(busca);
    } catch {
      setErroCadastro("Erro de conexão com o servidor.");
    } finally {
      setEnviando(false);
    }
  }

  // ── Resultados filtrados localmente para a exibição ──────────────────────
  const termoBusca = busca.trim().toLowerCase();
  const resultadosBusca = clientes;

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Clientes e Pets</h1>
      </div>

      <div className="chew-content-grid">
        {/* ── Painel de cadastro ─────────────────────────────────────── */}
        <div className="chew-panel">
          <h2 className="chew-panel-title">Cadastrar cliente e pet(s)</h2>
          <form onSubmit={handleCadastrar}>
            <label className="chew-field-label">Nome</label>
            <input
              className="chew-input-dark"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <label className="chew-field-label">CPF</label>
            <input
              className="chew-input-dark"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />

            <label className="chew-field-label">Endereço</label>
            <input
              className="chew-input-dark"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <label className="chew-field-label">Email</label>
            <input
              type="email"
              className="chew-input-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="chew-field-label">Telefone</label>
            <input
              className="chew-input-dark"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />

            <label className="chew-field-label">Senha (acesso do cliente)</label>
            <input
              type="password"
              className="chew-input-dark"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <div
              style={{
                borderTop: "1px solid var(--chew-border)",
                margin: "0.6rem 0 1rem",
                paddingTop: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--chew-text-dark)",
                  marginBottom: "0.8rem",
                }}
              >
                Pet(s) do cliente
              </h3>

              {petsForm.map((p, i) => (
                <div
                  key={p._localId}
                  style={{
                    background: "var(--chew-content-bg)",
                    borderRadius: 10,
                    padding: "0.9rem",
                    marginBottom: "0.8rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--chew-text-muted-light)",
                      }}
                    >
                      Pet {i + 1}
                    </span>
                    {petsForm.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerPet(p._localId)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--chew-badge-cancelado-text)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <label className="chew-field-label">Nome do pet</label>
                  <input
                    className="chew-input-dark"
                    value={p.nome}
                    onChange={(e) => atualizarPet(p._localId, "nome", e.target.value)}
                  />

                  <label className="chew-field-label">Raça</label>
                  <input
                    className="chew-input-dark"
                    value={p.raca}
                    onChange={(e) => atualizarPet(p._localId, "raca", e.target.value)}
                  />

                  <label className="chew-field-label">Porte</label>
                  <select
                    className="chew-input-dark"
                    value={p.porte}
                    onChange={(e) => atualizarPet(p._localId, "porte", e.target.value)}
                  >
                    {PORTES.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>

                  <label className="chew-field-label">Faixa etária</label>
                  <select
                    className="chew-input-dark"
                    value={p.faixa_etaria}
                    onChange={(e) => atualizarPet(p._localId, "faixa_etaria", e.target.value)}
                  >
                    {FAIXAS_ETARIAS.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>

                  <label className="chew-field-label">Histórico médico</label>
                  <textarea
                    className="chew-textarea-dark"
                    placeholder="Vacinas, alergias, cirurgias, observações..."
                    value={p.hist_medico}
                    onChange={(e) => atualizarPet(p._localId, "hist_medico", e.target.value)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={adicionarPet}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "1.5px dashed var(--chew-border)",
                  color: "var(--chew-text-muted-light)",
                  borderRadius: 10,
                  padding: "0.6rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                + Adicionar outro pet
              </button>
            </div>

            <button type="submit" className="chew-btn-orange" disabled={enviando}>
              {enviando ? "Cadastrando..." : "Cadastrar cliente"}
            </button>
          </form>

          {mensagemCadastro && (
            <div className="chew-success-hint" style={{ marginTop: "1rem" }}>
              {mensagemCadastro}
            </div>
          )}
          {erroCadastro && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: 10,
                background: "rgba(220,53,69,0.12)",
                color: "#ff6b7a",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              ⚠️ {erroCadastro}
            </div>
          )}
        </div>

        {/* ── Painel de busca ────────────────────────────────────────── */}
        <div className="chew-panel">
          <h2 className="chew-panel-title">Buscar cliente ou pet</h2>

          <input
            className="chew-input-dark"
            placeholder="Nome do cliente, CPF ou nome do pet..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setClienteSelecionado(null);
            }}
          />

          {!termoBusca && !buscando && (
            <p style={{ color: "var(--chew-text-muted-light)", fontSize: "0.85rem" }}>
              Digite para buscar entre {totalClientes} cliente(s) cadastrado(s).
            </p>
          )}

          {buscando && (
            <p style={{ color: "var(--chew-text-muted-light)", fontSize: "0.85rem" }}>
              Buscando...
            </p>
          )}

          {termoBusca && !buscando && resultadosBusca.length === 0 && (
            <p style={{ color: "var(--chew-text-muted-light)", fontSize: "0.85rem" }}>
              Nenhum cliente ou pet encontrado para "{busca}".
            </p>
          )}

          {termoBusca && !clienteSelecionado && resultadosBusca.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {resultadosBusca.map((c) => (
                <div
                  key={c.id_cliente}
                  onClick={() => setClienteSelecionado(c)}
                  style={{
                    cursor: "pointer",
                    background: "var(--chew-content-bg)",
                    borderRadius: 10,
                    padding: "0.8rem 1rem",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--chew-text-dark)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {c.nome}
                  </div>
                  <div
                    style={{ fontSize: "0.78rem", color: "var(--chew-text-muted-light)" }}
                  >
                    CPF: {c.cpf} &nbsp;·&nbsp; {c.pets?.length ?? 0} pet(s)
                    {c.pets?.length > 0 && (
                      <>: {c.pets.map((p) => p.nome).join(", ")}</>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {clienteSelecionado && (
            <div>
              <button
                onClick={() => setClienteSelecionado(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--chew-teal-dark)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginBottom: "0.8rem",
                  padding: 0,
                }}
              >
                ← Voltar para os resultados
              </button>

              <div style={{ marginBottom: "1.2rem" }}>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--chew-text-dark)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {clienteSelecionado.nome}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--chew-text-muted-light)", margin: "0.15rem 0" }}>
                  CPF: {clienteSelecionado.cpf}
                </p>
                {clienteSelecionado.email && (
                  <p style={{ fontSize: "0.82rem", color: "var(--chew-text-muted-light)", margin: "0.15rem 0" }}>
                    Email: {clienteSelecionado.email}
                  </p>
                )}
                <p style={{ fontSize: "0.82rem", color: "var(--chew-text-muted-light)", margin: "0.15rem 0" }}>
                  Telefone: {clienteSelecionado.telefone}
                </p>
                {clienteSelecionado.endereco && (
                  <p style={{ fontSize: "0.82rem", color: "var(--chew-text-muted-light)", margin: "0.15rem 0" }}>
                    Endereço: {clienteSelecionado.endereco}
                  </p>
                )}
              </div>

              <h4
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--chew-text-dark)",
                  marginBottom: "0.6rem",
                }}
              >
                Pets
              </h4>

              {clienteSelecionado.pets?.length === 0 && (
                <p style={{ color: "var(--chew-text-muted-light)", fontSize: "0.85rem" }}>
                  Nenhum pet cadastrado.
                </p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {clienteSelecionado.pets?.map((p) => (
                  <div key={p.id_pet} className="chew-atendimento-card">
                    <div className="chew-atendimento-top">
                      <span className="chew-atendimento-pet">{p.nome}</span>
                      <span className="chew-atendimento-data">
                        {p.porte ?? "—"} • {p.faixa_etaria ?? "—"}
                      </span>
                    </div>
                    <p className="chew-atendimento-desc">
                      Raça: {p.raca || "não informada"}
                    </p>
                    <p className="chew-atendimento-desc">
                      {p.hist_medico || "Sem histórico registrado ainda."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PainelFuncionarioLayout>
  );
}