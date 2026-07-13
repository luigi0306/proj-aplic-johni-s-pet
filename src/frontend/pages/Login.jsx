import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = '/api'

const inputStyle = {
  width: '100%', height: 40, border: '1.5px solid #e3daf0', borderRadius: 10,
  background: 'rgba(255,255,255,.95)', padding: '0 36px 0 14px', fontSize: 13.5, color: '#333',
  outline: 'none', transition: 'border-color .2s', boxSizing: 'border-box',
}
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#4a4255', marginBottom: 6, letterSpacing: '.2px' }
const orangeBtn = {
  width: '100%', height: 44, border: 'none', borderRadius: 10, background: '#FF6600', color: '#fff',
  fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 10px 22px rgba(255,102,0,.28)',
  letterSpacing: '.3px', boxSizing: 'border-box', transition: 'opacity .2s',
}
const eyeBtnStyle = { position: 'absolute', right: 3, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }
const errorTextStyle = { color: '#c0392b', fontSize: 12, fontWeight: 700, margin: '-8px 0 12px' }

function Eye({ open }) {
  return open
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a8fb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a8fb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.9 17.9A10.6 10.6 0 0 1 12 19c-7 0-11-7-11-7a19 19 0 0 1 5.1-5.9M9.9 4.2A10.6 10.6 0 0 1 12 4c7 0 11 7 11 7a19 19 0 0 1-2.2 3.2M1 1l22 22" /></svg>
}

function isValidEmail(v) {
  return !!v && v.includes('@') && v.includes('.')
}

function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(() => {
    try { return new URLSearchParams(window.location.search).get('mode') === 'signup' ? 'signup' : 'login' } catch { return 'login' }
  })
  const [showLA, setShowLA] = useState(false)
  const [showSA, setShowSA] = useState(false)
  const [showSB, setShowSB] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [signupError, setSignupError] = useState('')
  const [loading, setLoading] = useState(false)

  const loginEmail = useRef(null)
  const loginPassword = useRef(null)

  const signFullName = useRef(null)
  const signCpf = useRef(null)
  const signPhone = useRef(null)
  const signAddress = useRef(null)
  const signEmail = useRef(null)
  const signPassword = useRef(null)
  const signPasswordRepeat = useRef(null)

  function finishAuth(token, cliente) {
    try {
      localStorage.setItem('chew_logged_in', '1')
      localStorage.setItem('chew_user', cliente.nome ? cliente.nome.split(' ')[0] : (cliente.email || 'amigo'))
      localStorage.setItem('chew_token', token)
      localStorage.setItem('chew_cliente', JSON.stringify(cliente))
    } catch { }

    let redirectTo = '/'
    try {
      const after = localStorage.getItem('chew_after_login')
      if (after) { redirectTo = after; localStorage.removeItem('chew_after_login') }
    } catch { }
    navigate(redirectTo)
  }

  async function handleLogin() {
    const email = loginEmail.current?.value?.trim() || ''
    const senha = loginPassword.current?.value || ''

    if (!isValidEmail(email)) { setLoginError('Digite um email válido para entrar.'); return }
    if (!senha) { setLoginError('Digite sua senha para entrar.'); return }

    setLoginError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/clientes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })
      const data = await res.json()
      if (!res.ok) { setLoginError(data.message || 'Email ou senha inválidos.'); return }
      finishAuth(data.token, data.cliente)
    } catch {
      setLoginError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup() {
    const nome = signFullName.current?.value?.trim() || ''
    const cpf = signCpf.current?.value?.trim() || ''
    const telefone = signPhone.current?.value?.trim() || ''
    const endereco = signAddress.current?.value?.trim() || ''
    const email = signEmail.current?.value?.trim() || ''
    const senha = signPassword.current?.value || ''
    const repeat = signPasswordRepeat.current?.value || ''

    if (!nome) { setSignupError('Digite seu nome completo.'); return }
    if (!cpf || cpf.replace(/\D/g, '').length < 11) { setSignupError('Digite um CPF válido (11 dígitos).'); return }
    if (!telefone || telefone.replace(/\D/g, '').length < 8) { setSignupError('Digite um telefone válido.'); return }
    if (!endereco) { setSignupError('Digite seu endereço.'); return }
    if (!isValidEmail(email)) { setSignupError('Digite um email válido.'); return }
    if (!senha || senha.length < 6) { setSignupError('A senha precisa ter pelo menos 6 caracteres.'); return }
    if (senha !== repeat) { setSignupError('As senhas digitadas não são iguais.'); return }

    setSignupError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/clientes/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, telefone, endereco, email, senha }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.errors?.[0]?.message || data.message || 'Erro no cadastro. Verifique os dados.'
        setSignupError(msg)
        return
      }
      finishAuth(data.token, data.cliente)
    } catch {
      setSignupError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const signup = mode === 'signup'
  const cardW = 372, gapL = 46, contW = 980
  const xLogin = gapL, xSignup = contW - cardW - gapL
  const frost = {
    position: 'absolute', top: '50%', width: cardW, padding: '28px 30px', borderRadius: 22,
    background: 'rgba(240,240,240,0.5)', backdropFilter: 'blur(9px)', WebkitBackdropFilter: 'blur(9px)',
    border: '1px solid rgba(255,255,255,0.55)', boxShadow: '0 20px 50px rgba(90,60,130,.28)',
    transition: 'transform .6s cubic-bezier(.7,0,.2,1), opacity .45s ease', boxSizing: 'border-box',
  }
  const loginCardStyle = { ...frost, left: 0, zIndex: signup ? 2 : 5, transform: `translate(${signup ? xSignup : xLogin}px, -50%)`, opacity: signup ? 0 : 1, pointerEvents: signup ? 'none' : 'auto' }
  const signupCardStyle = { ...frost, left: 0, zIndex: signup ? 5 : 2, transform: `translate(${signup ? xSignup : xLogin}px, -50%)`, opacity: signup ? 1 : 0, pointerEvents: signup ? 'auto' : 'none' }

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

      <div style={{ position: 'relative', width: 980, height: 850, maxWidth: '96vw', borderRadius: 30, overflow: 'hidden', background: '#D7C6EA', boxShadow: '0 30px 70px rgba(110,80,150,.35)' }}>

        <div style={{ position: 'absolute', top: 0, left: 0, width: '62%', height: '100%', background: '#CBB7E8', overflow: 'hidden' }}>
          <img src="/imagens/loginfundo.jpg" alt="" style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)', width: '108%', height: 'auto', minHeight: '86%', objectFit: 'contain', mixBlendMode: 'multiply', opacity: .92 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,rgba(199,178,226,.32),rgba(170,135,210,.26))' }}></div>
        </div>

        {/* ── CARD LOGIN ── */}
        <div style={loginCardStyle}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 12.5, color: '#FF6600', marginBottom: 2, letterSpacing: '.4px' }}>CHEW!!</div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 34, color: '#111', margin: '0 0 18px' }}>Login</h2>
          <label style={labelStyle}>Email</label>
          <input id="login-email" ref={loginEmail} type="email" autoComplete="email" placeholder="username@gmail.com" className="chew-auth-input" style={{ ...inputStyle, padding: '0 14px', marginBottom: 13 }} />
          <label style={labelStyle}>Senha</label>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <input id="login-senha" ref={loginPassword} type={showLA ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" className="chew-auth-input" style={inputStyle} />
            <button type="button" onClick={() => setShowLA(!showLA)} style={eyeBtnStyle}><Eye open={showLA} /></button>
          </div>
          <div style={{ textAlign: 'right', marginBottom: 15 }}>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 12, fontWeight: 700, color: '#FF6600', textDecoration: 'none' }}>Esqueceu a senha?</a>
          </div>
          {loginError && <p style={errorTextStyle}>{loginError}</p>}
          <button id="btn-login" onClick={handleLogin} style={{ ...orangeBtn, opacity: loading ? .65 : 1 }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#6a6078', marginTop: 16 }}>Não tem conta? <a onClick={() => { setMode('signup'); setLoginError('') }} style={{ fontWeight: 800, color: '#FF6600', textDecoration: 'none', cursor: 'pointer' }}>Se cadastre de graça</a></div>
        </div>

        {/* ── CARD CADASTRO ── */}
        <div style={signupCardStyle}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 12.5, color: '#FF6600', marginBottom: 2, letterSpacing: '.4px' }}>CHEW!!</div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 30, color: '#111', margin: '0 0 15px' }}>Cadastre-se</h2>

          <label style={labelStyle}>Nome Completo</label>
          <input id="signup-nome" ref={signFullName} type="text" placeholder="Digite seu nome completo" className="chew-auth-input" style={{ ...inputStyle, padding: '0 14px', marginBottom: 11 }} />

          <label style={labelStyle}>CPF</label>
          <input id="signup-cpf" ref={signCpf} type="text" placeholder="000.000.000-00" className="chew-auth-input" style={{ ...inputStyle, padding: '0 14px', marginBottom: 11 }} />

          <label style={labelStyle}>Telefone</label>
          <input id="signup-telefone" ref={signPhone} type="tel" placeholder="(61) 99999-9999" className="chew-auth-input" style={{ ...inputStyle, padding: '0 14px', marginBottom: 11 }} />

          <label style={labelStyle}>Endereço</label>
          <input id="signup-endereco" ref={signAddress} type="text" placeholder="Rua, número, bairro" className="chew-auth-input" style={{ ...inputStyle, padding: '0 14px', marginBottom: 11 }} />

          <label style={labelStyle}>Email</label>
          <input id="signup-email" ref={signEmail} type="email" autoComplete="email" placeholder="username@gmail.com" className="chew-auth-input" style={{ ...inputStyle, padding: '0 14px', marginBottom: 11 }} />

          <label style={labelStyle}>Senha</label>
          <div style={{ position: 'relative', marginBottom: 11 }}>
            <input id="signup-senha" ref={signPassword} type={showSA ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" className="chew-auth-input" style={inputStyle} />
            <button type="button" onClick={() => setShowSA(!showSA)} style={eyeBtnStyle}><Eye open={showSA} /></button>
          </div>

          <label style={labelStyle}>Repetir Senha</label>
          <div style={{ position: 'relative', marginBottom: 15 }}>
            <input id="signup-confirmar-senha" ref={signPasswordRepeat} type={showSB ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" className="chew-auth-input" style={inputStyle} />
            <button type="button" onClick={() => setShowSB(!showSB)} style={eyeBtnStyle}><Eye open={showSB} /></button>
          </div>

          {signupError && <p style={errorTextStyle}>{signupError}</p>}

          <button id="btn-cadastro" onClick={handleSignup} style={{ ...orangeBtn, opacity: loading ? .65 : 1 }} disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 12, color: '#6a6078', marginTop: 14 }}>
            Já tem conta?{' '}
            <a onClick={() => { setMode('login'); setSignupError('') }} style={{ fontWeight: 800, color: '#FF6600', textDecoration: 'none', cursor: 'pointer' }}>Faça Login</a>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Login