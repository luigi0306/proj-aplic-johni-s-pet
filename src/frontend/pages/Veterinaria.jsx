import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'

function useParallax(speed) {
  const [offset, setOffset] = useState(0)
  useEffect(function () {
    function onScroll() {
      setOffset(window.scrollY * speed)
    }
    window.addEventListener('scroll', onScroll)
    return function () {
      window.removeEventListener('scroll', onScroll)
    }
  }, [speed])
  return offset
}

function FadeZoomCard({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(function () {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return function () {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.92)',
        transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const navStyle = {
  fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b',
  textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(255,255,255,.6)',
}
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }
const money = (n) => 'R$ ' + n.toFixed(0)
const icon = (svg) => <span style={{ display: 'inline-flex' }} dangerouslySetInnerHTML={{ __html: svg }} />

const HIGHLIGHTS = [
  { id: 'vet:cons', title: 'Consultas', price: 120, bg: '#B8E8EE',
    svg: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0E8C9E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M5 3H3M15 3h2M10 19a4 4 0 0 0 8 0v-2"/><circle cx="18" cy="15" r="2"/></svg>',
    desc: 'Avaliação completa com veterinários especializados, diagnóstico cuidadoso e um plano de saúde feito sob medida para o seu pet.',
    bullets: ['Atendimento humanizado', 'Histórico digital do pet', 'Retorno incluso'], color: '#B8E8EE' },
  { id: 'vet:vac', title: 'Vacinas', price: 80, bg: '#E7EDD3',
    svg: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22A06B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2l4 4M17 7l-9 9-4 1 1-4 9-9zM14 6l4 4M9 11l2 2"/></svg>',
    desc: 'Calendário vacinal completo para todas as espécies, com vacinas importadas e lembretes automáticos de reforço.',
    bullets: ['Vacinas importadas', 'Carteirinha digital', 'Lembrete de reforço'], color: '#E7EDD3' },
]

const FAQS = [
  { q: 'Preciso agendar ou posso chegar sem marcar?', a: 'Recomendamos agendar pela nossa agenda online para evitar espera. Emergências são atendidas a qualquer hora.' },
  { q: 'Vocês atendem animais silvestres e exóticos?', a: 'Sim! Temos veterinários especializados em aves, répteis, roedores e outros pets exóticos.' },
  { q: 'Como funciona o plano Petlove aqui?', a: 'Basta apresentar sua carteirinha na recepção. Consultas, vacinas e exames têm cobertura ou desconto.' },
  { q: 'Vocês fazem atendimento domiciliar?', a: 'Sim, para alguns serviços. Entre em contato pelo telefone para verificar disponibilidade na sua região.' },
]

function loadCart() { try { return JSON.parse(localStorage.getItem('chew_cart') || '{}') } catch { return {} } }
function saveCart(c) { try { localStorage.setItem('chew_cart', JSON.stringify(c)) } catch {} }
function isLogged() { try { return localStorage.getItem('chew_logged_in') === '1' } catch { return false } }
function doLogout() { try { localStorage.removeItem('chew_logged_in') } catch {} }

function Veterinaria() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(loadCart())
  const [cartOpen, setCartOpen] = useState(false)
  const [svcMenu, setSvcMenu] = useState(false)
  const [logged, setLogged] = useState(isLogged())
  const parallaxOffset = useParallax(0.35)
  const parallaxOffset2 = useParallax(0.2)

  function add(h) {
    if (!isLogged()) { navigate('/login'); return }
    const c = loadCart()
    const e = c[h.id] || { name: h.title, price: h.price, color: h.color, qty: 0 }
    e.qty++; c[h.id] = e
    saveCart(c); setCart({ ...c }); setCartOpen(true)
  }
  function inc(id) { const c = loadCart(); if (c[id]) { c[id].qty++; saveCart(c); setCart({ ...c }) } }
  function dec(id) { const c = loadCart(); if (c[id]) { c[id].qty--; if (c[id].qty <= 0) delete c[id]; saveCart(c); setCart({ ...c }) } }
  function handleLogout() { doLogout(); setLogged(false) }

  const ids = Object.keys(cart)
  const count = ids.reduce((a, id) => a + cart[id].qty, 0)
  const total = ids.reduce((a, id) => a + cart[id].qty * cart[id].price, 0)

  return (
    <div style={{ background: '#F2FAFB', minHeight: '100vh', display: 'flex', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        .chew-vet-header-nav { flex-wrap: wrap; justify-content: flex-end; }
        .chew-vet-hero { flex-wrap: wrap; }
        .chew-vet-hero > div:first-child { min-width: 280px; }
        .chew-vet-highlights { flex-wrap: wrap; }
        .chew-vet-highlights > div { min-width: 280px; }
        .chew-vet-petlove { flex-wrap: wrap; }
        .chew-vet-consulta { flex-wrap: wrap; }
        .chew-vet-consulta > div:first-child { min-width: 280px; }
        .chew-vet-consulta > div:last-child { min-width: 280px; }
        .chew-vet-horario-contato { flex-wrap: wrap; }
        .chew-vet-faq { grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px) {
          .chew-vet-faq { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ width: '100%', background: '#F2FAFB', position: 'relative' }}>

        {/* CABEÇALHO */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: '#B8E8EE', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(120,190,200,.3)', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, textDecoration: 'none', letterSpacing: '.5px', color: '#16313b' }}>CHEW!!</Link>
          <nav className="chew-vet-header-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={() => setSvcMenu(true)} onMouseLeave={() => setSvcMenu(false)}>
              <Link to="/servicos" style={navStyle}>Serviços</Link>
              {svcMenu && (
                <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 12, zIndex: 50, minWidth: 200 }}>
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 14px 34px rgba(0,0,0,.18)', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Link to="/veterinaria" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b', textDecoration: 'none', padding: '10px 14px', borderRadius: 12 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1B888D' }}></span>Veterinária</Link>
                    <Link to="/tosa-banho" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b', textDecoration: 'none', padding: '10px 14px', borderRadius: 12 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7FB9E6' }}></span>Tosa e Banho</Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/adocao" style={navStyle}>Adoção</Link>
            <Link to="/produtos" style={navStyle}>Produtos</Link>
            {!logged && <Link to="/login" style={navStyle}>Cadastro</Link>}
            {!logged && (
              <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px' }}>Entre</Link>
            )}
            {logged && (
              <button onClick={handleLogout} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', background: 'transparent', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px', cursor: 'pointer' }}>Sair</button>
            )}
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', width: 46, height: 46, borderRadius: '50%', border: 'none', background: '#16313b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6" /></svg>
              {count > 0 && <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, padding: '0 5px', borderRadius: 20, background: '#E8530E', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #B8E8EE' }}>{count}</span>}
            </button>
          </nav>
        </header>


        <Reveal>
          <section className="chew-vet-hero" style={{ margin: '8px 24px 0', borderRadius: 34, overflow: 'hidden', background: 'linear-gradient(135deg,#D7F2F5 0%,#B8E8EE 100%)', padding: '50px 56px', display: 'flex', alignItems: 'center', gap: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0E8C9E', fontWeight: 800, fontSize: 13, letterSpacing: '1px', padding: '7px 16px', borderRadius: 30, marginBottom: 18 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C36B' }}></span> ATENDIMENTO 24H
              </div>
              <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 54, lineHeight: 1, color: '#16313b', margin: '0 0 14px' }}>Clínica Veterinária<br />que cuida com amor</h1>
              <p style={{ fontSize: 17, lineHeight: 1.55, color: '#2c4a52', maxWidth: 450, margin: '0 0 26px' }}>Saúde completa para <strong>todas as espécies</strong>: cães, gatos, aves, répteis, roedores e exóticos.</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/agendar" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', background: '#E8530E', textDecoration: 'none', borderRadius: 14, padding: '14px 32px' }}>Agendar consulta</Link>
                <a href="#destaques" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#0E8C9E', background: '#fff', textDecoration: 'none', borderRadius: 14, padding: '14px 32px' }}>Ver serviços</a>
              </div>
            </div>
            <div style={{ flex: '0 0 310px', height: 280, borderRadius: 26, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 18px 40px rgba(0,0,0,.16)', transform: `translateY(${-parallaxOffset}px)` }}>
              <img src="/imagens/veteprin.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </section>
        </Reveal>

        {/* Vacinas + Consultas */}
        <Reveal>
          <section id="destaques" style={{ padding: '34px 40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 34, color: '#16313b', margin: '0 0 8px' }}>Primordiais!</h2>
              <p style={{ fontSize: 16, color: '#7a8a8d', margin: 0 }}>Os cuidados essenciais para manter seu pet sempre saudável.</p>
            </div>
            <div className="chew-vet-highlights" style={{ display: 'flex', gap: 24 }}>
              {HIGHLIGHTS.map((h, i) => (
                <FadeZoomCard key={h.id} delay={i * 120}>
                  <div style={{ flex: 1, background: h.bg, borderRadius: 28, padding: '34px 32px', display: 'flex', flexDirection: 'column', transition: 'transform .3s cubic-bezier(.2,.8,.3,1.4), box-shadow .3s', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.035) translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,.16)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <span style={{ width: 62, height: 62, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(0,0,0,.12)', marginBottom: 18 }}>{icon(h.svg)}</span>
                    <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 28, color: '#16313b', margin: '0 0 10px' }}>{h.title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.55, color: '#2c4a52', margin: '0 0 18px', maxWidth: 360 }}>{h.desc}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {h.bullets.map((b, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 600, fontSize: 14, color: '#16313b' }}>
                          <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22A06B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
                          </span>{b}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: '#16313b' }}>a partir de <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: 24, color: '#E8530E' }}>{money(h.price)}</span></span>
                      <button onClick={() => add(h)} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff', background: '#16313b', border: 'none', cursor: 'pointer', borderRadius: 12, padding: '12px 26px' }}>Agendar</button>
                    </div>
                  </div>
                </FadeZoomCard>
              ))}
            </div>
          </section>
        </Reveal>

        {/* BANNER PETLOVE */}
        <Reveal>
          <FadeZoomCard>
            <section className="chew-vet-petlove" style={{ margin: '30px 24px', background: 'linear-gradient(120deg,#16313b 0%,#1B5560 100%)', borderRadius: 30, padding: '38px 44px', display: 'flex', alignItems: 'center', gap: 30 }}>
              <div style={{ width: 74, height: 74, borderRadius: 22, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z" fill="#FF5A8A" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <span style={{ display: 'inline-block', background: '#FF5A8A', color: '#fff', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '5px 12px', borderRadius: 30, marginBottom: 10 }}>PARCERIA OFICIAL</span>
                <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 28, color: '#fff', margin: '0 0 6px' }}>Aceitamos o plano de saúde Petlove!</h2>
                <p style={{ fontSize: 15, color: '#cfe9ec', margin: 0, maxWidth: 520 }}>Apresente sua carteirinha e cuide do seu pet pagando menos em consultas, vacinas e exames.</p>
              </div>
              <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', background: '#B8E8EE', textDecoration: 'none', borderRadius: 13, padding: '14px 28px', whiteSpace: 'nowrap' }}>Usar meu plano</Link>
            </section>
          </FadeZoomCard>
        </Reveal>

        {/* FOTO CONSULTA — bem no meio do site */}
        <Reveal>
          <section className="chew-vet-consulta" style={{ margin: '10px 24px 30px', background: '#fff', borderRadius: 30, padding: 14, display: 'flex', alignItems: 'center', gap: 34, overflow: 'hidden' }}>
            <div style={{ flex: '0 0 320px', height: 260, borderRadius: 24, overflow: 'hidden' }}>
              <img src="/imagens/consulta.jpg" alt="Consulta veterinária" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: `translateY(${-parallaxOffset2}px)` }} />
            </div>
            <div style={{ flex: 1, padding: '20px 30px 20px 0' }}>
              <span style={{ display: 'inline-block', background: '#B8E8EE', color: '#0E8C9E', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '5px 12px', borderRadius: 30, marginBottom: 12 }}>NO CONSULTÓRIO</span>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 28, color: '#16313b', margin: '0 0 10px' }}>Cada consulta, com toda atenção que seu pet merece</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#7a8a8d', margin: '0 0 20px', maxWidth: 440 }}>Nossos veterinários dedicam tempo de verdade a cada atendimento, sem pressa, olhando pro seu pet como ele merece: com carinho e atenção total.</p>
              <Link to="/agendar" style={{ display: 'inline-block', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff', background: '#16313b', textDecoration: 'none', borderRadius: 12, padding: '12px 28px' }}>Agendar minha consulta</Link>
            </div>
          </section>
        </Reveal>

        {/* HORÁRIO + CONTATO */}
        <Reveal>
          <section className="chew-vet-horario-contato" style={{ margin: '0 24px 30px', display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            <FadeZoomCard delay={0}>
              <div style={{ flex: 1, minWidth: 280, background: '#16313b', borderRadius: 28, padding: '34px 36px', color: '#fff' }}>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 24, margin: '0 0 18px' }}>Horário de funcionamento</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, borderBottom: '1px solid rgba(255,255,255,.12)', paddingBottom: 10 }}><span style={{ color: '#b9d2d6' }}>Segunda a Sexta</span><span style={{ fontWeight: 700 }}>08h — 20h</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, borderBottom: '1px solid rgba(255,255,255,.12)', paddingBottom: 10 }}><span style={{ color: '#b9d2d6' }}>Sábado</span><span style={{ fontWeight: 700 }}>08h — 16h</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}><span style={{ color: '#b9d2d6' }}>Emergência 24h</span><span style={{ fontWeight: 700, color: '#7FE0C0' }}>Sempre aberto</span></div>
                </div>
              </div>
            </FadeZoomCard>
            <FadeZoomCard delay={120}>
              <div style={{ flex: 1, minWidth: 280, background: '#B8E8EE', borderRadius: 28, padding: '34px 36px' }}>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 24, color: '#16313b', margin: '0 0 18px' }}>Fale com a gente</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontWeight: 700, color: '#16313b' }}>
                  <span>Telefone: (61) 4002-8922</span>
                  <span>Email: contato@chew.pet</span>
                  <span>Endereço: Rua dos Bichinhos, 100 — Brasília</span>
                </div>
                <Link to="/agendar" style={{ display: 'inline-block', marginTop: 20, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff', background: '#E8530E', textDecoration: 'none', borderRadius: 12, padding: '12px 26px' }}>Agendar agora</Link>
              </div>
            </FadeZoomCard>
          </section>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <section style={{ margin: '0 24px 40px', background: '#fff', borderRadius: 30, padding: '44px 48px' }}>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 30, color: '#16313b', margin: '0 0 26px', textAlign: 'center' }}>Perguntas frequentes</h2>
            <div className="chew-vet-faq" style={{ display: 'grid', gap: '18px 28px' }}>
              {FAQS.map((f, i) => (
                <FadeZoomCard key={i} delay={i * 80}>
                  <div style={{ borderLeft: '3px solid #B8E8EE', paddingLeft: 16 }}>
                    <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', margin: '0 0 6px' }}>{f.q}</h4>
                    <p style={{ fontSize: 14, lineHeight: 1.55, color: '#7a8a8d', margin: 0 }}>{f.a}</p>
                  </div>
                </FadeZoomCard>
              ))}
            </div>
          </section>
        </Reveal>

        {/* RODAPÉ */}
        <footer style={{ background: '#123542', padding: '40px 44px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <nav style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
              <Link to="/sobre" style={footLink}>Sobre</Link>
              <Link to="/servicos" style={footLink}>Serviços</Link>
              <Link to="/adocao" style={footLink}>Adoção</Link>
              <Link to="/produtos" style={footLink}>Produtos</Link>
            </nav>
          </div>
        </footer>

        {/* GAVETA DO CARRINHO */}
        {cartOpen && (
          <>
            <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(22,49,59,.45)', zIndex: 40 }}></div>
            <aside style={{ position: 'fixed', top: 0, right: 0, width: 390, maxWidth: '90vw', height: '100%', background: '#fff', zIndex: 41, boxShadow: '-12px 0 40px rgba(0,0,0,.2)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', background: '#B8E8EE' }}>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 22, color: '#16313b' }}>Meus agendamentos</span>
                <button onClick={() => setCartOpen(false)} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 18, color: '#16313b' }}>✕</button>
              </div>
              {count > 0 ? (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {ids.map((id) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, borderRadius: 16, background: '#F2FAFB' }}>
                        <span style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: cart[id].color || '#eee' }}></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: '#16313b' }}>{cart[id].name}</div>
                          <div style={{ fontSize: 13, color: '#E8530E', fontWeight: 700 }}>{money(cart[id].price)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <button onClick={() => dec(id)} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#e2eef0', cursor: 'pointer', fontSize: 16 }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: 18, textAlign: 'center' }}>{cart[id].qty}</span>
                          <button onClick={() => inc(id)} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#e2eef0', cursor: 'pointer', fontSize: 16 }}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '20px 24px', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b' }}>Total</span>
                      <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 26, color: '#E8530E' }}>{money(total)}</span>
                    </div>
                    <Link to="/carrinho" style={{ display: 'block', textAlign: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', background: '#16313b', textDecoration: 'none', borderRadius: 14, padding: 15 }}>Ir para o carrinho</Link>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
                  <p style={{ fontSize: 15, color: '#999', margin: 0 }}>Nenhum agendamento ainda.<br />Escolha um serviço para começar.</p>
                </div>
              )}
            </aside>
          </>
        )}

      </div>
    </div>
  )
}

export default Veterinaria