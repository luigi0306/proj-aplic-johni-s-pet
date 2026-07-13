import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import StaffOwlIcon from '../components/StaffOwlIcon.jsx'
const navy = '#16313b', yellow = '#F6B500'
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }


const CAT_PHOTOS = ['home1.jpg', 'home2.jpg', 'home3.jpg', 'home4.jpg', 'home5.jpg', 'home6.jpg', 'home7.jpg', 'home8.jpg', 'home9.jpg', 'home11.jpg']
const CREATE_PHOTOS = ['pethome.jpg', 'pethome1.jpg', 'pethome2.jpg']

const SERVICES = [
  { icon: 'cross', title: 'Veterinária', to: '/veterinaria', body: 'No Chew!, acreditamos que o cuidado veterinário vai muito além do atendimento — começa no olhar atento, na escuta cuidadosa e no compromisso genuíno com o bem-estar de cada pet.' },
  { icon: 'scissors', title: 'Tosagens específicas para cada raça', to: '/tosa-banho', body: 'No Chew!, o banho e a tosa são feitos com carinho, cuidado e atenção a cada detalhe para o conforto do seu pet. Mais higiene, beleza e bem-estar num momento pensado para ele.' },
  { icon: 'tag', title: 'Produtos', to: '/produtos', body: 'Produtos selecionados a dedo para o cuidado completo, bem-estar e carinho do seu pet. Tudo o que ele precisa para uma vida mais saudável, com qualidade e amor em cada detalhe.' },
]
const TESTIMONIALS = [
  { img: 'clientes.jpg', text: 'Desde que conheci a Chew!, o cuidado com o meu pet mudou completamente. Atendimento atencioso, Produtos de confiança e uma equipe que realmente ama o que faz.' },
  { img: 'clientes2.jpg', text: 'A tosa e o banho são sempre impecáveis e o meu gatinho volta para casa calmo e cheiroso. Dá pra sentir o carinho em cada detalhe do atendimento.' },
  { img: 'clientes3.jpg', text: 'Recomendo de olhos fechados! O agendamento é fácil, o espaço é limpinho e o meu cãozinho ama ir lá. Virei cliente fiel da Chew!.' },
]

function isLogged() { try { return localStorage.getItem('chew_logged_in') === '1' } catch { return false } }
function getUser() { try { return localStorage.getItem('chew_user') || '' } catch { return '' } }

function Home() {
  const catRef = useRef(null)
  const rafRef = useRef(null)
  const [svc, setSvc] = useState(0)
  const [create, setCreate] = useState(0)
  const [testi, setTesti] = useState(0)
  const [logged, setLogged] = useState(isLogged())
  const [svcMenu, setSvcMenu] = useState(false)

  useEffect(() => {
    const el = catRef.current
    if (!el) return
    let down = false, startX = 0, sl = 0, hovering = false
    const onDown = (e) => { down = true; startX = e.clientX; sl = el.scrollLeft; el.style.cursor = 'grabbing'; try { el.setPointerCapture(e.pointerId) } catch {} }
    const onMove = (e) => { if (!down) return; el.scrollLeft = sl - (e.clientX - startX) }
    const onUp = () => { down = false; el.style.cursor = 'grab' }
    const onLeave = () => { onUp(); hovering = false }
    const onEnter = () => { hovering = true }
    el.addEventListener('pointerdown', onDown); el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp); el.addEventListener('pointerleave', onLeave); el.addEventListener('pointerenter', onEnter)
    const tick = () => {
      if (!down && !hovering) {
        el.scrollLeft += 0.6
        const half = el.scrollWidth / 2
        if (el.scrollLeft >= half) el.scrollLeft -= half
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  function logout() { try { localStorage.removeItem('chew_logged_in'); localStorage.removeItem('chew_user'); localStorage.removeItem('chew_token'); localStorage.removeItem('chew_cliente') } catch {}; setLogged(false) }

  const circles = [...CAT_PHOTOS, ...CAT_PHOTOS]
  const icons = {
    cross: <svg width="26" height="26" viewBox="0 0 24 24"><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" fill="#16313b" /></svg>,
    scissors: <svg width="26" height="26" viewBox="0 0 24 24"><circle cx="6" cy="17" r="3" fill="none" stroke="#16313b" strokeWidth="2" /><circle cx="6" cy="7" r="3" fill="none" stroke="#16313b" strokeWidth="2" /><line x1="8.5" y1="8.5" x2="20" y2="18" stroke="#16313b" strokeWidth="2" strokeLinecap="round" /><line x1="8.5" y1="15.5" x2="20" y2="6" stroke="#16313b" strokeWidth="2" strokeLinecap="round" /></svg>,
    tag: <svg width="26" height="26" viewBox="0 0 24 24"><path d="M3 12 L12 3 H21 V12 L12 21 Z" fill="none" stroke="#16313b" strokeWidth="2" strokeLinejoin="round" /><circle cx="16.5" cy="7.5" r="1.6" fill="#16313b" /></svg>,
  }

  return (
    <div style={{ background: '#ECEAE4', minHeight: '100vh', display: 'flex', padding: '22px 0 0', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: '100%', background: '#ECEAE4', overflow: 'hidden' }}>


        <section style={{ position: 'relative', borderRadius: '6px 6px 0 0', overflow: 'hidden' }}>
          <img src="/imagens/fundo1.png" alt="" style={{ width: '100%', height: 620, objectFit: 'cover', display: 'block' }} />

          <header style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '26px 40px' }}>
            <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, color: '#16313b', letterSpacing: '.5px', textDecoration: 'none', textShadow: '0 1px 0 rgba(255,255,255,.35)' }}>CHEW!!</Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={() => setSvcMenu(true)} onMouseLeave={() => setSvcMenu(false)}>
                <Link to="/servicos" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(22,49,59,.55)', textShadow: '0 1px 3px rgba(0,0,0,.45)' }}>Serviços</Link>
                {svcMenu && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 12, zIndex: 50, minWidth: 200 }}>
                    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 14px 34px rgba(0,0,0,.18)', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Link to="/veterinaria" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b', textDecoration: 'none', padding: '10px 14px', borderRadius: 12 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1B888D' }}></span>Veterinária</Link>
                      <Link to="/tosa-banho" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b', textDecoration: 'none', padding: '10px 14px', borderRadius: 12 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7FB9E6' }}></span>Tosa e Banho</Link>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/adocao" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(232,83,14,.85)', textShadow: '0 1px 3px rgba(0,0,0,.35)' }}>Adoção</Link>
              <Link to="/produtos" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#16313b', textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(246,181,0,.92)', textShadow: '0 1px 2px rgba(255,255,255,.35)' }}>Produtos</Link>
              {!logged && <Link to="/login?mode=signup" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(27,136,141,.9)', textShadow: '0 1px 3px rgba(0,0,0,.3)' }}>Cadastro</Link>}
              {logged
                ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.4)', borderRadius: 30, padding: '5px 5px 5px 16px' }}><span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b' }}>Olá, {getUser()}</span><Link to="/meus-pets" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 13, color: '#fff', background: '#1B888D', borderRadius: 30, padding: '7px 15px', textDecoration: 'none' }}>Meus Pets</Link><a onClick={logout} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 13, color: '#fff', background: '#16313b', borderRadius: 30, padding: '7px 15px', textDecoration: 'none', cursor: 'pointer' }}>Sair</a></div>
                : <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', border: '2px solid #16313b', borderRadius: 30, padding: '9px 24px', background: 'rgba(255,255,255,.25)' }}>Entre</Link>}
              <Link
                to="/funcionario/login"
                title="Área da equipe"
                style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,.25)' }}
              >
                <StaffOwlIcon size={52} />
              </Link>
            </nav>
          </header>

          <div style={{ position: 'absolute', left: 495, top: 408, transform: 'translate(-50%,-50%)' }}>
            <Link to="/sobre" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', background: '#E8530E', textDecoration: 'none', borderRadius: 12, padding: '13px 26px', boxShadow: '0 8px 20px rgba(232,83,14,.35)' }}>Saiba mais!</Link>
          </div>
        </section>

        {/* categorias fake */}
        <section style={{ position: 'relative', background: '#E8530E', padding: '34px 40px 40px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, paddingLeft: 34 }}>
              <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 30, color: '#fff', lineHeight: 1 }}>Categorias que atendemos! </span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: '#fbd2bb', letterSpacing: '.5px' }}>escolha seu bichinho</span>
              <span style={{ width: 46, height: 4, borderRadius: 4, background: '#F6B500', marginTop: 4 }}></span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div ref={catRef} style={{ display: 'flex', alignItems: 'center', gap: 16, overflowX: 'auto', cursor: 'grab', padding: '24px 8px', scrollbarWidth: 'none' }}>
                {circles.map((img, i) => (
                  <Link key={i} to="/produtos" style={{ flex: '0 0 auto', width: 84, height: 84, borderRadius: '50%', overflow: 'hidden', border: '3px solid #fff', cursor: 'pointer', transition: 'transform .28s cubic-bezier(.2,.8,.3,1.4), box-shadow .28s', display: 'block' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.5)'; e.currentTarget.style.boxShadow = '0 12px 26px rgba(0,0,0,.35)'; e.currentTarget.style.zIndex = '5'; e.currentTarget.style.position = 'relative' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <img src={`/imagens/${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* nosso serviço */}
        <Reveal>
          <section style={{ position: 'relative', background: '#ECEAE4', padding: '30px 40px 56px' }}>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 32, color: '#16313b', margin: '0 0 26px', lineHeight: .95 }}>Nosso<br />Serviço</h2>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 22, minHeight: 300 }}>
              {SERVICES.map((s, i) => {
                const active = i === svc
                const cardStyle = active
                  ? { position: 'relative', flex: '1.5', background: yellow, border: 'none', borderRadius: '34px 30px 38px 28px / 28px 38px 30px 34px', boxShadow: '0 18px 40px rgba(0,0,0,.14)', padding: '26px 30px 56px', display: 'flex', flexDirection: 'column', transition: 'all .35s', color: navy, cursor: 'pointer' }
                  : { position: 'relative', flex: '1', background: 'transparent', border: '2px solid #cdc8bb', borderRadius: 26, padding: '26px 26px', display: 'flex', flexDirection: 'column', transition: 'all .35s', color: '#3a3a3a', cursor: 'pointer' }
                return (
                  <div key={i} onClick={() => setSvc(i)} style={cardStyle}>
                    <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#F6B500', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(0,0,0,.12)', marginBottom: 18 }}>{icons[s.icon]}</div>
                    <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 19, margin: '0 0 12px', color: active ? navy : '#2a2a2a', lineHeight: 1.15 }}>{s.title}</h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: '0 0 20px', color: active ? '#33444a' : '#6a6a6a', flex: 1 }}>{s.body}</p>
                    <Link to={s.to} style={active
                      ? { alignSelf: 'flex-start', display: 'inline-block', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff', background: navy, textDecoration: 'none', borderRadius: 10, padding: '11px 28px' }
                      : { alignSelf: 'flex-start', display: 'inline-block', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: navy, background: 'transparent', textDecoration: 'none', border: `2px solid ${navy}`, borderRadius: 30, padding: '9px 26px' }}>Explore</Link>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 30 }}>
              <button onClick={() => setSvc((svc + 2) % 3)} style={{ width: 60, height: 34, borderRadius: 30, background: '#16313b', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}>←</button>
              <button onClick={() => setSvc((svc + 1) % 3)} style={{ width: 60, height: 34, borderRadius: 30, background: '#16313b', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}>→</button>
            </div>
          </section>
        </Reveal>

        {/* carrossel clientes */}
        <Reveal>
          <section style={{ position: 'relative', background: '#1B888D', padding: '48px 44px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, flex: '0 0 290px' }}>
                <div style={{ position: 'relative', width: 290, height: 300 }}>
                  {CREATE_PHOTOS.map((img, i) => (
                    <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '30px 36px 30px 40px / 36px 30px 40px 30px', overflow: 'hidden', border: '5px solid #fff', opacity: i === create ? 1 : 0, transition: 'opacity .5s', zIndex: i === create ? 2 : 1 }}>
                      <img src={`/imagens/${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {CREATE_PHOTOS.map((_, i) => <div key={i} style={{ width: i === create ? 22 : 9, height: 9, borderRadius: 9, background: i === create ? '#fff' : 'rgba(255,255,255,.5)', transition: 'all .3s' }}></div>)}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setCreate((create + 2) % 3)} style={{ width: 52, height: 30, borderRadius: 30, background: '#123542', border: 'none', color: '#fff', cursor: 'pointer' }}>←</button>
                  <button onClick={() => setCreate((create + 1) % 3)} style={{ width: 52, height: 30, borderRadius: 30, background: '#123542', border: 'none', color: '#fff', cursor: 'pointer' }}>→</button>
                </div>
              </div>
              <div style={{ flex: 1, color: '#fff' }}>
                <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 34, lineHeight: 1.1, margin: '0 0 16px', maxWidth: 520 }}>Tornar a criação de pets mais fácil para todos.</h2>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: '#d9efef', maxWidth: 500, margin: '0 0 18px' }}>Com rações de alta qualidade, seu pet recebe nutrição completa para crescer saudável e feliz. Nossos Produtos são selecionados com cuidado para garantir segurança, conforto e bem-estar em cada detalhe.</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {['Adoção', 'Ração Premium', 'Serviços'].map((t) => <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 11, fontWeight: 600, fontSize: 15 }}><span style={{ width: 11, height: 11, borderRadius: '50%', border: '3px solid #123542', display: 'inline-block' }}></span>{t}</li>)}
                </ul>
                <Link to="/produtos" style={{ display: 'inline-block', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', background: '#123542', textDecoration: 'none', borderRadius: 11, padding: '12px 30px' }}>Explore</Link>
              </div>
            </div>
          </section>
        </Reveal>

        {/* satisfação cliente carrossel */}
        <Reveal>
          <section style={{ position: 'relative', background: '#ECEAE4', padding: '30px 44px 50px' }}>
            <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
              <div style={{ position: 'relative', flex: '0 0 260px', marginTop: -70 }}>
                <div style={{ position: 'relative', borderRadius: '24px 30px 26px 30px / 30px 24px 30px 26px', overflow: 'hidden', border: '5px solid #1B888D', height: 280 }}>
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === testi ? 1 : 0, transition: 'opacity .5s' }}>
                      <img src={`/imagens/${t.img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
                <div style={{ position: 'absolute', right: -16, top: -26, width: 54, height: 54, borderRadius: '50%', background: '#E8530E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Fredoka'", fontSize: 30, fontWeight: 700, boxShadow: '0 6px 16px rgba(0,0,0,.2)' }}>”</div>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 30, color: '#123542', margin: '6px 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>Satisfação dos nossos Clientes <span style={{ color: '#123542', fontSize: 20 }}>◆</span></h2>
                <div style={{ position: 'relative', background: '#F3E8C6', borderRadius: '18px 22px 18px 26px / 22px 18px 26px 18px', padding: '22px 26px', maxWidth: 560, boxShadow: '0 6px 18px rgba(0,0,0,.06)' }}>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: '#3a3a3a', margin: 0 }}>{TESTIMONIALS[testi].text}</p>
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 24 }}>
                  <button onClick={() => setTesti((testi + 2) % 3)} style={{ width: 58, height: 32, borderRadius: 30, background: '#123542', border: 'none', color: '#fff', cursor: 'pointer' }}>←</button>
                  <button onClick={() => setTesti((testi + 1) % 3)} style={{ width: 58, height: 32, borderRadius: 30, background: '#123542', border: 'none', color: '#fff', cursor: 'pointer' }}>→</button>
                </div>
              </div>
            </div>
          </section>
        </Reveal>


        <Reveal>
          <section style={{ display: 'flex', minHeight: 200 }}>
            <div style={{ position: 'relative', flex: '0 0 42%', background: '#F6B500', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: 150, height: 170, borderRadius: 14, overflow: 'hidden', zIndex: 2 }}><img src="/imagens/petupdate.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
            </div>
            <div style={{ position: 'relative', flex: 1, background: '#E8530E', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 50px' }}>
              <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 30, color: '#fff', margin: '0 0 26px', maxWidth: 340 }}>Se cadastre e receba Pet Update</h2>
              <label style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Email:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360, borderBottom: '2px solid #fff', paddingBottom: 6 }}>
                <input type="email" placeholder="" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 15 }} />
                <span style={{ color: '#fff', fontSize: 20 }}>→</span>
              </div>
            </div>
          </section>
        </Reveal>

        {/* RODAPÉ */}
        <footer style={{ position: 'relative', background: '#123542', padding: '40px 44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/funcionario/login" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7a8a8d', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              <StaffOwlIcon size={32} />
              Área da equipe
            </Link>
            <nav style={{ display: 'flex', gap: 30 }}>
              <Link to="/sobre" style={footLink}>Sobre</Link>
              <Link to="/servicos" style={footLink}>Serviços</Link>
              <Link to="/adocao" style={footLink}>Adoção</Link>
              <Link to="/produtos" style={footLink}>Produtos</Link>
            </nav>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default Home