import { useState } from 'react'
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

  function submit(e) {
    e.preventDefault()
    try {
      // registro que iria pro banco de dados
      const adopters = JSON.parse(localStorage.getItem('chew_adopters') || '[]')
      adopters.push({ pet, ts: Date.now() })
      localStorage.setItem('chew_adopters', JSON.stringify(adopters))
      // marca o bichinho como adotado -> some da lista de adoção
      if (pet) {
        const adopted = JSON.parse(localStorage.getItem('chew_adopted') || '[]')
        if (!adopted.includes(pet)) { adopted.push(pet); localStorage.setItem('chew_adopted', JSON.stringify(adopted)) }
      }
    } catch {}
    setSent(true)
    window.scrollTo(0, 0)
  }

  return (
    <div style={{ background: '#F2AFBC', minHeight: '100vh', display: 'flex', justifyContent: 'center', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 1180, background: '#F2AFBC', position: 'relative' }}>

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
                  {pet ? <>Seu interesse em adotar <strong>{pet}</strong> foi registrado.</> : 'Seu pedido de adoção foi registrado.'}<br />
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
                    {pet ? <>Quero adotar a(o) {pet}</> : 'Quero adotar um amigo'}
                  </h1>
                  <p style={{ fontSize: 16, color: '#8a7a7a', margin: 0 }}>Conte um pouquinho sobre você. É rápido! </p>
                </div>

                <form onSubmit={submit} style={{ background: '#fff', borderRadius: 26, padding: '30px 32px', boxShadow: '0 12px 32px rgba(0,0,0,.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 18px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Nome completo</label>
                      <input required type="text" placeholder="Seu nome" style={fld} />
                    </div>
                    <div>
                      <label style={labelStyle}>Telefone</label>
                      <input required type="tel" placeholder="(00) 00000-0000" style={fld} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input required type="email" placeholder="voce@email.com" style={fld} />
                    </div>
                    <div>
                      <label style={labelStyle}>Idade</label>
                      <input required type="number" placeholder="Ex: 28" style={fld} />
                    </div>
                    <div>
                      <label style={labelStyle}>Tipo de moradia</label>
                      <select style={fld}>
                        <option>Casa com quintal</option>
                        <option>Casa sem quintal</option>
                        <option>Apartamento com tela</option>
                        <option>Apartamento sem tela</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Já teve outros pets? Conte um pouco.</label>
                      <textarea rows={4} placeholder="Fale sobre sua experiência e por que quer adotar..." style={{ ...fld, height: 'auto', padding: '12px 14px', resize: 'vertical' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <input required type="checkbox" id="termo" style={{ marginTop: 3 }} />
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