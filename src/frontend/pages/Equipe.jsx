import { useState, useEffect } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

export default function Equipe() {
  const [equipe, setEquipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Form states for creating employee
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cargo, setCargo] = useState("Groomer");
  const [salario, setSalario] = useState("");
  const [cadastroEmail, setCadastroEmail] = useState("");
  const [cadastroSenha, setCadastroSenha] = useState("");
  const [emailSugerido, setEmailSugerido] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Form states for creating login credentials
  const [selectedFuncionarioLogin, setSelectedFuncionarioLogin] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginErro, setLoginErro] = useState("");
  const [loginSucesso, setLoginSucesso] = useState("");
  const [salvandoLogin, setSalvandoLogin] = useState(false);

  const token = localStorage.getItem("chew_funcionario_token");

  // Suggest email based on name
  useEffect(() => {
    if (!nome) {
      setEmailSugerido("");
      setCadastroEmail("");
      return;
    }
    const cleanName = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "");
    const sugestao = cleanName.trim().replace(/\s+/g, ".") + "@chew.com";
    setEmailSugerido(sugestao);
    if (!cadastroEmail || cadastroEmail === emailSugerido) {
      setCadastroEmail(sugestao);
    }
  }, [nome, emailSugerido, cadastroEmail]);

  async function buscarEquipe() {
    try {
      setLoading(true);
      setErro("");
      const res = await fetch("http://localhost:3000/api/funcionarios");
      if (!res.ok) throw new Error("Erro ao buscar a equipe no servidor.");
      const data = await res.json();
      setEquipe(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarEquipe();
  }, []);

  async function handleCadastrar(e) {
    e.preventDefault();
    if (!nome || !cpf || !salario) {
      return;
    }
    const cargoPodeTerLogin = ["Gerente", "Atendente", "Veterinario", "Limpeza"].includes(cargo);
    if (cargoPodeTerLogin && (!cadastroEmail || !cadastroSenha)) {
      return;
    }

    setErro("");
    setSalvando(true);

    try {
      const response = await fetch("http://localhost:3000/api/funcionarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          cpf,
          nome,
          cargo,
          salario: Number(salario),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || data.error || "Erro ao cadastrar funcionário.");
      }

      const fData = await response.json();
      const createdId = fData.id_funcionario;

      if (cargoPodeTerLogin && createdId) {
        const loginResponse = await fetch("http://localhost:3000/api/auth/funcionarios/registrar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            id_funcionario: createdId,
            email: cadastroEmail,
            senha: cadastroSenha,
          }),
        });

        if (!loginResponse.ok) {
          const lData = await loginResponse.json();
          setErro(`Funcionário cadastrado, mas não foi possível criar o login: ${lData.error?.message || lData.error || "Erro desconhecido"}`);
        }
      }

      await buscarEquipe();
      setNome("");
      setCpf("");
      setSalario("");
      setCadastroEmail("");
      setCadastroSenha("");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id) {
    if (!window.confirm("Deseja realmente deletar este funcionário?")) {
      return;
    }
    setErro("");

    try {
      const response = await fetch(`http://localhost:3000/api/funcionarios/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || data.error || "Erro ao deletar funcionário.");
      }

      await buscarEquipe();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleCriarLogin(e) {
    e.preventDefault();
    if (!selectedFuncionarioLogin || !loginEmail || !loginSenha) return;
    setLoginErro("");
    setLoginSucesso("");
    setSalvandoLogin(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/funcionarios/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id_funcionario: selectedFuncionarioLogin.id_funcionario,
          email: loginEmail,
          senha: loginSenha,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || data.error || "Erro ao criar credenciais.");
      }

      setLoginSucesso("Credenciais criadas com sucesso!");
      await buscarEquipe();
      
      setTimeout(() => {
        setSelectedFuncionarioLogin(null);
        setLoginEmail("");
        setLoginSenha("");
        setLoginSucesso("");
      }, 1500);
    } catch (err) {
      setLoginErro(err.message);
    } finally {
      setSalvandoLogin(false);
    }
  }

  function formatarSalario(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <PainelFuncionarioLayout>
      <div className="chew-content-header">
        <h1 className="chew-content-title">Gerenciar equipe</h1>
      </div>

      {erro && (
        <div className="chew-login-alert" style={{ maxWidth: "100%", marginBottom: "1.5rem" }}>
          ⚠️ {erro}
        </div>
      )}

      <div className="chew-content-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Card: Cadastrar funcionário */}
          <div className="chew-panel">
            <h2 className="chew-panel-title">Cadastrar funcionário</h2>
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

              <label className="chew-field-label">Cargo</label>
              <select
                className="chew-input-dark"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              >
                <option value="Estoquista">Estoquista</option>
                <option value="Groomer">Groomer</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Atendente">Atendente</option>
                <option value="Veterinario">Veterinário</option>
                <option value="Gerente">Gerente</option>
              </select>

              <label className="chew-field-label">Salário</label>
              <input
                type="number"
                step="0.01"
                className="chew-input-dark"
                placeholder="0.00"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                required
              />

              {["Gerente", "Atendente", "Veterinario", "Limpeza"].includes(cargo) && (
                <>
                  <label className="chew-field-label">Email de Acesso</label>
                  <input
                    type="email"
                    className="chew-input-dark"
                    placeholder="email@chew.com"
                    value={cadastroEmail}
                    onChange={(e) => setCadastroEmail(e.target.value)}
                    required
                  />

                  <label className="chew-field-label">Senha inicial</label>
                  <input
                    type="password"
                    className="chew-input-dark"
                    placeholder="Mínimo 6 caracteres"
                    value={cadastroSenha}
                    onChange={(e) => setCadastroSenha(e.target.value)}
                    required
                  />
                </>
              )}

              <button type="submit" className="chew-btn-orange" disabled={salvando}>
                {salvando ? "Salvando..." : "Cadastrar"}
              </button>
            </form>
          </div>

          {/* Card: Criar Login (condicional) */}
          {selectedFuncionarioLogin && (
            <div className="chew-panel" style={{ border: "2px solid var(--chew-teal)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                <h2 className="chew-panel-title" style={{ margin: 0 }}>
                  Criar Login para {selectedFuncionarioLogin.nome}
                </h2>
                <button
                  onClick={() => setSelectedFuncionarioLogin(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--chew-text-muted-light)",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    fontWeight: "bold"
                  }}
                >
                  ✕
                </button>
              </div>

              {loginErro && (
                <div className="chew-login-alert" style={{ marginBottom: "1rem" }}>
                  ⚠️ {loginErro}
                </div>
              )}

              {loginSucesso && (
                <div className="chew-success-hint" style={{ marginBottom: "1rem" }}>
                  {loginSucesso}
                </div>
              )}

              <form onSubmit={handleCriarLogin}>
                <label className="chew-field-label">Email de Acesso</label>
                <input
                  type="email"
                  className="chew-input-dark"
                  placeholder="email@chew.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />

                <label className="chew-field-label">Senha inicial</label>
                <input
                  type="password"
                  className="chew-input-dark"
                  placeholder="Mínimo 6 caracteres"
                  value={loginSenha}
                  onChange={(e) => setLoginSenha(e.target.value)}
                  required
                />

                <button type="submit" className="chew-btn-orange" style={{ background: "var(--chew-teal)" }} disabled={salvandoLogin}>
                  {salvandoLogin ? "Processando..." : "Liberar Acesso"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Card: Listagem de equipe */}
        <div className="chew-panel" style={{ overflowX: "auto" }}>
          <h2 className="chew-panel-title">Lista de equipe</h2>
          {loading ? (
            <p style={{ color: "var(--chew-text-muted-light)" }}>Carregando equipe...</p>
          ) : equipe.length === 0 ? (
            <p style={{ color: "var(--chew-text-muted-light)" }}>Nenhum funcionário cadastrado.</p>
          ) : (
            <table className="chew-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>Salário</th>
                  <th>Acesso / Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {equipe.map(function (f) {
                  const canHaveLogin = ["Gerente", "Atendente", "Veterinario", "Limpeza"].includes(f.cargo);
                  return (
                    <tr key={f.id_funcionario}>
                      <td>{f.nome}</td>
                      <td>{f.cargo}</td>
                      <td>{formatarSalario(f.salario)}</td>
                      <td>
                        {f.email ? (
                          <span
                            className="chew-badge concluido"
                            style={{ display: "inline-block", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            title={f.email}
                          >
                            {f.email}
                          </span>
                        ) : canHaveLogin ? (
                          <button
                            type="button"
                            className="chew-btn-orange"
                            style={{
                              background: "var(--chew-teal)",
                              fontSize: "0.75rem",
                              padding: "0.3rem 0.6rem",
                              width: "auto",
                              borderRadius: "4px"
                            }}
                            onClick={() => {
                              setSelectedFuncionarioLogin(f);
                              setLoginEmail(f.nome.toLowerCase().replace(/\s+/g, "") + "@chew.com");
                              setLoginSenha("");
                              setLoginErro("");
                              setLoginSucesso("");
                            }}
                          >
                            + Acesso
                          </button>
                        ) : (
                          <span style={{ color: "var(--chew-text-muted-light)", fontSize: "0.8rem" }}>
                            Sem painel
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="chew-btn-orange"
                          style={{
                            background: "#c0392b",
                            fontSize: "0.75rem",
                            padding: "0.3rem 0.6rem",
                            width: "auto",
                            borderRadius: "4px"
                          }}
                          onClick={() => handleDeletar(f.id_funcionario)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PainelFuncionarioLayout>
  );
}