import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = '/api'

const PORTE_OPTS = ['Pequeno', 'Médio', 'Grande']
const ETARIA_OPTS = ['Filhote', 'Jovem', 'Adulto', 'Idoso']

function getToken() { try { return localStorage.getItem('chew_token') || '' } catch { return '' } }
function getCliente() { try { return JSON.parse(localStorage.getItem('chew_cliente') || '{}') } catch { return {} } }
function getUser() { try { return localStorage.getItem('chew_user') || 'você' } catch { return 'você' } }

function PawIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 100 100" fill="currentColor">
      <ellipse cx="28" cy="22" rx="11" ry="14" />
      <ellipse cx="50" cy="14" rx="11" ry="14" />
      <ellipse cx="72" cy="22" rx="11" ry="14" />
      <ellipse cx="16" cy="46" rx="10" ry="13" />
      <ellipse cx="84" cy="46" rx="10" ry="13" />
      <path d="M50 38 C28 38 18 55 20 70 C22 85 35 92 50 92 C65 92 78 85 80 70 C82 55 72 38 50 38Z" />
    </svg>
  )
}

function PetCard({ pet, onUpdated }) {
  const [expanded, setExpanded] = useState(false)

  const porteColor = { Pequeno: '#1B888D', Médio: '#E8530E', Grande: '#16313b' }
  const etariaColor = { Filhote: '#F6B500', Jovem: '#1B888D', Adulto: '#E8530E', Idoso: '#888' }

  return (
    <div
      id={`pet-card-${pet.id_pet}`}
      style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 6px 24px rgba(22,49,59,.10)',
        padding: expanded ? '22px 22px 18px' : '20px 22px',
        transition: 'all .3s',
        border: expanded ? '2px solid #1B888D' : '2px solid transparent',
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg,#1B888D,#16313b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', flexShrink: 0,
        }}>
          <PawIcon />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, color: '#16313b' }}>{pet.nome}</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{pet.raca || 'Raça não informada'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {pet.porte && (
            <span style={{ background: porteColor[pet.porte] + '18', color: porteColor[pet.porte], borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
              {pet.porte}
            </span>
          )}
          {pet.faixa_etaria && (
            <span style={{ background: etariaColor[pet.faixa_etaria] + '22', color: etariaColor[pet.faixa_etaria], borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
              {pet.faixa_etaria}
            </span>
          )}
        </div>
        <span style={{ color: '#aaa', fontSize: 18, marginLeft: 6, transition: 'transform .25s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </div>

      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', textTransform: 'uppercase' }}>Raça</div>
              <div style={{ fontSize: 14, color: '#333', marginTop: 2 }}>{pet.raca || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', textTransform: 'uppercase' }}>Porte</div>
              <div style={{ fontSize: 14, color: '#333', marginTop: 2 }}>{pet.porte || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', textTransform: 'uppercase' }}>Faixa etária</div>
              <div style={{ fontSize: 14, color: '#333', marginTop: 2 }}>{pet.faixa_etaria || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', textTransform: 'uppercase' }}>ID</div>
              <div style={{ fontSize: 14, color: '#333', marginTop: 2 }}>#{pet.id_pet}</div>
            </div>
          </div>
          {pet.hist_medico && (
            <div style={{ marginTop: 12, background: '#f8fffe', borderRadius: 12, padding: '12px 14px', border: '1px solid #d9f0ef' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1B888D', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 4 }}>Histórico médico</div>
              <div style={{ fontSize: 13.5, color: '#444', lineHeight: 1.5 }}>{pet.hist_medico}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NovoPetForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({ nome: '', raca: '', porte: '', faixa_etaria: '', hist_medico: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome.trim()) { setError('Nome do pet é obrigatório.'); return }
    setError('')
    setLoading(true)
    try {
      const body = {
        nome: form.nome.trim(),
        raca: form.raca.trim() || undefined,
        porte: form.porte || undefined,
        faixa_etaria: form.faixa_etaria || undefined,
        hist_medico: form.hist_medico.trim() || undefined,
      }
      const res = await fetch(`${API}/pets/meus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.errors?.[0]?.message || data.message || 'Erro ao cadastrar pet.'
        setError(msg)
        return
      }
      onCreated(data)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const field = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 10,
    fontSize: 14, color: '#333', outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Nunito', sans-serif", background: '#fafafa',
  }
  const lbl = { display: 'block', fontSize: 12, fontWeight: 700, color: '#4a4255', marginBottom: 5, letterSpacing: '.2px' }

  return (
    <form id="form-novo-pet" onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: '24px 22px', boxShadow: '0 8px 28px rgba(27,136,141,.12)', border: '2px solid #1B888D' }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18, color: '#1B888D', marginBottom: 18 }}>
        🐾 Cadastrar novo pet
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={lbl}>Nome do pet *</label>
          <input id="pet-nome" required style={field} placeholder="Ex: Luna" value={form.nome} onChange={e => set('nome', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Raça</label>
          <input id="pet-raca" style={field} placeholder="Ex: Labrador" value={form.raca} onChange={e => set('raca', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Porte</label>
          <select id="pet-porte" style={{ ...field, cursor: 'pointer' }} value={form.porte} onChange={e => set('porte', e.target.value)}>
            <option value="">Selecione...</option>
            {PORTE_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Faixa etária</label>
          <select id="pet-faixa-etaria" style={{ ...field, cursor: 'pointer' }} value={form.faixa_etaria} onChange={e => set('faixa_etaria', e.target.value)}>
            <option value="">Selecione...</option>
            {ETARIA_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Histórico médico</label>
          <input id="pet-hist" style={field} placeholder="Alergias, vacinas, etc." value={form.hist_medico} onChange={e => set('hist_medico', e.target.value)} />
        </div>
      </div>

      {error && <p style={{ color: '#c0392b', fontSize: 12.5, fontWeight: 700, margin: '12px 0 0' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button
          id="btn-salvar-pet"
          type="submit"
          disabled={loading}
          style={{ flex: 1, height: 42, border: 'none', borderRadius: 10, background: '#1B888D', color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: loading ? .65 : 1 }}
        >
          {loading ? 'Salvando...' : 'Salvar pet'}
        </button>
        <button
          id="btn-cancelar-pet"
          type="button"
          onClick={onCancel}
          style={{ height: 42, padding: '0 22px', border: '1.5px solid #ccc', borderRadius: 10, background: '#fff', color: '#666', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function MeusPets() {
  const navigate = useNavigate()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const cliente = getCliente()
  const nome = getUser()

  useEffect(() => {
    const token = getToken()
    if (!token) { navigate('/login'); return }
    fetch(`${API}/pets/meus`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => setPets(data))
      .catch(code => {
        if (code === 401) { navigate('/login'); return }
        setError('Não foi possível carregar seus pets.')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  function handleCreated(pet) {
    setPets(prev => [pet, ...prev])
    setShowForm(false)
  }

  function logout() {
    try {
      localStorage.removeItem('chew_logged_in')
      localStorage.removeItem('chew_user')
      localStorage.removeItem('chew_token')
      localStorage.removeItem('chew_cliente')
    } catch { }
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ECEAE4', fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <header style={{
        background: '#16313b',
        padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0,0,0,.18)',
      }}>
        <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 28, color: '#F6B500', textDecoration: 'none', letterSpacing: '.5px' }}>
          CHEW!!
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/produtos" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#cde', textDecoration: 'none' }}>Produtos</Link>
          <Link to="/agendar" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#cde', textDecoration: 'none' }}>Agendar</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', borderRadius: 30, padding: '6px 8px 6px 18px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1B888D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <PawIcon />
            </div>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff' }}>Olá, {nome}</span>
            <button onClick={logout} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 13, color: '#16313b', background: '#F6B500', borderRadius: 30, padding: '6px 16px', border: 'none', cursor: 'pointer', marginLeft: 4 }}>
              Sair
            </button>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>

        {/* Page title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 36, color: '#16313b', margin: 0, lineHeight: 1.1 }}>
              Meus Pets 🐾
            </h1>
            <p style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
              {cliente.nome ? `Olá, ${cliente.nome.split(' ')[0]}! ` : ''}Gerencie os seus companheiros.
            </p>
          </div>
          {!showForm && (
            <button
              id="btn-novo-pet"
              onClick={() => setShowForm(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                height: 44, padding: '0 22px', border: 'none', borderRadius: 12,
                background: '#E8530E', color: '#fff',
                fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15,
                cursor: 'pointer', boxShadow: '0 8px 20px rgba(232,83,14,.28)',
              }}
            >
              + Cadastrar pet
            </button>
          )}
        </div>

        {/* Form novo pet */}
        {showForm && (
          <div style={{ marginBottom: 28 }}>
            <NovoPetForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🐾</div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18 }}>Carregando seus pets...</div>
          </div>
        )}

        {!loading && error && (
          <div style={{ background: '#fdf0ed', border: '1.5px solid #f5b4a4', borderRadius: 14, padding: '18px 20px', color: '#c0392b', fontSize: 14, fontWeight: 600 }}>
            {error}
          </div>
        )}

        {!loading && !error && pets.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🐶</div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, color: '#16313b', marginBottom: 8 }}>
              Nenhum pet cadastrado ainda
            </div>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
              Adicione seus companheiros para facilitar o agendamento de serviços!
            </p>
            <button
              id="btn-primeiro-pet"
              onClick={() => setShowForm(true)}
              style={{
                height: 44, padding: '0 28px', border: 'none', borderRadius: 12,
                background: '#1B888D', color: '#fff',
                fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Cadastrar meu primeiro pet
            </button>
          </div>
        )}

        {!loading && !error && pets.length > 0 && (
          <>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 14, fontWeight: 600 }}>
              {pets.length} pet{pets.length !== 1 ? 's' : ''} cadastrado{pets.length !== 1 ? 's' : ''}
            </div>
            <div id="lista-pets" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {pets.map(pet => (
                <PetCard key={pet.id_pet} pet={pet} />
              ))}
            </div>
          </>
        )}

        {/* Atalhos */}
        {!loading && (
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Link
              to="/agendar"
              id="link-agendar"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: '#16313b', borderRadius: 18, padding: '18px 22px',
                textDecoration: 'none', color: '#fff',
                boxShadow: '0 8px 22px rgba(22,49,59,.22)',
                transition: 'transform .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: 32 }}>📅</span>
              <div>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 17 }}>Agendar serviço</div>
                <div style={{ fontSize: 12, color: '#9ab', marginTop: 2 }}>Banho, tosa, veterinário</div>
              </div>
            </Link>
            <Link
              to="/produtos"
              id="link-produtos"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: '#E8530E', borderRadius: 18, padding: '18px 22px',
                textDecoration: 'none', color: '#fff',
                boxShadow: '0 8px 22px rgba(232,83,14,.22)',
                transition: 'transform .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: 32 }}>🛍️</span>
              <div>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 17 }}>Ver produtos</div>
                <div style={{ fontSize: 12, color: '#fcc', marginTop: 2 }}>Rações, brinquedos e mais</div>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
