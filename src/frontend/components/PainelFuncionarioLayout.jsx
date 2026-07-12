import { useNavigate, useLocation, Navigate } from "react-router-dom";
import "../pages/painel-funcionario.css";

const MENU_POR_CARGO = {
  Atendente: [
    { label: "Prontuário", path: "/funcionario/prontuario" },
    { label: "Clientes e Pets", path: "/funcionario/clientes-pets" },
    { label: "Agendamentos", path: "/funcionario/agendamentos" },
    { label: "Insumos", path: "/funcionario/insumos" },
  ],
  Gerente: [
    { label: "Prontuário", path: "/funcionario/prontuario" },
    { label: "Clientes e Pets", path: "/funcionario/clientes-pets" },
    { label: "Agendamentos", path: "/funcionario/agendamentos" },
    { label: "Insumos", path: "/funcionario/insumos" },
    { label: "Gerenciar equipe", path: "/funcionario/equipe" },
    { label: "Solicitações de adoção", path: "/funcionario/adocoes" },
    { label: "Relatório", path: "/funcionario/relatorio" },
  ],
  Veterinario: [
    { label: "Agendamentos", path: "/funcionario/agendamentos" },
    { label: "Prontuário", path: "/funcionario/prontuario" },
    { label: "Clientes e Pets", path: "/funcionario/clientes-pets" },
    { label: "Solicitações de adoção", path: "/funcionario/adocoes" },
  ],
  Limpeza: [
    { label: "Áreas de limpeza", path: "/funcionario/limpeza" },
  ],
};

export default function PainelFuncionarioLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logado = localStorage.getItem("chew_funcionario_logado") === "true";
  const cargo = localStorage.getItem("chew_funcionario_cargo");
  const email = localStorage.getItem("chew_funcionario_email") || "";

  if (!logado || !cargo || !MENU_POR_CARGO[cargo]) {
    return <Navigate to="/funcionario/login" replace />;
  }

  const menu = MENU_POR_CARGO[cargo];

  const rotaPermitida = menu.some(function (item) {
    return item.path === location.pathname;
  });

  if (!rotaPermitida) {
    return <Navigate to={menu[0].path} replace />;
  }

  function handleLogout() {
    localStorage.removeItem("chew_funcionario_logado");
    localStorage.removeItem("chew_funcionario_cargo");
    localStorage.removeItem("chew_funcionario_email");
    navigate("/funcionario/login");
  }

  function irPara(path) {
    navigate(path);
  }

  function getClasseMenu(path) {
    if (path === location.pathname) {
      return "chew-sidebar-item active";
    }
    return "chew-sidebar-item";
  }

  const usuarioNome = email ? email.split("@")[0] : cargo.toLowerCase();

  return (
    <div className="chew-painel">
      <aside className="chew-sidebar">
        <div className="chew-sidebar-logo">CHEW!!</div>
        <div className="chew-sidebar-subtitle">Painel do funcionário</div>

        <nav className="chew-sidebar-nav">
          {menu.map(function (item) {
            return (
              <a key={item.path} onClick={function () { irPara(item.path); }} className={getClasseMenu(item.path)}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="chew-sidebar-footer">
          <div className="chew-sidebar-user">{usuarioNome}</div>
          <div className="chew-sidebar-role">{cargo}</div>
          <button className="chew-sidebar-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="chew-content">{children}</main>
    </div>
  );
}