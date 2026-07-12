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

const navStyle = { fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(255,255,255,.6)' }
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }
const money = (n) => 'R$ ' + n.toFixed(0)

const FEATURES = [
  { title: 'Banho relaxante', desc: 'Água morna e shampoo hipoalergênico para a pele.', bg: '#CDE8F2', fg: '#1B6FB0', p: 'M12 2c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z' },
  { title: 'Secagem suave', desc: 'Secador na temperatura certa, sem sustos.', bg: '#F4C7D9', fg: '#C76B8E', p: 'M4 6h10a4 4 0 1 1 0 8H4zM4 18h7a3 3 0 1 0 0-6' },
  { title: 'Tosa de raça', desc: 'Corte higiênico ou na tesoura, do jeito ideal.', bg: '#E7EDD3', fg: '#7a8a2e', p: 'M8.5 7.5L20 18M8.5 16.5L20 6' },
  { title: 'Perfume & mimo', desc: 'Finalização perfumada e lacinho de brinde.', bg: '#FFF0CC', fg: '#C58A12', p: 'M12 2l2.4 7.4H22l-6 4.3 2.3 7.3L12 16.7 5.7 21l2.3-7.3-6-4.3h7.6z' },
]
const STEPS = [
  { n: '1', title: 'Escovação', desc: 'Removemos nós e pelos soltos com delicadeza.', bg: '#CDE8F2', fg: '#1B6FB0' },
  { n: '2', title: 'Banho', desc: 'Lavagem completa com Produtos premium.', bg: '#F4C7D9', fg: '#C76B8E' },
  { n: '3', title: 'Secagem', desc: 'Secamos e desembaraçamos com cuidado.', bg: '#E7EDD3', fg: '#7a8a2e' },
  { n: '4', title: 'Tosa & finalização', desc: 'Corte caprichado, perfume e muito carinho.', bg: '#FFF0CC', fg: '#C58A12' },
]
const PACKAGES = [
  { id: 'basic', name: 'Banho Essencial', price: 45, color: '#A7D8EC', sub: 'Para um pet sempre limpinho', subColor: '#7a8a8d', popular: false, cardBg: '#fff', dotBg: '#CDE8F2', dotStroke: '#1B6FB0', highlight: false, items: ['Banho com shampoo neutro', 'Secagem completa', 'Limpeza de ouvidos', 'Perfume final'] },
  { id: 'full', name: 'Banho & Tosa Completo', price: 85, color: '#F4C7D9', sub: 'O queridinho da galera', subColor: '#C76B8E', popular: true, cardBg: '#FFF6F9', dotBg: '#F4C7D9', dotStroke: '#C76B8E', highlight: true, items: ['Tudo do Essencial', 'Tosa higiênica ou de raça', 'Corte de unhas', 'Hidratação dos pelos', 'Lacinho ou gravatinha'] },
  { id: 'spa', name: 'Spa Premium', price: 130, color: '#F6B500', sub: 'Experiência completa de spa', subColor: '#7a8a8d', popular: false, cardBg: '#fff', dotBg: '#FFF0CC', dotStroke: '#C58A12', highlight: false, items: ['Tudo do Completo', 'Banho de ozônio', 'Hidratação profunda', 'Escovação dental', 'Massagem relaxante'] },
]

function loadCart() { try { return JSON.parse(localStorage.getItem('chew_cart') || '{}') } catch { return {} } }
function saveCart(c) { try { localStorage.setItem('chew_cart', JSON.stringify(c)) } catch {} }
function isLogged() { try { return localStorage.getItem('chew_logged_in') === '1' } catch { return false } }
function doLogout() { try { localStorage.removeItem('chew_logged_in') } catch {} }

function TosaBanho() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(loadCart())
  const [cartOpen, setCartOpen] = useState(false)
  const [svcMenu, setSvcMenu] = useState(false)
  const [logged, setLogged] = useState(isLogged())
  const parallaxOffset = useParallax(0.35)

  function add(p) {
    if (!isLogged()) { navigate('/login'); return }
    const id = 'tosa:' + p.id
    const c = loadCart()
    const e = c[id] || { name: p.name, price: p.price, color: p.color, qty: 0 }
    e.qty++; c[id] = e
    saveCart(c); setCart({ ...c }); setCartOpen(true)
  }
  function inc(id) { const c = loadCart(); if (c[id]) { c[id].qty++; saveCart(c); setCart({ ...c }) } }
  function dec(id) { const c = loadCart(); if (c[id]) { c[id].qty--; if (c[id].qty <= 0) delete c[id]; saveCart(c); setCart({ ...c }) } }
  function handleLogout() { doLogout(); setLogged(false) }

  const ids = Object.keys(cart)
  const count = ids.reduce((a, id) => a + cart[id].qty, 0)
  const total = ids.reduce((a, id) => a + cart[id].qty * cart[id].price, 0)

  return (
    <div style={{ background: '#F4FAFB', minHeight: '100vh', display: 'flex', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        .chew-tosa-header-nav { flex-wrap: wrap; justify-content: flex-end; }
        .chew-tosa-hero { flex-wrap: wrap; }
        .chew-tosa-hero > div:first-child { min-width: 280px; }
        .chew-tosa-features { grid-template-columns: repeat(4, 1fr); }
        .chew-tosa-steps { flex-wrap: wrap; }
        .chew-tosa-steps > div { min-width: 180px; }
        .chew-tosa-packages { flex-wrap: wrap; }
        .chew-tosa-packages > div { min-width: 260px; }
        @media (max-width: 980px) {
          .chew-tosa-features { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      <div style={{ width: '100%', background: '#F4FAFB', position: 'relative' }}>

        {/* CABEÇALHO */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: '#CDE8F2', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(120,180,210,.28)', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, textDecoration: 'none', letterSpacing: '.5px', color: '#16313b' }}>CHEW!!</Link>
          <nav className="chew-tosa-header-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }} onMouseEnter={() => setSvcMenu(true)} onMouseLeave={() => setSvcMenu(false)}>
              <Link to="/servicos" style={navStyle}>Serviços</Link>
              {svcMenu && (
                <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 12, zIndex: 50, minWidth: 200 }}>
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 14px 34px rgba(0,0,0,.18)', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Link to="/veterinaria" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b', textDecoration: 'none', padding: '10px 14px', borderRadius: 12 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1B888D' }}></span>Veterinária</Link>
                    <Link to="/tosa-banho" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff', textDecoration: 'none', padding: '10px 14px', borderRadius: 12, background: '#16313b' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7FB9E6' }}></span>Tosa e Banho</Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/adocao" style={navStyle}>Adoção</Link>
            <Link to="/Produtos" style={navStyle}>Produtos</Link>
            {logged ? (
              <button onClick={handleLogout} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', background: 'transparent', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px', cursor: 'pointer' }}>Sair</button>
            ) : (
              <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px' }}>Entre</Link>
            )}
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', width: 46, height: 46, borderRadius: '50%', border: 'none', background: '#16313b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6" /></svg>
              {count > 0 && <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, padding: '0 5px', borderRadius: 20, background: '#E8530E', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #CDE8F2' }}>{count}</span>}
            </button>
          </nav>
        </header>


        <Reveal>
          <section className="chew-tosa-hero" style={{ position: 'relative', margin: '8px 24px 0', borderRadius: 34, overflow: 'hidden', background: 'linear-gradient(120deg,#A7D8EC 0%,#C9E5F2 45%,#F4C7D9 100%)', padding: '54px 56px', display: 'flex', alignItems: 'center', gap: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1B6FB0', fontWeight: 800, fontSize: 13, letterSpacing: '1px', padding: '7px 16px', borderRadius: 30, marginBottom: 18 }}>
                <svg width="15" height="15" viewBox="0 0 24 24"><path d="M12 2c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill="#7FB9E6" /></svg>BANHO & TOSA
              </div>
              <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 56, lineHeight: 1, color: '#16313b', margin: '0 0 14px' }}>Limpinho, fofo<br />e cheiroso</h1>
              <p style={{ fontSize: 17, lineHeight: 1.55, color: '#2c4a52', maxWidth: 440, margin: '0 0 26px' }}>Um spa completo para o seu pet: banho relaxante, secagem cuidadosa e tosa feita com carinho por profissionais apaixonados.</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/agendar?servico=tosa" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', background: '#E8530E', textDecoration: 'none', borderRadius: 14, padding: '14px 32px', boxShadow: '0 10px 22px rgba(232,83,14,.3)' }}>Agendar banho</Link>
                <a href="#pacotes" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#1B6FB0', background: '#fff', textDecoration: 'none', borderRadius: 14, padding: '14px 32px' }}>Ver pacotes</a>
              </div>
            </div>
            <div style={{ flex: '0 0 320px', height: 300, borderRadius: 26, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 18px 40px rgba(0,0,0,.16)', transform: `translateY(${-parallaxOffset}px)` }}>
              <img src="/imagens/banhoprinci.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </section>
        </Reveal>

        {/*o que ta incluso */}
        <Reveal>
          <section style={{ padding: '48px 40px 10px' }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 34, color: '#16313b', margin: '0 0 8px' }}>O que está incluso</h2>
              <p style={{ fontSize: 16, color: '#7a8a8d', margin: 0 }}>Cada detalhe pensado para o bem-estar do seu pet.</p>
            </div>
            <div className="chew-tosa-features" style={{ display: 'grid', gap: 20 }}>
              {FEATURES.map((f, i) => (
                <FadeZoomCard key={i} delay={i * 90}>
                  <div style={{ background: '#fff', borderRadius: 22, padding: '26px 22px', boxShadow: '0 8px 22px rgba(0,0,0,.05)', textAlign: 'center' }}>
                    <span style={{ width: 60, height: 60, borderRadius: 18, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={f.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.p} /></svg>
                    </span>
                    <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#16313b', margin: '0 0 6px' }}>{f.title}</h4>
                    <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#7a8a8d', margin: 0 }}>{f.desc}</p>
                  </div>
                </FadeZoomCard>
              ))}
            </div>
          </section>
        </Reveal>

        {/* como funciona */}
        <Reveal>
          <section style={{ margin: '40px 24px', background: '#fff', borderRadius: 30, padding: '44px 48px' }}>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 30, color: '#16313b', margin: '0 0 30px', textAlign: 'center' }}>O passo a passo do spa</h2>
            <div className="chew-tosa-steps" style={{ display: 'flex', gap: 18 }}>
              {STEPS.map((st, i) => (
                <FadeZoomCard key={i} delay={i * 100}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: st.bg, color: st.fg, fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{st.n}</div>
                    <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#16313b', margin: '0 0 6px' }}>{st.title}</h4>
                    <p style={{ fontSize: 13.5, color: '#7a8a8d', maxWidth: 220, margin: '0 auto' }}>{st.desc}</p>
                  </div>
                </FadeZoomCard>
              ))}
            </div>
          </section>
        </Reveal>

        {/* pacotes promoção */}
        <Reveal>
          <section id="pacotes" style={{ padding: '20px 40px 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 34, color: '#16313b', margin: '0 0 8px' }}>Nossos pacotes</h2>
              <p style={{ fontSize: 16, color: '#7a8a8d', margin: 0 }}>Escolha o mimo ideal e adicione ao carrinho.</p>
            </div>
            <div className="chew-tosa-packages" style={{ display: 'flex', gap: 24, alignItems: 'stretch' }}>
              {PACKAGES.map((p, i) => (
                <FadeZoomCard key={p.id} delay={i * 120}>
                  <div style={{ position: 'relative', flex: 1, borderRadius: 26, padding: '30px 28px', display: 'flex', flexDirection: 'column', boxShadow: p.highlight ? '0 22px 44px rgba(196,107,142,.22)' : '0 10px 26px rgba(0,0,0,.07)', background: p.cardBg, border: p.highlight ? '2px solid #F4C7D9' : '2px solid transparent', transform: p.highlight ? 'translateY(-10px)' : 'none' }}>
                    {p.popular && <span style={{ position: 'absolute', top: 16, right: 16, background: '#E8530E', color: '#fff', fontWeight: 800, fontSize: 10, letterSpacing: '.5px', padding: '5px 11px', borderRadius: 30 }}>MAIS PEDIDO</span>}
                    <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 24, color: '#16313b', margin: '0 0 6px' }}>{p.name}</h3>
                    <p style={{ fontSize: 13.5, color: p.subColor, margin: '0 0 16px' }}>{p.sub}</p>
                    <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 38, color: '#E8530E', marginBottom: 16 }}>{money(p.price)}</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                      {p.items.map((it, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 600, fontSize: 14, color: '#3a3a3a' }}>
                          <span style={{ width: 18, height: 18, borderRadius: '50%', background: p.dotBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={p.dotStroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
                          </span>{it}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => add(p)} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff', background: p.highlight ? '#E8530E' : '#16313b', border: 'none', cursor: 'pointer', borderRadius: 12, padding: 13, width: '100%' }}>Adicionar ao carrinho</button>
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
              <Link to="/Produtos" style={footLink}>Produtos</Link>
            </nav>
          </div>
        </footer>


        {cartOpen && (
          <>
            <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(22,49,59,.45)', zIndex: 40 }}></div>
            <aside style={{ position: 'fixed', top: 0, right: 0, width: 390, maxWidth: '90vw', height: '100%', background: '#fff', zIndex: 41, boxShadow: '-12px 0 40px rgba(0,0,0,.2)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', background: '#CDE8F2' }}>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 22, color: '#16313b' }}>Meu carrinho</span>
                <button onClick={() => setCartOpen(false)} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 18, color: '#16313b' }}>✕</button>
              </div>
              {count > 0 ? (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {ids.map((id) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, borderRadius: 16, background: '#F4FAFB' }}>
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
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 40, textAlign: 'center' }}>
                  <img src="/imagens/banhoprinci.jpg" alt="Carrinho vazio" style={{ width: '130px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  <p style={{ fontSize: 15, color: '#999', margin: 0 }}>Seu carrinho está vazio.<br />Escolha um pacote para começar.</p>
                </div>
              )}
            </aside>
          </>
        )}

      </div>
    </div>
  )
}

export default TosaBanho