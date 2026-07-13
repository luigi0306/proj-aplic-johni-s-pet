import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./painel-funcionario.css";

// Cargos com acesso, e para onde cada um é redirecionado após o login
const CARGOS_COM_ACESSO = {
  Gerente: "/funcionario/prontuario",
  Atendente: "/funcionario/prontuario",
  Veterinario: "/funcionario/agendamentos",
  Limpeza: "/funcionario/limpeza",
};

export default function LoginFuncionario() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/funcionarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || data.error || "Email ou senha inválidos.");
      }

      const { token, funcionario } = await response.json();

      localStorage.setItem("chew_funcionario_token", token);
      localStorage.setItem("chew_funcionario_logado", "true");
      localStorage.setItem("chew_funcionario_cargo", funcionario.cargo);
      localStorage.setItem("chew_funcionario_email", funcionario.email);
      localStorage.setItem("chew_funcionario_nome", funcionario.nome);

      navigate(CARGOS_COM_ACESSO[funcionario.cargo] || "/funcionario/prontuario");
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="chew-login-page" style={{ position: "relative" }}>
      <Link
        to="/"
        title="Voltar para a loja"
        style={{
          position: "fixed",
          bottom: "28px",
          left: "28px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#eb5e28",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,.28)",
          zIndex: 30,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="65" rx="26" ry="22" fill="#fff" />
          <ellipse cx="22" cy="30" rx="11" ry="14" fill="#fff" />
          <ellipse cx="46" cy="18" rx="11" ry="14" fill="#fff" />
          <ellipse cx="72" cy="20" rx="11" ry="14" fill="#fff" />
          <ellipse cx="90" cy="38" rx="10" ry="13" fill="#fff" />
        </svg>
      </Link>

      <div className="chew-login-card">
        <p className="chew-login-tag">Área interna</p>
        <h1 className="chew-login-title">Login do funcionário</h1>

        <form onSubmit={handleSubmit}>
          <label className="chew-login-field-label">Email</label>
          <input
            type="email"
            className="chew-login-input"
            placeholder="funcionario@chew.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="chew-login-field-label">Senha</label>
          <input
            type="password"
            className="chew-login-input"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />


          <p className="chew-login-hint">

          </p>

          {erro && <div className="chew-login-alert">{erro}</div>}

          <button type="submit" className="chew-btn-orange">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}