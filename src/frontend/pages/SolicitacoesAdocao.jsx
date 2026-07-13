import { useState, useEffect } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

/* ─── Status badges ────────────────────────────────────────────── */
const LABEL_STATUS = { pendente: "Pendente", aprovada: "Aprovada", recusada: "Recusada" };
const CLASSE_STATUS = { pendente: "confirmado", aprovada: "concluido", recusada: "cancelado" };

/* ─── Inline styles (modal & form) ────────────────────────────── */
const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: 24,
};
const card = {
  background: "#fff", borderRadius: 22, padding: "36px 38px",
  width: "100%", maxWidth: 560, boxShadow: "0 24px 60px rgba(0,0,0,.18)",
  maxHeight: "90vh", overflowY: "auto",
};
const fld = {
  width: "100%", height: 42, border: "1.5px solid #e0d4d0", borderRadius: 10,
  padding: "0 12px", fontSize: 14, fontFamily: "inherit", color: "#333",
  background: "#faf8f7", boxSizing: "border-box",
};
const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: "#5a4a4a", marginBottom: 5 };
const row2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px", marginBottom: 14 };
const btnPrimary = {
  background: "var(--chew-orange, #E8530E)", color: "#fff", border: "none",
  borderRadius: 10, padding: "11px 24px", fontFamily: "inherit",
  fontWeight: 700, fontSize: 14, cursor: "pointer",
};
const btnGhost = {
  background: "transparent", color: "#666", border: "1.5px solid #ddd",
  borderRadius: 10, padding: "10px 22px", fontFamily: "inherit",
  fontWeight: 700, fontSize: 14, cursor: "pointer",
};

/* ─── Default form state ───────────────────────────────────────── */
const FORM_VAZIO = {
  nome: "", raca: "", porte: "Médio", faixa_etaria: "Adulto",
  hist_medico: "", data_resgate: new Date().toISOString().split("T")[0], status: "Disponível",
};

export default function SolicitacoesAdocao() {
  /* Solicitações */
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Modal cadastrar pet */
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(FORM_VAZIO);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ── Fetch solicitações ───────────────────────────────────────── */
  function fetchSolicitacoes() {
    setLoading(true);
    fetch("http://localhost:3000/api/solicitacoes-adocao")
      .then((res) => res.json())
      .then((data) => { setSolicitacoes(data); setLoading(false); })
      .catch((err) => {
        console.error("Erro ao buscar solicitações:", err);
        setError("Erro ao carregar solicitações.");
        setLoading(false);
      });
  }

  useEffect(() => { fetchSolicitacoes(); }, []);

  /* ── Aprovar / Recusar ────────────────────────────────────────── */
  function decidir(id, novoStatus) {
    fetch(`http://localhost:3000/api/solicitacoes-adocao/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    })
      .then((res) => { if (!res.ok) throw new Error("Erro ao atualizar status."); fetchSolicitacoes(); })
      .catch((err) => alert(err.message || "Erro ao conectar ao servidor."));
  }

  /* ── Cadastrar novo pet ───────────────────────────────────────── */
  function handleFormChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmitPet(e) {
    e.preventDefault();
    setFormError("");
    if (!form.nome.trim()) { setFormError("O nome do pet é obrigatório."); return; }

    setSaving(true);
    fetch("http://localhost:3000/api/animais-adocao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome.trim(),
        raca: form.raca.trim() || null,
        porte: form.porte || null,
        faixa_etaria: form.faixa_etaria || null,
        hist_medico: form.hist_medico.trim() || null,
        data_resgate: form.data_resgate || null,
        status: form.status,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error?.message || "Erro ao cadastrar pet.");
        setSuccessMsg(`Pet "${data.nome}" cadastrado com sucesso!`);
        setForm(FORM_VAZIO);
        setTimeout(() => { setSuccessMsg(""); setShowModal(false); }, 2000);
      })
      .catch((err) => setFormError(err.message || "Erro ao conectar ao servidor."))
      .finally(() => setSaving(false));
  }

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <PainelFuncionarioLayout>

      {/* ── Cabeçalho da seção ──────────────────────────────────── */}
      <div className="chew-content-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="chew-content-title">Solicitações de adoção</h1>
        <button
          style={btnPrimary}
          onClick={() => { setShowModal(true); setFormError(""); setSuccessMsg(""); setForm(FORM_VAZIO); }}
        >
          + Cadastrar pet para adoção
        </button>
      </div>

      {/* ── Tabela de solicitações ──────────────────────────────── */}
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
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#666", fontStyle: "italic" }}>Carregando solicitações...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#c0392b", fontWeight: 600 }}>{error}</td></tr>
            ) : solicitacoes.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#666" }}>Nenhuma solicitação de adoção encontrada.</td></tr>
            ) : (
              solicitacoes.map((s) => (
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
                          style={{ width: "auto", padding: "6px 14px", fontSize: "0.75rem", marginRight: 8 }}
                          onClick={() => decidir(s.id, "aprovada")}
                        >Aprovar</button>
                        <button
                          style={{
                            width: "auto", padding: "6px 14px", fontSize: "0.75rem",
                            background: "transparent", border: "1px solid var(--chew-badge-cancelado-text)",
                            color: "var(--chew-badge-cancelado-text)", borderRadius: 8,
                            cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                          }}
                          onClick={() => decidir(s.id, "recusada")}
                        >Recusar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal: cadastrar pet ────────────────────────────────── */}
      {showModal && (
        <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={card}>

            {/* Cabeçalho modal */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "#E8530E", marginBottom: 4 }}>CADASTRO</div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#16313b" }}>Novo pet para adoção</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#999", lineHeight: 1 }}
              >✕</button>
            </div>

            {/* Feedback */}
            {formError && (
              <div style={{ background: "#fce4e4", border: "1.5px solid #f1b0b0", color: "#c0392b", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
                ⚠️ {formError}
              </div>
            )}
            {successMsg && (
              <div style={{ background: "#e6f9ee", border: "1.5px solid #a3d9b1", color: "#1a7a40", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
                ✅ {successMsg}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmitPet}>

              {/* Nome */}
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Nome do pet *</label>
                <input required name="nome" value={form.nome} onChange={handleFormChange} placeholder="Ex: Thor" style={fld} />
              </div>

              {/* Raça + Porte */}
              <div style={row2}>
                <div>
                  <label style={lbl}>Raça</label>
                  <input name="raca" value={form.raca} onChange={handleFormChange} placeholder="Ex: Vira-lata" style={fld} />
                </div>
                <div>
                  <label style={lbl}>Porte</label>
                  <select name="porte" value={form.porte} onChange={handleFormChange} style={fld}>
                    <option>Pequeno</option>
                    <option>Médio</option>
                    <option>Grande</option>
                  </select>
                </div>
              </div>

              {/* Faixa etária + Status */}
              <div style={row2}>
                <div>
                  <label style={lbl}>Faixa etária</label>
                  <select name="faixa_etaria" value={form.faixa_etaria} onChange={handleFormChange} style={fld}>
                    <option>Filhote</option>
                    <option>Adulto</option>
                    <option>Idoso</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Status inicial</label>
                  <select name="status" value={form.status} onChange={handleFormChange} style={fld}>
                    <option>Disponível</option>
                    <option>Em Tratamento</option>
                  </select>
                </div>
              </div>

              {/* Histórico médico */}
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Histórico médico / observações</label>
                <input name="hist_medico" value={form.hist_medico} onChange={handleFormChange} placeholder="Ex: Castrado, vacinado, FeLV negativo" style={fld} />
              </div>

              {/* Data de resgate */}
              <div style={{ marginBottom: 22 }}>
                <label style={lbl}>Data de resgate</label>
                <input type="date" name="data_resgate" value={form.data_resgate} onChange={handleFormChange} style={fld} />
              </div>

              {/* Ações */}
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" style={btnGhost} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Salvando..." : "Cadastrar pet"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </PainelFuncionarioLayout>
  );
}