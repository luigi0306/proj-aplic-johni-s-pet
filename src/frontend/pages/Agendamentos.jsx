import { useState, useEffect } from "react";
import PainelFuncionarioLayout from "../components/PainelFuncionarioLayout";
import "./painel-funcionario.css";

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const ALL_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

const LABEL_STATUS = {
  'Agendado': "Agendado",
  'Confirmado': "Confirmado",
  'Concluído': "Concluído",
  'Cancelado': "Cancelado",
};

const OPCOES_STATUS = ["Agendado", "Confirmado", "Concluído", "Cancelado"];

const STATUS_CLASS_MAP = {
  'Agendado': 'agendado',
  'Confirmado': 'confirmado',
  'Concluído': 'concluido',
  'Cancelado': 'cancelado'
};

function formatDateForDisplay(dStr) {
  if (!dStr) return '—';
  try {
    const cleanStr = dStr.split('T')[0];
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
      const monthIndex = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      return `${day} de ${MONTHS[monthIndex]}`;
    }
  } catch (e) {}
  return dStr;
}

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [hora, setHora] = useState("");

  // Load all datasets from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [resAge, resCli, resPet, resSvc, resEmp] = await Promise.all([
          fetch('/api/agendamentos').then(r => {
            if (!r.ok) throw new Error('Falha ao buscar agendamentos.');
            return r.json();
          }),
          fetch('/api/clientes').then(r => {
            if (!r.ok) throw new Error('Falha ao buscar clientes.');
            return r.json();
          }),
          fetch('/api/pets').then(r => {
            if (!r.ok) throw new Error('Falha ao buscar pets.');
            return r.json();
          }),
          fetch('/api/servicos').then(r => {
            if (!r.ok) throw new Error('Falha ao buscar serviços.');
            return r.json();
          }),
          fetch('/api/funcionarios').then(r => {
            if (!r.ok) throw new Error('Falha ao buscar profissionais.');
            return r.json();
          })
        ]);
        setAgendamentos(resAge);
        setClients(resCli);
        setPets(resPet);
        setServices(resSvc);
        setEmployees(resEmp);
      } catch (err) {
        console.error(err);
        setError(err.message || "Não foi possível conectar ao servidor.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function mudarStatus(idAgendamento, novoStatus) {
    fetch(`/api/agendamentos/${idAgendamento}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus })
    })
    .then(res => {
      if (!res.ok) throw new Error('Falha ao atualizar status.');
      setAgendamentos(prev => prev.map(a => a.id_agendamento === idAgendamento ? { ...a, status: novoStatus } : a));
    })
    .catch(err => {
      alert(err.message || 'Erro ao atualizar status.');
    });
  }

  function handleNovoAgendamento(e) {
    e.preventDefault();
    if (!selectedPetId || !dataAgendamento || !hora || !selectedServiceId || !selectedEmployeeId) return;

    const selectedService = services.find(s => s.id_servico === Number(selectedServiceId));
    if (!selectedService) return;

    const payload = {
      id_pet: Number(selectedPetId),
      id_funcionario: Number(selectedEmployeeId),
      data_agendamento: dataAgendamento,
      hora: hora,
      status: "Agendado",
      valor_total: Number(selectedService.preco_base),
      servicos: [
        {
          id_servico: Number(selectedService.id_servico),
          preco_cobrado: Number(selectedService.preco_base)
        }
      ]
    };

    fetch('/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Falha ao criar agendamento.');
      return res.json();
    })
    .then(() => {
      // Re-fetch agendamentos to populate relations automatically
      fetch('/api/agendamentos')
        .then(r => r.json())
        .then(data => {
          setAgendamentos(data);
          // Reset form inputs
          setSelectedClientId("");
          setSelectedPetId("");
          setSelectedServiceId("");
          setSelectedEmployeeId("");
          setDataAgendamento("");
          setHora("");
        });
    })
    .catch(err => {
      alert(err.message || 'Erro ao criar agendamento.');
    });
  }

  if (loading) {
    return (
      <PainelFuncionarioLayout>
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--chew-text-muted-light)", fontWeight: 600 }}>
          Carregando dados da clínica... 🐾
        </div>
      </PainelFuncionarioLayout>
    );
  }

  if (error) {
    return (
      <PainelFuncionarioLayout>
        <div style={{ padding: "3rem", textAlign: "center", color: "#a00", fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      </PainelFuncionarioLayout>
    );
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
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--chew-badge-agendado-text)" }}>{contagem.Agendado || 0}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--chew-text-muted-light)" }}>Agendados</div>
        </div>
        <div className="chew-panel" style={{ textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--chew-badge-confirmado-text)" }}>{contagem.Confirmado || 0}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--chew-text-muted-light)" }}>Confirmados</div>
        </div>
        <div className="chew-panel" style={{ textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--chew-badge-concluido-text)" }}>{contagem.Concluído || 0}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--chew-text-muted-light)" }}>Concluídos</div>
        </div>
        <div className="chew-panel" style={{ textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--chew-badge-cancelado-text)" }}>{contagem.Cancelado || 0}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--chew-text-muted-light)" }}>Cancelados</div>
        </div>
      </div>

      <div className="chew-content-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="chew-panel">
          <h2 className="chew-panel-title">Novo agendamento</h2>
          <form onSubmit={handleNovoAgendamento}>
            <label className="chew-field-label">Tutor</label>
            <select
              className="chew-input-dark"
              value={selectedClientId}
              onChange={function (e) {
                setSelectedClientId(e.target.value);
                setSelectedPetId("");
              }}
              required
            >
              <option value="">Selecione o tutor...</option>
              {clients.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nome} (CPF: {c.cpf})
                </option>
              ))}
            </select>

            <label className="chew-field-label">Pet</label>
            <select
              className="chew-input-dark"
              value={selectedPetId}
              onChange={function (e) { setSelectedPetId(e.target.value); }}
              disabled={!selectedClientId}
              required
            >
              <option value="">Selecione o pet...</option>
              {pets.filter(p => p.id_cliente === Number(selectedClientId)).map(p => (
                <option key={p.id_pet} value={p.id_pet}>
                  {p.nome}
                </option>
              ))}
            </select>

            <label className="chew-field-label">Serviço</label>
            <select
              className="chew-input-dark"
              value={selectedServiceId}
              onChange={function (e) { setSelectedServiceId(e.target.value); }}
              required
            >
              <option value="">Selecione o serviço...</option>
              {services.map(s => (
                <option key={s.id_servico} value={s.id_servico}>
                  {s.nome} (R$ {Number(s.preco_base).toFixed(2)})
                </option>
              ))}
            </select>

            <label className="chew-field-label">Profissional</label>
            <select
              className="chew-input-dark"
              value={selectedEmployeeId}
              onChange={function (e) { setSelectedEmployeeId(e.target.value); }}
              required
            >
              <option value="">Selecione o profissional...</option>
              {employees.map(e => (
                <option key={e.id_funcionario} value={e.id_funcionario}>
                  {e.nome} ({e.cargo})
                </option>
              ))}
            </select>

            <label className="chew-field-label">Data</label>
            <input
              type="date"
              className="chew-input-dark"
              value={dataAgendamento}
              onChange={function (e) { setDataAgendamento(e.target.value); }}
              required
            />

            <label className="chew-field-label">Horário</label>
            <select
              className="chew-input-dark"
              value={hora}
              onChange={function (e) { setHora(e.target.value); }}
              required
            >
              <option value="">Selecione o horário...</option>
              {ALL_SLOTS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
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
                    <tr key={a.id_agendamento}>
                      <td>{a.pet_name || '—'}</td>
                      <td>{a.cliente_name || '—'}</td>
                      <td>{formatDateForDisplay(a.data_agendamento)} • {a.hora ? a.hora.substring(0, 5) : '—'}</td>
                      <td>
                        <span className={"chew-badge " + (STATUS_CLASS_MAP[a.status] || 'agendado')}>
                          {LABEL_STATUS[a.status] || a.status}
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
              <th>Serviço(s)</th>
              <th>Status</th>
              <th>Atualizar</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map(function (a) {
              const serviceNames = a.servicos && Array.isArray(a.servicos)
                ? a.servicos.map(s => s.nome).join(', ')
                : '—';
              return (
                <tr key={a.id_agendamento}>
                  <td>{formatDateForDisplay(a.data_agendamento)}</td>
                  <td>{a.hora ? a.hora.substring(0, 5) : '—'}</td>
                  <td>{a.pet_name || '—'}</td>
                  <td>{serviceNames}</td>
                  <td>
                    <span className={"chew-badge " + (STATUS_CLASS_MAP[a.status] || 'agendado')}>
                      {LABEL_STATUS[a.status] || a.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="chew-input-dark"
                      style={{ marginBottom: 0, width: "auto", minWidth: "150px" }}
                      value={a.status}
                      onChange={function (e) { mudarStatus(a.id_agendamento, e.target.value); }}
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