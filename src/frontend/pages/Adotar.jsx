import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#4a5558', marginBottom: 6 }
const fld = { width: '100%', height: 46, border: '1.5px solid #f0d9d4', borderRadius: 12, background: '#fff', padding: '0 14px', fontSize: 14, color: '#333', fontFamily: "'Nunito', sans-serif" }
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }

function getPet() {
  try { return new URLSearchParams(window.location.search).get('pet') || '' } catch { return '' }
}

function Adotar() {
  const pet = getPet()
  const [sent, setSent] = useState(false)
  const [nomeSolicitante, setNomeSolicitante] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [idade, setIdade] = useState('')
  const [tipoMoradia, setTipoMoradia] = useState('Casa com quintal')
  const [experiencia, setExperiencia] = useState('')
  const [termo, setTermo] = useState(false)

  const [availablePets, setAvailablePets] = useState([])
  const [selectedPet, setSelectedPet] = useState(pet)
  const [error, setError] = useState('')
  const [loadingPets, setLoadingPets] = useState(false)

  useEffect(() => {
    if (!pet) {
      setLoadingPets(true)
      fetch('http://localhost:3000/api/animais-adocao?status=Disponível')
        .then(res => res.json())
        .then(data => {
          setAvailablePets(data)
          if (data.length > 0) {
            setSelectedPet(data[0].nome)
          }
          setLoadingPets(false)
        })
        .catch(err => {
          console.error('Erro ao buscar animais:', err)
          setLoadingPets(false)
        })
    } else {
      setSelectedPet(pet)
    }
  }, [pet])

  function submit(e) {
    e.preventDefault()
    setError('')

    if (!selectedPet) {
      setError('Por favor, selecione um animal para adotar.')
      return
    }

    if (!termo) {
      setError('Você precisa aceitar o termo de responsabilidade.')
      return
    }

    const payload = {
      nome_animal: selectedPet,
      nome_solicitante: nomeSolicitante,
      telefone: telefone,
      email: email,
      idade_solicitante: Number(idade),
      tipo_moradia: tipoMoradia,
      id_cliente: null
    }

    fetch('http://localhost:3000/api/solicitacoes-adocao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error?.message || data.error || 'Erro ao enviar solicitação.')
        }
        setSent(true)
        window.scrollTo(0, 0)
      })
      .catch(err => {
        setError(err.message || 'Erro ao conectar ao servidor.')
      })
  }

  return (
    <div style={{ background: '#F2AFBC', minHeight: '100vh', display: 'flex', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: '100%', background: '#F2AFBC', position: 'relative' }}>

        {/* cabeçalho */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: '#9E182B', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(158,24,43,.3)' }}>
          <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, textDecoration: 'none', letterSpacing: '.5px', color: '#fff' }}>CHEW!!</Link>
          <Link to="/adocao" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', textDecoration: 'none', border: '2px solid #fff', borderRadius: 30, padding: '7px 20px' }}>← Voltar</Link>
        </header>

        {sent ? (
          /* tela de sucesso de adocao */
          <Reveal>
            <section style={{ padding: '70px 40px 90px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 560, background: '#fff', borderRadius: 30, padding: '50px 44px', textAlign: 'center', boxShadow: '0 14px 38px rgba(0,0,0,.08)' }}>
                <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#F2AFBC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
                  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#9E182B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z" /></svg>
                </div>
                <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 34, color: '#16313b', margin: '0 0 12px' }}>Pedido enviado! 🎉</h1>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: '#7a6a6a', margin: '0 0 26px' }}>
                  {selectedPet ? <>Seu interesse em adotar <strong>{selectedPet}</strong> foi registrado.</> : 'Seu pedido de adoção foi registrado.'}<br />
                  Em breve nossa equipe entra em contato para os próximos passos.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/adocao" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', background: '#9E182B', textDecoration: 'none', borderRadius: 13, padding: '13px 28px' }}>Ver outros bichinhos</Link>
                  <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#9E182B', background: '#fff', textDecoration: 'none', borderRadius: 13, padding: '13px 28px', border: '1.5px solid #F2AFBC' }}>Início</Link>
                </div>
              </div>
            </section>
          </Reveal>
        ) : (
          /* Formulario de adocao */
          <Reveal>
            <section style={{ padding: '44px 40px 70px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 620 }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <span style={{ display: 'inline-block', background: '#fff', color: '#9E182B', fontWeight: 800, fontSize: 12, letterSpacing: '1.5px', padding: '7px 16px', borderRadius: 30, marginBottom: 14 }}>FORMULÁRIO DE ADOÇÃO</span>
                  <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 40, lineHeight: 1, color: '#16313b', margin: '0 0 10px' }}>
                    {selectedPet ? <>Quero adotar a(o) {selectedPet}</> : 'Quero adotar um amigo'}
                  </h1>
                  <p style={{ fontSize: 16, color: '#8a7a7a', margin: 0 }}>Conte um pouquinho sobre você. É rápido! </p>
                </div>

                <form onSubmit={submit} style={{ background: '#fff', borderRadius: 26, padding: '30px 32px', boxShadow: '0 12px 32px rgba(0,0,0,.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 18px' }}>

                    {error && (
                      <div style={{ gridColumn: '1 / -1', background: '#fce4e4', border: '1.5px solid #f1b0b0', color: '#c0392b', padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
                        ⚠️ {error}
                      </div>
                    )}

                    {!pet && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Selecione o animalzinho que deseja adotar</label>
                        {loadingPets ? (
                          <div style={{ fontSize: 14, color: '#666', fontStyle: 'italic' }}>Carregando animais disponíveis...</div>
                        ) : availablePets.length === 0 ? (
                          <div style={{ fontSize: 14, color: '#c0392b', fontWeight: 600 }}>Nenhum animalzinho disponível no momento.</div>
                        ) : (
                          <select required value={selectedPet} onChange={e => setSelectedPet(e.target.value)} style={fld}>
                            {availablePets.map(p => (
                              <option key={p.id_animal_adocao} value={p.nome}>
                                {p.nome} ({p.raca || 'Sem raça definida'} - {p.faixa_etaria})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Nome completo</label>
                      <input required type="text" placeholder="Seu nome" value={nomeSolicitante} onChange={e => setNomeSolicitante(e.target.value)} style={fld} />
                    </div>
                    <div>
                      <label style={labelStyle}>Telefone</label>
                      <input required type="tel" placeholder="(00) 00000-0000" value={telefone} onChange={e => setTelefone(e.target.value)} style={fld} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input required type="email" placeholder="voce@email.com" value={email} onChange={e => setEmail(e.target.value)} style={fld} />
                    </div>
                    <div>
                      <label style={labelStyle}>Idade</label>
                      <input required type="number" placeholder="Ex: 28" value={idade} onChange={e => setIdade(e.target.value)} style={fld} />
                    </div>
                    <div>
                      <label style={labelStyle}>Tipo de moradia</label>
                      <select value={tipoMoradia} onChange={e => setTipoMoradia(e.target.value)} style={fld}>
                        <option>Casa com quintal</option>
                        <option>Casa sem quintal</option>
                        <option>Apartamento com tela</option>
                        <option>Apartamento sem tela</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Já teve outros pets? Conte um pouco.</label>
                      <textarea rows={4} placeholder="Fale sobre sua experiência e por que quer adotar..." value={experiencia} onChange={e => setExperiencia(e.target.value)} style={{ ...fld, height: 'auto', padding: '12px 14px', resize: 'vertical' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <input required type="checkbox" id="termo" checked={termo} onChange={e => setTermo(e.target.checked)} style={{ marginTop: 3 }} />
                      <label htmlFor="termo" style={{ fontSize: 13.5, color: '#7a6a6a', lineHeight: 1.5 }}>Declaro que as informações são verdadeiras e que oferecerei um lar responsável e cheio de amor!!</label>
                    </div>
                  </div>
                  <button type="submit" style={{ width: '100%', height: 50, marginTop: 22, border: 'none', borderRadius: 14, background: '#9E182B', color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, cursor: 'pointer', boxShadow: '0 10px 24px rgba(158,24,43,.3)' }}>Enviar pedido de adoção</button>
                </form>
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
              <Link to="/adocao" style={footLink}>Adoção</Link>
              <Link to="/Produtos" style={footLink}>Produtos</Link>
            </nav>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default Adotar