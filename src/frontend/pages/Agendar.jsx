import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'

const navStyle = { fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(255,255,255,.6)' }
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const ALL_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']

function isLogged() { try { return localStorage.getItem('chew_logged_in') === '1' } catch { return false } }
function getServico() { try { return new URLSearchParams(window.location.search).get('servico') || 'vet' } catch { return 'vet' } }
const fmtDate = (d) => d.getDate() + ' de ' + MONTHS[d.getMonth()];

function Agendar() {
  const navigate = useNavigate()
  const servico = getServico()
  const now = new Date()
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [sel, setSel] = useState(null)
  const [slot, setSlot] = useState(null)
  const [sent, setSent] = useState(false)

  // API states
  const [services, setServices] = useState([])
  const [employees, setEmployees] = useState([])
  const [clients, setClients] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

  // Selection states
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedPetId, setSelectedPetId] = useState('')

  // Form states for NEW client
  const [newClientName, setNewClientName] = useState('')
  const [newClientCpf, setNewClientCpf] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newClientAddress, setNewClientAddress] = useState('')

  // Form states for NEW pet
  const [newPetName, setNewPetName] = useState('')
  const [newPetBreed, setNewPetBreed] = useState('')
  const [newPetSize, setNewPetSize] = useState('Médio')
  const [newPetAge, setNewPetAge] = useState('Adulto')
  const [newPetHistory, setNewPetHistory] = useState('')

  // Submission states
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // gate de login: se não estiver logado, manda pro login
  useEffect(() => {
    if (!isLogged()) {
      try { localStorage.setItem('chew_after_login', '/agendar') } catch { }
      navigate('/login')
    }
  }, [])

  // Load datasets from API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [resSvc, resEmp, resCli, resPet] = await Promise.all([
          fetch('http://localhost:3000/api/servicos').then(r => {
            if (!r.ok) throw new Error('Falha ao buscar serviços.')
            return r.json()
          }),
          fetch('http://localhost:3000/api/funcionarios').then(r => {
            if (!r.ok) throw new Error('Falha ao buscar profissionais.')
            return r.json()
          }),
          fetch('http://localhost:3000/api/clientes').then(r => {
            if (!r.ok) throw new Error('Falha ao buscar clientes.')
            return r.json()
          }),
          fetch('http://localhost:3000/api/pets').then(r => {
            if (!r.ok) throw new Error('Falha ao buscar pets.')
            return r.json()
          })
        ])
        setServices(resSvc)
        setEmployees(resEmp)
        setClients(resCli)
        setPets(resPet)
      } catch (err) {
        console.error(err)
        setApiError('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3000.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const { y, m } = ym
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const startDow = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let dn = 1; dn <= daysInMonth; dn++) cells.push(new Date(y, m, dn))

  // Service filters
  const filteredServices = services.filter(s => {
    const name = (s.nome || '').toLowerCase()
    if (servico === 'tosa') {
      return name.includes('banho') || name.includes('tosa') || name.includes('unha') || name.includes('pelagem')
    } else {
      return name.includes('consulta') || name.includes('vacina') || name.includes('pulgas') || name.includes('exame') || name.includes('cirurgia')
    }
  })
  const displayServices = filteredServices.length > 0 ? filteredServices : services

  // Employee filters
  const filteredEmployees = employees.filter(e => {
    if (servico === 'tosa') {
      return e.cargo === 'Groomer'
    } else {
      return e.cargo === 'Gerente' || e.cargo === 'Atendente' || e.cargo === 'Groomer'
    }
  })
  const displayEmployees = filteredEmployees.length > 0 ? filteredEmployees : employees

  // Filter pets by selected client
  const clientPets = pets.filter(p => p.id_cliente === Number(selectedClientId))

  const selectedService = services.find(s => s.id_servico === Number(selectedServiceId))
  const selectedEmployee = employees.find(e => e.id_funcionario === Number(selectedEmployeeId))

  const isClientReady = selectedClientId && (selectedClientId !== 'new' || (newClientName && newClientCpf && newClientPhone && newClientAddress))
  const isPetReady = selectedPetId && (selectedPetId !== 'new' || newPetName)
  const ready = sel && slot && selectedServiceId && selectedEmployeeId && isClientReady && isPetReady

  const selectedServiceName = selectedService ? selectedService.nome : '—'
  const summary = ready ? `${fmtDate(sel)} • ${slot} • ${selectedServiceName}` : 'Selecione data, horário, tutor, pet, serviço e profissional'
  const heading = servico === 'tosa' ? 'Agende o banho do seu pet' : 'Agende a consulta do seu pet'

  function prevMonth() { setYm((s) => { let mm = s.m - 1, yy = s.y; if (mm < 0) { mm = 11; yy-- } return { y: yy, m: mm } }) }
  function nextMonth() { setYm((s) => { let mm = s.m + 1, yy = s.y; if (mm > 11) { mm = 0; yy++ } return { y: yy, m: mm } }) }

  const formatDateForApi = (d) => {
    if (!d) return ''
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  async function confirm() {
    if (!ready) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      let finalClientId = Number(selectedClientId)

      // 1. Cadastra novo cliente se selecionado
      if (selectedClientId === 'new') {
        const clientRes = await fetch('http://localhost:3000/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cpf: newClientCpf,
            nome: newClientName,
            telefone: newClientPhone,
            endereco: newClientAddress
          })
        })
        if (!clientRes.ok) {
          const errData = await clientRes.json().catch(() => ({}))
          throw new Error(errData.error?.message || errData.error || 'Erro ao cadastrar tutor/cliente.')
        }
        const createdClient = await clientRes.json()
        finalClientId = createdClient.id_cliente
      }

      let finalPetId = Number(selectedPetId)

      // 2. Cadastra novo pet se selecionado
      if (selectedPetId === 'new') {
        const petRes = await fetch('http://localhost:3000/api/pets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: newPetName,
            raca: newPetBreed || null,
            porte: newPetSize || null,
            faixa_etaria: newPetAge || null,
            hist_medico: newPetHistory || null,
            id_cliente: finalClientId
          })
        })
        if (!petRes.ok) {
          const errData = await petRes.json().catch(() => ({}))
          throw new Error(errData.error?.message || errData.error || 'Erro ao cadastrar pet.')
        }
        const createdPet = await petRes.json()
        finalPetId = createdPet.id_pet
      }

      // 3. Envia o agendamento
      const appointmentBody = {
        id_pet: finalPetId,
        id_funcionario: Number(selectedEmployeeId),
        data_agendamento: formatDateForApi(sel),
        hora: slot,
        status: 'Agendado',
        valor_total: Number(selectedService.preco_base),
        servicos: [
          {
            id_servico: Number(selectedService.id_servico),
            preco_cobrado: Number(selectedService.preco_base)
          }
        ]
      }

      const appointmentRes = await fetch('http://localhost:3000/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentBody)
      })

      if (!appointmentRes.ok) {
        const errData = await appointmentRes.json().catch(() => ({}))
        throw new Error(errData.error?.message || errData.error || 'Erro ao realizar agendamento.')
      }

      setSent(true)
      window.scrollTo(0, 0)
    } catch (err) {
      console.error(err)
      setSubmitError(err.message || 'Erro inesperado ao realizar o agendamento.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ background: '#F2FAFB', minHeight: '100vh', display: 'flex', justifyContent: 'center', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 1180, background: '#F2FAFB', position: 'relative' }}>

        {/* cabeçalho */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(120,183,118,.3)', background: '#C4EEB8' }}>
          <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, textDecoration: 'none', letterSpacing: '.5px', color: '#16313b' }}>CHEW!!</Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/servicos" style={navStyle}>Serviços</Link>
            <Link to="/veterinaria" style={{ ...navStyle, color: '#fff', background: '#1B888D' }}>Veterinária</Link>
            <Link to="/adocao" style={navStyle}>Adoção</Link>
            <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px' }}>Entre</Link>
          </nav>
        </header>

        {!sent ? (
          <>
            {/* intro */}
            <Reveal>
              <section style={{ textAlign: 'center', padding: '44px 40px 8px' }}>
                <Link to="/veterinaria" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, color: '#0E8C9E', textDecoration: 'none', marginBottom: 12 }}>← Voltar para a clínica</Link>
                <div style={{ display: 'inline-block', background: '#fff', color: '#0E8C9E', fontWeight: 800, fontSize: 12, letterSpacing: '1.5px', padding: '7px 16px', borderRadius: 30, marginBottom: 14, boxShadow: '0 4px 12px rgba(14,140,158,.12)' }}>AGENDA ONLINE</div>
                <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 46, lineHeight: 1, color: '#16313b', margin: '0 0 10px' }}>{heading}</h1>
                <p style={{ fontSize: 16, color: '#7a8a8d', margin: '0 auto', maxWidth: 480 }}>Escolha o dia e o horário ideais. Simples, rápido e sem filas. 🐾</p>
              </section>
            </Reveal>

            {/* Error Banners */}
            {apiError && (
              <Reveal>
                <div style={{ background: '#FDD8D8', color: '#900', border: '1.5px solid #FCC', padding: '14px 20px', borderRadius: 16, margin: '10px 40px 0', fontWeight: 600, fontSize: 14 }}>
                  ⚠️ {apiError}
                </div>
              </Reveal>
            )}
            {submitError && (
              <Reveal>
                <div style={{ background: '#FDD8D8', color: '#900', border: '1.5px solid #FCC', padding: '14px 20px', borderRadius: 16, margin: '10px 40px 0', fontWeight: 600, fontSize: 14 }}>
                  ⚠️ Erro ao salvar agendamento: {submitError}
                </div>
              </Reveal>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 40px', fontSize: 18, color: '#7a8a8d', fontWeight: 600 }}>
                Carregando dados da clínica... 🐾
              </div>
            ) : (
              /* agenda */
              <Reveal>
                <section style={{ padding: '24px 40px 60px', display: 'flex', gap: 26, alignItems: 'flex-start' }}>
                  {/* calendario*/}
                  <div style={{ flex: '0 0 440px', background: '#fff', borderRadius: 26, padding: '26px 28px', boxShadow: '0 12px 32px rgba(0,0,0,.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <button onClick={prevMonth} style={{ width: 40, height: 40, borderRadius: 12, border: 'none', background: '#EAF6F8', color: '#0E8C9E', fontSize: 20, cursor: 'pointer' }}>‹</button>
                      <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 22, color: '#16313b' }}>{MONTHS[m]} {y}</span>
                      <button onClick={nextMonth} style={{ width: 40, height: 40, borderRadius: 12, border: 'none', background: '#EAF6F8', color: '#0E8C9E', fontSize: 20, cursor: 'pointer' }}>›</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 6 }}>
                      {WEEKDAYS.map((w) => <div key={w} style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#a9b8bb', padding: '4px 0' }}>{w}</div>)}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
                      {cells.map((date, i) => {
                        if (!date) return <div key={i}></div>
                        const isPast = date < today
                        const isSunday = date.getDay() === 0
                        const disabled = isPast || isSunday
                        const selected = sel && sel.getTime() === date.getTime()
                        let bg = '#EAF6F8', color = '#16313b', shadow = 'none'
                        if (selected) { bg = '#0E8C9E'; color = '#fff'; shadow = '0 6px 14px rgba(14,140,158,.35)' }
                        else if (disabled) { bg = '#f4f4f4'; color = '#c7cfd1' }
                        return (
                          <button key={i} disabled={disabled} onClick={() => { setSel(date); setSlot(null) }} style={{ height: 42, border: 'none', borderRadius: 12, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer', background: bg, color, boxShadow: shadow }}>{date.getDate()}</button>
                        )
                      })}
                    </div>
                  </div>

                  {/* horarios + forms */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ background: '#fff', borderRadius: 26, padding: '24px 26px', boxShadow: '0 12px 32px rgba(0,0,0,.06)' }}>
                      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: '#16313b', margin: '0 0 4px' }}>Horários para {sel ? fmtDate(sel) : '—'}</h3>
                      <p style={{ fontSize: 13, color: '#9aa8ab', margin: '0 0 16px' }}>Selecione o melhor horário para vocês.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
                        {ALL_SLOTS.map((t) => {
                          const active = slot === t
                          const enabled = !!sel
                          return (
                            <button key={t} onClick={() => enabled && setSlot(t)} style={{ height: 42, border: `1.5px solid ${active ? '#0E8C9E' : '#d8eaee'}`, borderRadius: 11, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13.5, cursor: enabled ? 'pointer' : 'not-allowed', background: active ? '#0E8C9E' : (enabled ? '#fff' : '#fafafa'), color: active ? '#fff' : (enabled ? '#16313b' : '#c7cfd1') }}>{t}</button>
                          )
                        })}
                      </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: 26, padding: '24px 26px', boxShadow: '0 12px 32px rgba(0,0,0,.06)' }}>
                      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: '#16313b', margin: '0 0 16px' }}>Dados do atendimento</h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Seleção do Tutor / Cliente */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#4a5558' }}>Tutor / Cliente</label>
                          <select
                            value={selectedClientId}
                            onChange={(e) => {
                              setSelectedClientId(e.target.value);
                              setSelectedPetId('');
                            }}
                            style={{ width: '100%', height: 46, border: '1.5px solid #d8eaee', borderRadius: 12, padding: '0 14px', fontSize: 14 }}
                          >
                            <option value="">Selecione um cliente cadastrado...</option>
                            <option value="new">+ Cadastrar Novo Cliente</option>
                            {clients.map(c => (
                              <option key={c.id_cliente} value={c.id_cliente}>
                                {c.nome} (CPF: {c.cpf})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Formulário de Novo Cliente */}
                        {selectedClientId === 'new' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 14px', background: '#fcf8f2', border: '1px dashed #e8c6a0', padding: 16, borderRadius: 16 }}>
                            <div style={{ gridColumn: '1 / -1', fontWeight: 700, fontSize: 14, color: '#8c5310' }}>Dados do Novo Tutor</div>
                            <div>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a5558', marginBottom: 4 }}>Nome Completo</label>
                              <input type="text" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Ex: João da Silva" style={{ width: '100%', height: 40, border: '1.5px solid #d8eaee', borderRadius: 10, padding: '0 12px', fontSize: 13 }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a5558', marginBottom: 4 }}>CPF</label>
                              <input type="text" value={newClientCpf} onChange={(e) => setNewClientCpf(e.target.value)} placeholder="Ex: 123.456.789-00" style={{ width: '100%', height: 40, border: '1.5px solid #d8eaee', borderRadius: 10, padding: '0 12px', fontSize: 13 }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a5558', marginBottom: 4 }}>Telefone</label>
                              <input type="tel" value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} placeholder="Ex: (61) 99999-9999" style={{ width: '100%', height: 40, border: '1.5px solid #d8eaee', borderRadius: 10, padding: '0 12px', fontSize: 13 }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a5558', marginBottom: 4 }}>Endereço</label>
                              <input type="text" value={newClientAddress} onChange={(e) => setNewClientAddress(e.target.value)} placeholder="Ex: Av. Central, 123" style={{ width: '100%', height: 40, border: '1.5px solid #d8eaee', borderRadius: 10, padding: '0 12px', fontSize: 13 }} />
                            </div>
                          </div>
                        )}

                        {/* Seleção do Pet */}
                        {(selectedClientId && selectedClientId !== '') && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#4a5558' }}>Pet</label>
                            <select
                              value={selectedPetId}
                              onChange={(e) => setSelectedPetId(e.target.value)}
                              style={{ width: '100%', height: 46, border: '1.5px solid #d8eaee', borderRadius: 12, padding: '0 14px', fontSize: 14 }}
                            >
                              <option value="">Selecione o pet...</option>
                              <option value="new">+ Cadastrar Novo Pet</option>
                              {selectedClientId !== 'new' && clientPets.map(p => (
                                <option key={p.id_pet} value={p.id_pet}>
                                  {p.nome} {p.raca ? `(${p.raca})` : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Formulário de Novo Pet */}
                        {selectedPetId === 'new' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 14px', background: '#f2f8f8', border: '1px dashed #b2d8d8', padding: 16, borderRadius: 16 }}>
                            <div style={{ gridColumn: '1 / -1', fontWeight: 700, fontSize: 14, color: '#1B6FB0' }}>Dados do Novo Pet</div>
                            <div>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a5558', marginBottom: 4 }}>Nome do Pet</label>
                              <input type="text" value={newPetName} onChange={(e) => setNewPetName(e.target.value)} placeholder="Ex: Mel" style={{ width: '100%', height: 40, border: '1.5px solid #d8eaee', borderRadius: 10, padding: '0 12px', fontSize: 13 }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a5558', marginBottom: 4 }}>Raça</label>
                              <input type="text" value={newPetBreed} onChange={(e) => setNewPetBreed(e.target.value)} placeholder="Ex: Golden Retriever" style={{ width: '100%', height: 40, border: '1.5px solid #d8eaee', borderRadius: 10, padding: '0 12px', fontSize: 13 }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a5558', marginBottom: 4 }}>Porte</label>
                              <select value={newPetSize} onChange={(e) => setNewPetSize(e.target.value)} style={{ width: '100%', height: 40, border: '1.5px solid #d8eaee', borderRadius: 10, padding: '0 12px', fontSize: 13 }}>
                                <option value="Pequeno">Pequeno</option>
                                <option value="Médio">Médio</option>
                                <option value="Grande">Grande</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a5558', marginBottom: 4 }}>Faixa Etária</label>
                              <select value={newPetAge} onChange={(e) => setNewPetAge(e.target.value)} style={{ width: '100%', height: 40, border: '1.5px solid #d8eaee', borderRadius: 10, padding: '0 12px', fontSize: 13 }}>
                                <option value="Filhote">Filhote</option>
                                <option value="Adulto">Adulto</option>
                                <option value="Idoso">Idoso</option>
                              </select>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a5558', marginBottom: 4 }}>Histórico Médico / Observações</label>
                              <input type="text" value={newPetHistory} onChange={(e) => setNewPetHistory(e.target.value)} placeholder="Ex: Alergias, vacinas pendentes..." style={{ width: '100%', height: 40, border: '1.5px solid #d8eaee', borderRadius: 10, padding: '0 12px', fontSize: 13 }} />
                            </div>
                          </div>
                        )}

                        {/* Seleção do Serviço */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#4a5558' }}>Serviço desejado</label>
                          <select
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            style={{ width: '100%', height: 46, border: '1.5px solid #d8eaee', borderRadius: 12, padding: '0 14px', fontSize: 14 }}
                          >
                            <option value="">Selecione o serviço...</option>
                            {displayServices.map(s => (
                              <option key={s.id_servico} value={s.id_servico}>
                                {s.nome} (R$ {Number(s.preco_base).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Seleção do Profissional */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#4a5558' }}>Profissional</label>
                          <select
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            style={{ width: '100%', height: 46, border: '1.5px solid #d8eaee', borderRadius: 12, padding: '0 14px', fontSize: 14 }}
                          >
                            <option value="">Selecione o profissional...</option>
                            {displayEmployees.map(e => (
                              <option key={e.id_funcionario} value={e.id_funcionario}>
                                {e.nome} ({e.cargo})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F2FAFB', borderRadius: 16, padding: '14px 18px', marginTop: 18 }}>
                        <span style={{ width: 42, height: 42, borderRadius: 12, background: '#B8E8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8C9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></svg>
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#9aa8ab', textTransform: 'uppercase', letterSpacing: '.5px' }}>Resumo</div>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b' }}>{summary}</div>
                        </div>
                      </div>

                      <button
                        onClick={confirm}
                        disabled={!ready || submitting}
                        style={{
                          width: '100%',
                          height: 50,
                          marginTop: 18,
                          border: 'none',
                          borderRadius: 14,
                          fontFamily: "'Fredoka', sans-serif",
                          fontWeight: 600,
                          fontSize: 16,
                          background: ready && !submitting ? '#E8530E' : '#dfe7e8',
                          color: ready && !submitting ? '#fff' : '#9aa8ab',
                          cursor: ready && !submitting ? 'pointer' : 'not-allowed',
                          boxShadow: ready && !submitting ? '0 10px 24px rgba(232,83,14,.3)' : 'none'
                        }}
                      >
                        {submitting ? 'Confirmando agendamento...' : 'Confirmar agendamento'}
                      </button>
                    </div>
                  </div>
                </section>
              </Reveal>
            )}
          </>
        ) : (
          /* sucesso pra agendar */
          <Reveal>
            <section style={{ padding: '70px 40px 90px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 560, background: '#fff', borderRadius: 30, padding: '50px 44px', textAlign: 'center', boxShadow: '0 14px 38px rgba(0,0,0,.08)' }}>
                <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#B8E8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
                  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#0E8C9E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
                </div>
                <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 36, color: '#16313b', margin: '0 0 12px' }}>Agendamento confirmado! 🎉</h1>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: '#7a8a8d', margin: '0 0 8px' }}>Seu horário está reservado para:</p>
                <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20, color: '#0E8C9E', margin: '0 0 26px' }}>{summary}</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/veterinaria" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', background: '#16313b', textDecoration: 'none', borderRadius: 13, padding: '13px 28px' }}>Voltar para a clínica</Link>
                  <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', background: '#F2FAFB', textDecoration: 'none', borderRadius: 13, padding: '13px 28px' }}>Início</Link>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* RODAPÉ */}
        <footer style={{ background: '#123542', padding: '40px 44px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <nav style={{ display: 'flex', gap: 30 }}>
              <Link to="/sobre" style={footLink}>Sobre</Link>
              <Link to="/servicos" style={footLink}>Serviços</Link>
              <Link to="/veterinaria" style={footLink}>Veterinária</Link>
              <Link to="/adocao" style={footLink}>Adoção</Link>
            </nav>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default Agendar
