import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const money = (n) => 'R$ ' + n.toFixed(2).replace('.', ',')
const fld = { width: '100%', height: 46, border: '1.5px solid #e3ddd0', borderRadius: 12, background: '#fff', padding: '0 14px', fontSize: 14, color: '#333', fontFamily: "'Nunito', sans-serif" }
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#4a4a44', marginBottom: 6 }
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }

function loadCart() { try { return JSON.parse(localStorage.getItem('chew_cart') || '{}') } catch { return {} } }
function saveCart(c) { try { localStorage.setItem('chew_cart', JSON.stringify(c)) } catch {} }
function isLogged() { try { return localStorage.getItem('chew_logged_in') === '1' } catch { return false } }
function getUser() { try { return localStorage.getItem('chew_user') || '' } catch { return '' } }

function Carrinho() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(loadCart())
  const [method, setMethod] = useState('card')
  const [paid, setPaid] = useState(false)
  const [paidTotal, setPaidTotal] = useState('')

  useEffect(() => {
    if (!isLogged()) {
      try { localStorage.setItem('chew_after_login', '/carrinho') } catch {}
      navigate('/login')
    }
  }, [navigate])

  function inc(id) { const c = loadCart(); if (c[id]) { c[id].qty++; saveCart(c); setCart({ ...c }) } }
  function dec(id) { const c = loadCart(); if (c[id]) { c[id].qty--; if (c[id].qty <= 0) delete c[id]; saveCart(c); setCart({ ...c }) } }
  function remove(id) { const c = loadCart(); delete c[id]; saveCart(c); setCart({ ...c }) }

  function logout() {
    try {
      localStorage.removeItem('chew_logged_in')
      localStorage.removeItem('chew_user')
    } catch {}
    navigate('/login')
  }

  const ids = Object.keys(cart)
  const total = ids.reduce((a, id) => a + cart[id].price * cart[id].qty, 0)
  const empty = ids.length === 0 && !paid
  const logged = isLogged()

  if (!logged) return null

  function pay() {
    const idsConsulta = ids.filter(function (id) { return id.startsWith('vet:') })

    if (idsConsulta.length > 0) {
      const c = loadCart()
      idsConsulta.forEach(function (id) { delete c[id] })
      saveCart(c)
      setCart({ ...c })

      try { localStorage.setItem('chew_after_agendamento', '/carrinho') } catch {}
      navigate('/agendar')
      return
    }

    try {
      const orders = JSON.parse(localStorage.getItem('chew_orders') || '[]')
      orders.push({ items: cart, total, method, ts: Date.now() })
      localStorage.setItem('chew_orders', JSON.stringify(orders))
      localStorage.removeItem('chew_cart')
    } catch {}
    setPaidTotal(money(total)); setPaid(true); setCart({}); window.scrollTo(0, 0)
  }

  const methods = [['card', 'Cartão'], ['pix', 'Pix'], ['boleto', 'Boleto']]

  return (
    <div style={{ background: '#F4F1EA', minHeight: '100vh', display: 'flex', justifyContent: 'center', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        .chew-carrinho-header-nav { flex-wrap: wrap; }
        .chew-carrinho-body { flex-wrap: wrap; }
        .chew-carrinho-body > div:first-child { min-width: 320px; }
        .chew-carrinho-body > div:last-child { min-width: 280px; }
        .chew-carrinho-card-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 700px) {
          .chew-carrinho-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ width: '100%', maxWidth: 1180, background: '#F4F1EA', position: 'relative' }}>


        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: '#16313b', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(0,0,0,.18)', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, textDecoration: 'none', letterSpacing: '.5px', color: '#fff' }}>CHEW!!</Link>
          <nav className="chew-carrinho-header-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/produtos" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(255,255,255,.14)' }}>Continuar comprando</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.14)', borderRadius: 30, padding: '4px 4px 4px 14px' }}><span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: '#fff' }}>Olá, {getUser()}</span><a onClick={logout} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 12, color: '#16313b', background: '#fff', borderRadius: 30, padding: '6px 13px', textDecoration: 'none', cursor: 'pointer' }}>Sair</a></div>
          </nav>
        </header>

        {empty && (

          <section style={{ padding: '80px 40px 100px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', maxWidth: 460 }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: '0 10px 26px rgba(0,0,0,.06)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cdc8bb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6" /></svg>
              </div>
              <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 36, color: '#16313b', margin: '0 0 10px' }}>Seu carrinho está vazio</h1>
              <p style={{ fontSize: 16, color: '#7a7a6a', margin: '0 0 26px' }}>Que tal dar uma olhada nos Produtos e serviços para mimar seu pet?</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/produtos" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', background: '#E8530E', textDecoration: 'none', borderRadius: 13, padding: '13px 28px' }}>Ver Produtos</Link>
                <Link to="/servicos" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', background: '#fff', textDecoration: 'none', borderRadius: 13, padding: '13px 28px' }}>Ver serviços</Link>
              </div>
            </div>
          </section>
        )}

        {!empty && !paid && (

          <section style={{ padding: '34px 40px 60px' }}>
            <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 40, color: '#16313b', margin: '0 0 24px' }}>Carrinho & Pagamento</h1>
            <div className="chew-carrinho-body" style={{ display: 'flex', gap: 26, alignItems: 'flex-start' }}>


              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ background: '#fff', borderRadius: 24, padding: '24px 26px', boxShadow: '0 10px 26px rgba(0,0,0,.06)' }}>
                  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: '#16313b', margin: '0 0 16px' }}>Itens do pedido</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {ids.map((id) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 16, background: '#F8F6F0', flexWrap: 'wrap' }}>
                        <span style={{ width: 48, height: 48, borderRadius: 13, flexShrink: 0, background: cart[id].color || '#E8530E' }}></span>
                        <div style={{ flex: 1, minWidth: 140 }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b' }}>{cart[id].name}</div>
                          <div style={{ fontSize: 13, color: '#9a9a8a' }}>{money(cart[id].price)} cada</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => dec(id)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#ece8de', cursor: 'pointer', fontSize: 16 }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{cart[id].qty}</span>
                          <button onClick={() => inc(id)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#ece8de', cursor: 'pointer', fontSize: 16 }}>+</button>
                        </div>
                        <div style={{ width: 92, textAlign: 'right', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: '#16313b' }}>{money(cart[id].price * cart[id].qty)}</div>
                        <button onClick={() => remove(id)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#c0392b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg></button>
                      </div>
                    ))}
                  </div>
                  {ids.some(function (id) { return id.startsWith('vet:') }) && (
                    <p style={{ fontSize: 12.5, color: '#7a8a8d', marginTop: 14, marginBottom: 0 }}>
                      Este pedido inclui uma consulta ou vacina — ao finalizar, você vai primeiro escolher o dia e horário no agendamento.
                    </p>
                  )}
                </div>


                <div style={{ background: '#fff', borderRadius: 24, padding: '24px 26px', boxShadow: '0 10px 26px rgba(0,0,0,.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <span style={{ width: 40, height: 40, borderRadius: 12, background: '#E7EDD3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5E7A1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg></span>
                    <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: '#16313b', margin: 0 }}>Pagamento</h3>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
                    {methods.map(([key, label]) => {
                      const on = key === method
                      return <button key={key} onClick={() => setMethod(key)} style={{ flex: '1 1 100px', height: 44, borderRadius: 12, border: `2px solid ${on ? '#16313b' : '#e3ddd0'}`, background: on ? '#16313b' : '#fff', color: on ? '#fff' : '#16313b', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{label}</button>
                    })}
                  </div>

                  {method === 'card' && (
                    <div className="chew-carrinho-card-grid" style={{ display: 'grid', gap: '14px 16px' }}>
                      <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Número do cartão</label><input style={fld} type="text" placeholder="0000 0000 0000 0000" /></div>
                      <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Nome impresso no cartão</label><input style={fld} type="text" placeholder="Nome completo" /></div>
                      <div><label style={labelStyle}>Validade</label><input style={fld} type="text" placeholder="MM/AA" /></div>
                      <div><label style={labelStyle}>CVV</label><input style={fld} type="text" placeholder="123" /></div>
                      <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Parcelas</label><select style={fld}><option>1x sem juros</option><option>2x sem juros</option><option>3x sem juros</option><option>6x sem juros</option><option>12x</option></select></div>
                    </div>
                  )}
                  {method === 'pix' && (
                    <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
                      <div style={{ width: 150, height: 150, margin: '0 auto 14px', borderRadius: 16, background: 'repeating-conic-gradient(#16313b 0% 25%,#fff 0% 50%) 50% / 18px 18px', border: '6px solid #fff', boxShadow: '0 6px 16px rgba(0,0,0,.12)' }}></div>
                      <p style={{ fontSize: 14, color: '#7a7a6a', margin: 0 }}>Escaneie o QR Code no app do seu banco.<br />O pagamento é confirmado na hora.</p>
                    </div>
                  )}
                  {method === 'boleto' && (
                    <div style={{ padding: '6px 0' }}>
                      <div style={{ height: 60, borderRadius: 12, background: 'repeating-linear-gradient(90deg,#16313b 0 3px,#fff 3px 6px,#16313b 6px 8px,#fff 8px 13px)', marginBottom: 12, border: '6px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}></div>
                      <p style={{ fontSize: 14, color: '#7a7a6a', margin: 0 }}>O boleto vence em 3 dias úteis. A compra é confirmada após a compensação.</p>
                    </div>
                  )}
                </div>
              </div>


              <div style={{ flex: '0 0 340px', background: '#fff', borderRadius: 24, padding: '26px 26px', boxShadow: '0 10px 26px rgba(0,0,0,.06)', position: 'sticky', top: 20 }}>
                <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: '#16313b', margin: '0 0 18px' }}>Resumo</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, color: '#5a5a4a', marginBottom: 10 }}><span>Subtotal</span><span>{money(total)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, color: '#5a5a4a', marginBottom: 10 }}><span>Frete</span><span style={{ color: '#22A06B', fontWeight: 700 }}>Grátis</span></div>
                <div style={{ height: 1, background: '#eee', margin: '14px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}><span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#16313b' }}>Total</span><span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 30, color: '#E8530E' }}>{money(total)}</span></div>
                <button onClick={pay} style={{ width: '100%', height: 52, border: 'none', borderRadius: 14, background: '#E8530E', color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, cursor: 'pointer', boxShadow: '0 10px 24px rgba(232,83,14,.3)' }}>Pagar agora</button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14, fontSize: 12, color: '#9a9a8a' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9a8a" strokeWidth="2"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>Pagamento 100% seguro</div>
              </div>
            </div>
          </section>
        )}

        {paid && (

          <section style={{ padding: '70px 40px 100px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 560, background: '#fff', borderRadius: 30, padding: '50px 44px', textAlign: 'center', boxShadow: '0 14px 38px rgba(0,0,0,.08)' }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#E7EDD3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5E7A1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
              </div>
              <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 38, color: '#16313b', margin: '0 0 12px' }}>Pagamento aprovado!</h1>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: '#7a7a6a', margin: '0 0 8px' }}>Obrigada pela compra! Seu pedido de <strong style={{ color: '#E8530E' }}>{paidTotal}</strong> foi confirmado.</p>
              <p style={{ fontSize: 14, color: '#9a9a8a', margin: '0 0 28px' }}>Enviamos os detalhes por e-mail. Seu pet vai amar!</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/produtos" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', background: '#16313b', textDecoration: 'none', borderRadius: 13, padding: '13px 28px' }}>Continuar comprando</Link>
                <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', background: '#F4F1EA', textDecoration: 'none', borderRadius: 13, padding: '13px 28px' }}>Voltar ao início</Link>
              </div>
            </div>
          </section>
        )}


        <footer style={{ background: '#123542', padding: '34px 44px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 30, flexWrap: 'wrap' }}>
            <Link to="/sobre" style={footLink}>Sobre</Link>
            <Link to="/servicos" style={footLink}>Serviços</Link>
            <Link to="/produtos" style={footLink}>Produtos</Link>
            <Link to="/adocao" style={footLink}>Adoção</Link>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default Carrinho