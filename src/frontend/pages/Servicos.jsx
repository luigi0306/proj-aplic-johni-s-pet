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

// card que aparece com fade + zoom quando entra na tela durante o scroll
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
  textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(255,255,255,.45)',
}
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }
const money = (n) => 'R$ ' + n.toFixed(0)


const SERVICES = [
  {
    id: 'svc:banho', title: 'Banho & Tosa', price: 45, priceColor: '#1B6FB0', color: '#7FB9E6',
    img: '/imagens/tosaebanho.jpg', reverse: false,
    desc: 'Banho relaxante com Produtos hipoalergênicos, secagem completa e tosa específica para cada raça. Seu pet sai limpinho, cheiroso e cheio de estilo.',
    bullets: ['Shampoo premium', 'Hidratação dos pelos', 'Tosa higiênica e de raça', 'Limpeza de ouvidos'],
  },
  {
    id: 'svc:color', title: 'Coloração de Pelos', price: 60, priceColor: '#9166B8', color: '#D6BEEA',
    img: '/imagens/color.jpg', reverse: true,
    desc: 'Coloração pet-safe, atóxica e temporária para deixar seu bichinho ainda mais estiloso e único. Cores vibrantes aplicadas com todo cuidado.',
    bullets: ['Tintas 100% atóxicas', 'Cores vibrantes', 'Aplicação profissional', 'Dura semanas'],
  },
  {
    id: 'svc:unhas', title: 'Corte de Unhas', price: 20, priceColor: '#8a7a1e', color: '#F4D77A',
    img: '/imagens/tosa.jpg', reverse: false,
    desc: 'Corte preciso e indolor, com lixamento e atenção especial às almofadinhas. Um momento tranquilo, sem estresse, para manter as patinhas saudáveis.',
    bullets: ['Corte seguro', 'Lixamento das pontas', 'Sem estresse', 'Checagem das patas'],
  },
]


function loadCart() { try { return JSON.parse(localStorage.getItem('chew_cart') || '{}') } catch { return {} } }
function saveCart(c) { try { localStorage.setItem('chew_cart', JSON.stringify(c)) } catch {} }
function isLogged() { try { return localStorage.getItem('chew_logged_in') === '1' } catch { return false } }
function doLogout() { try { localStorage.removeItem('chew_logged_in') } catch {} }

function Servicos() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(loadCart())
  const [cartOpen, setCartOpen] = useState(false)
  const [svcMenu, setSvcMenu] = useState(false)
  const [logged, setLogged] = useState(isLogged())
  const parallaxOffset = useParallax(0.35)

  function add(s) {
    if (!isLogged()) { navigate('/login'); return }
    const c = loadCart()
    const e = c[s.id] || { name: s.title, price: s.price, color: s.color, qty: 0 }
    e.qty++
    c[s.id] = e
    saveCart(c); setCart({ ...c }); setCartOpen(true)
  }
  function inc(id) { const c = loadCart(); if (c[id]) { c[id].qty++; saveCart(c); setCart({ ...c }) } }
  function dec(id) { const c = loadCart(); if (c[id]) { c[id].qty--; if (c[id].qty <= 0) delete c[id]; saveCart(c); setCart({ ...c }) } }
  function handleLogout() { doLogout(); setLogged(false) }

  const ids = Object.keys(cart)
  const count = ids.reduce((a, id) => a + cart[id].qty, 0)
  const total = ids.reduce((a, id) => a + cart[id].qty * cart[id].price, 0)

  return (
    <div style={{ background: '#ECEAE4', minHeight: '100vh', display: 'flex', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        .chew-header-nav { flex-wrap: wrap; justify-content: flex-end; }
        .chew-hero-servicos { flex-wrap: wrap; }
        .chew-hero-servicos > div:first-child { min-width: 280px; }
        .chew-service-row { flex-wrap: wrap; }
        .chew-service-row > div:first-child { min-width: 300px; }
        .chew-service-row > div:last-child { min-width: 280px; }
        @media (max-width: 980px) {
          .chew-header-nav { gap: 8px; }
          .chew-hero-servicos { padding: 40px 32px !important; }
        }
      `}</style>
      <div style={{ width: '100%', background: '#ECEAE4', position: 'relative' }}>

        {/* CABEÇALHO! */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: '#FFB68C', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(232,131,70,.22)', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, textDecoration: 'none', letterSpacing: '.5px', color: '#16313b' }}>CHEW!!</Link>
          <nav className="chew-header-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={() => setSvcMenu(true)} onMouseLeave={() => setSvcMenu(false)}>
              <Link to="/servicos" style={{ ...navStyle, color: '#fff', background: '#16313b' }}>Serviços</Link>
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
            <Link to="/Produtos" style={navStyle}>Produtos</Link>
            {!logged && <Link to="/login" style={navStyle}>Cadastro</Link>}
            {!logged && (
              <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px' }}>Entre</Link>
            )}
            {logged && (
              <button onClick={handleLogout} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', background: 'transparent', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px', cursor: 'pointer' }}>Sair</button>
            )}
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', width: 46, height: 46, borderRadius: '50%', border: 'none', background: '#16313b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6" /></svg>
              {count > 0 && <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, padding: '0 5px', borderRadius: 20, background: '#E8530E', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFB68C' }}>{count}</span>}
            </button>
          </nav>
        </header>


        <Reveal>
          <section className="chew-hero-servicos" style={{ margin: '8px 24px 0', borderRadius: 34, overflow: 'hidden', background: 'linear-gradient(135deg,#7FB9E6 0%,#A7CFEE 100%)', padding: '54px 56px', display: 'flex', alignItems: 'center', gap: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-block', background: '#fff', color: '#1B6FB0', fontWeight: 800, fontSize: 13, letterSpacing: '1px', padding: '7px 16px', borderRadius: 30, marginBottom: 18 }}>CHEW! SPA & CUIDADOS</div>
              <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 52, lineHeight: 1.02, color: '#16313b', margin: '0 0 14px' }}>Nossos Serviços</h1>
              <p style={{ fontSize: 17, lineHeight: 1.55, color: '#1d3b4d', maxWidth: 440, margin: '0 0 26px' }}>Cuidado completo da cabeça à patinha. Banho, tosa, coloração e muito carinho!! tudo feito por profissionais que amam o que fazem.</p>
              <a href="#servicos" style={{ display: 'inline-block', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', background: '#E8530E', textDecoration: 'none', borderRadius: 14, padding: '14px 32px', boxShadow: '0 10px 22px rgba(232,83,14,.35)' }}>Ver serviços</a>
            </div>
            <div style={{ flex: '0 0 330px', height: 300, borderRadius: 26, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 18px 40px rgba(0,0,0,.18)', transform: `translateY(${-parallaxOffset}px)` }}>
              <img src="/imagens/nossoser.jpg" alt="Nossos Serviços" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </section>
        </Reveal>


        <Reveal>
          <section id="servicos" style={{ textAlign: 'center', padding: '48px 40px 8px' }}>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 34, color: '#16313b', margin: '0 0 10px' }}>O que oferecemos</h2>
            <p style={{ fontSize: 16, color: '#6a6a6a', maxWidth: 520, margin: '0 auto' }}>Escolha os serviços, adicione ao carrinho e agende tudo de uma vez.</p>
          </section>
        </Reveal>


        {SERVICES.map((s, i) => (
          <Reveal key={s.id}>
            <FadeZoomCard delay={i * 100}>
              <section className="chew-service-row" style={{ display: 'flex', alignItems: 'center', gap: 44, padding: '40px 48px', flexDirection: s.reverse ? 'row-reverse' : 'row' }}>
                <div style={{ flex: '0 0 420px' }}>
                  <div style={{ height: 330, borderRadius: 30, overflow: 'hidden', border: `6px solid ${s.color}` }}>
                    <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 30, color: '#16313b', margin: '0 0 12px' }}>
                    <Link to="/tosa-banho" style={{ color: '#16313b', textDecoration: 'none' }}>{s.title}</Link>
                  </h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#555', maxWidth: 480, margin: '0 0 18px' }}>{s.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 18px' }}>
                    {s.bullets.map((b, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 600, fontSize: 14, color: '#3a3a3a' }}>
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: s.color }}></span>{b}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b' }}>a partir de <span style={{ fontSize: 24, color: s.priceColor }}>{money(s.price)}</span></span>
                    <button onClick={() => add(s)} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff', background: '#16313b', border: 'none', cursor: 'pointer', borderRadius: 11, padding: '12px 26px' }}>+ Adicionar</button>
                  </div>
                </div>
              </section>
            </FadeZoomCard>
          </Reveal>
        ))}

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

        {/* carrinho lateral */}
        {cartOpen && (
          <>
            <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(22,49,59,.45)', zIndex: 40 }}></div>
            <aside style={{ position: 'fixed', top: 0, right: 0, width: 380, maxWidth: '90vw', height: '100%', background: '#fff', zIndex: 41, boxShadow: '-12px 0 40px rgba(0,0,0,.2)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', background: '#FFB68C' }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 22, color: '#16313b' }}>Seu carrinho</span>
                <button onClick={() => setCartOpen(false)} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 18, color: '#16313b' }}>✕</button>
              </div>
              {count > 0 ? (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {ids.map((id) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 18, background: '#F7F5F0' }}>
                        <span style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: cart[id].color || '#eee' }}></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b' }}>{cart[id].name}</div>
                          <div style={{ fontSize: 13, color: '#888' }}>{money(cart[id].price)} cada</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => dec(id)} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#e7e3da', cursor: 'pointer', fontSize: 16 }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: 18, textAlign: 'center' }}>{cart[id].qty}</span>
                          <button onClick={() => inc(id)} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#e7e3da', cursor: 'pointer', fontSize: 16 }}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '20px 24px', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b' }}>Total</span>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26, color: '#E8530E' }}>{money(total)}</span>
                    </div>
                    <Link to="/carrinho" style={{ display: 'block', textAlign: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', background: '#16313b', textDecoration: 'none', borderRadius: 14, padding: 15 }}>Ir para o carrinho</Link>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 40, textAlign: 'center' }}>
                  <p style={{ fontSize: 15, color: '#999', margin: 0 }}>Seu carrinho está vazio.<br />Adicione um serviço para começar.</p>
                </div>
              )}
            </aside>
          </>
        )}

      </div>
    </div>
  )
}

export default Servicos