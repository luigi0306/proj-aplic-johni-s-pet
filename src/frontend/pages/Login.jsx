import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const inputStyle = {
  width: '100%', height: 42, border: '1.5px solid #e3daf0', borderRadius: 10,
  background: 'rgba(255,255,255,.95)', padding: '0 42px 0 14px', fontSize: 13.5, color: '#333',
  outline: 'none', transition: 'border-color .2s',
}
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#4a4255', marginBottom: 6, letterSpacing: '.2px' }
const orangeBtn = {
  width: '100%', height: 44, border: 'none', borderRadius: 10, background: '#FF6600', color: '#fff',
  fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 10px 22px rgba(255,102,0,.28)',
  letterSpacing: '.3px',
}
const socialBtn = { width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(0,0,0,.06)', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const eyeBtnStyle = { position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }

// olhinho de mostrar/ocultar senha
function Eye({ open }) {
  return open
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a8fb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a8fb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.9 17.9A10.6 10.6 0 0 1 12 19c-7 0-11-7-11-7a19 19 0 0 1 5.1-5.9M9.9 4.2A10.6 10.6 0 0 1 12 4c7 0 11 7 11 7a19 19 0 0 1-2.2 3.2M1 1l22 22" /></svg>
}

function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(() => {
    try { return new URLSearchParams(window.location.search).get('mode') === 'signup' ? 'signup' : 'login' } catch { return 'login' }
  })
  const [showLA, setShowLA] = useState(false)
  const [showSA, setShowSA] = useState(false)
  const [showSB, setShowSB] = useState(false)
  const loginEmail = useRef(null)
  const signEmail = useRef(null)

  function finishAuth(email) {
    const name = email && email.includes('@') ? email.split('@')[0] : (email || 'amigo')
    try {
      localStorage.setItem('chew_logged_in', '1')
      localStorage.setItem('chew_user', name)
    } catch {}

    // se a pessoa veio de algum lugar que exigiu login (ex: carrinho), volta pra lá
    let redirectTo = '/'
    try {
      const after = localStorage.getItem('chew_after_login')
      if (after) {
        redirectTo = after
        localStorage.removeItem('chew_after_login')
      }
    } catch {}
    navigate(redirectTo)
  }

  const signup = mode === 'signup'
  const cardW = 372, gapL = 46, contW = 980
  const xLogin = gapL, xSignup = contW - cardW - gapL
  const frost = {
    position: 'absolute', top: '50%', width: cardW, padding: '28px 30px', borderRadius: 22,
    background: 'rgba(240,240,240,0.5)', backdropFilter: 'blur(9px)', WebkitBackdropFilter: 'blur(9px)',
    border: '1px solid rgba(255,255,255,0.55)', boxShadow: '0 20px 50px rgba(90,60,130,.28)',
    transition: 'transform .6s cubic-bezier(.7,0,.2,1), opacity .45s ease',
  }
  const loginCardStyle = { ...frost, left: 0, zIndex: signup ? 2 : 5, transform: `translate(${signup ? xSignup : xLogin}px, -50%)`, opacity: signup ? 0 : 1, pointerEvents: signup ? 'none' : 'auto' }
  const signupCardStyle = { ...frost, left: 0, zIndex: signup ? 5 : 2, transform: `translate(${signup ? xSignup : xLogin}px, -50%)`, opacity: signup ? 1 : 0, pointerEvents: signup ? 'auto' : 'none' }

  // ícones sociais (Google, Apple, Facebook)
  const google = <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-7.9z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2a11 11 0 0 0 0 9.8z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.7l3.1-3.1A11 11 0 0 0 2 7.1l3.7 2.8C6.6 7.3 9.1 5.4 12 5.4z" /></svg>
  const apple = <svg width="17" height="17" viewBox="0 0 24 24" fill="#111"><path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.02-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.46 7.84 1.3 10.41.86 1.26 1.89 2.67 3.23 2.62 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.28-1.28 3.13-2.55.99-1.46 1.4-2.88 1.42-2.95-.03-.01-2.73-1.05-2.76-4.16z" /></svg>
  const facebook = <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7v-3.5h3.1V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" /></svg>

  return (
    <div style={{ minHeight: '100vh', background: '#E6D7E8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear { display: none; }
        input::-webkit-textfield-decoration-container { visibility: hidden; }
        input::-webkit-credentials-auto-fill-button { visibility: hidden; display: none !important; pointer-events: none; position: absolute; right: 0; }
        input::-webkit-contacts-auto-fill-button { visibility: hidden; display: none !important; }
        .chew-auth-input:focus { border-color: #FF6600 !important; }
      `}</style>

      <Link to="/" style={{ position: 'fixed', top: 24, left: 30, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26, color: '#16313b', textDecoration: 'none', zIndex: 20 }}>CHEW!!</Link>

      <div style={{ position: 'relative', width: 980, height: 600, maxWidth: '96vw', borderRadius: 30, overflow: 'hidden', background: '#D7C6EA', boxShadow: '0 30px 70px rgba(110,80,150,.35)' }}>

        <div style={{ position: 'absolute', top: 0, left: 0, width: '62%', height: '100%', background: '#CBB7E8', overflow: 'hidden' }}>
          <img src="/imagens/loginfundo.jpg" alt="" style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)', width: '108%', height: 'auto', minHeight: '86%', objectFit: 'contain', mixBlendMode: 'multiply', opacity: .92 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,rgba(199,178,226,.32),rgba(170,135,210,.26))' }}></div>
        </div>

        <div style={loginCardStyle}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 12.5, color: '#FF6600', marginBottom: 2, letterSpacing: '.4px' }}>CHEW!!</div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 34, color: '#111', margin: '0 0 18px' }}>Login</h2>
          <label style={labelStyle}>Email</label>
          <input ref={loginEmail} type="email" autoComplete="email" placeholder="username@gmail.com" className="chew-auth-input" style={{ ...inputStyle, padding: '0 14px', marginBottom: 13 }} />
          <label style={labelStyle}>Senha</label>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <input type={showLA ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" className="chew-auth-input" style={inputStyle} />
            <button type="button" onClick={() => setShowLA(!showLA)} style={eyeBtnStyle}><Eye open={showLA} /></button>
          </div>
          <div style={{ textAlign: 'right', marginBottom: 15 }}><a href="#" style={{ fontSize: 12, fontWeight: 700, color: '#FF6600', textDecoration: 'none' }}>Esqueceu a senha?</a></div>
          <button onClick={() => finishAuth(loginEmail.current?.value)} style={orangeBtn}>Entrar</button>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#6a6078', margin: '14px 0 12px' }}>Ou continue com</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => finishAuth(loginEmail.current?.value)} style={socialBtn}>{google}</button>
            <button onClick={() => finishAuth(loginEmail.current?.value)} style={socialBtn}>{apple}</button>
            <button onClick={() => finishAuth(loginEmail.current?.value)} style={socialBtn}>{facebook}</button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#6a6078', marginTop: 16 }}>Não tem conta? <a onClick={() => setMode('signup')} style={{ fontWeight: 800, color: '#FF6600', textDecoration: 'none', cursor: 'pointer' }}>Se cadastre de graça</a></div>
        </div>

        <div style={signupCardStyle}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 12.5, color: '#FF6600', marginBottom: 2, letterSpacing: '.4px' }}>CHEW!!</div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 30, color: '#111', margin: '0 0 15px' }}>Cadastre-se</h2>
          <label style={labelStyle}>Email</label>
          <input ref={signEmail} type="email" autoComplete="email" placeholder="username@gmail.com" className="chew-auth-input" style={{ ...inputStyle, padding: '0 14px', marginBottom: 11 }} />
          <label style={labelStyle}>Senha</label>
          <div style={{ position: 'relative', marginBottom: 11 }}>
            <input type={showSA ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" className="chew-auth-input" style={inputStyle} />
            <button type="button" onClick={() => setShowSA(!showSA)} style={eyeBtnStyle}><Eye open={showSA} /></button>
          </div>
          <label style={labelStyle}>Repetir Senha</label>
          <div style={{ position: 'relative', marginBottom: 15 }}>
            <input type={showSB ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" className="chew-auth-input" style={inputStyle} />
            <button type="button" onClick={() => setShowSB(!showSB)} style={eyeBtnStyle}><Eye open={showSB} /></button>
          </div>
          <button onClick={() => finishAuth(signEmail.current?.value)} style={orangeBtn}>Criar conta</button>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#6a6078', margin: '14px 0 12px' }}>Ou continue com</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => finishAuth(signEmail.current?.value)} style={socialBtn}>{google}</button>
            <button onClick={() => finishAuth(signEmail.current?.value)} style={socialBtn}>{apple}</button>
            <button onClick={() => finishAuth(signEmail.current?.value)} style={socialBtn}>{facebook}</button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#6a6078', marginTop: 14 }}>Já tem conta? <a onClick={() => setMode('login')} style={{ fontWeight: 800, color: '#FF6600', textDecoration: 'none', cursor: 'pointer' }}>Faça Login</a></div>
        </div>

      </div>
    </div>
  )
}

export default Login