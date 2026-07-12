import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'

const navStyle = {
  fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b',
  textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(255,255,255,.5)',
}
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }

const ROLES = {
  front: { label: 'Front-end', tagBg: '#FDE2D3', tagColor: '#C2541A' },
  back:  { label: 'Back-end', tagBg: '#DDE7F4', tagColor: '#1B6FB0' },
  db:    { label: 'Banco de dados', tagBg: '#E1EED6', tagColor: '#5E7A1E' },
  doc:   { label: 'Documentação', tagBg: '#EDE0F2', tagColor: '#8046A6' },
}

const BG = ['#FFE0CE', '#D6E8F6', '#E4F0D6', '#EFE0F5', '#FCE0E6', '#D6F0EE', '#FFF0CC']


const TEAM = [
  { name: 'Giovanna Duarte', role: 'front', img: '/imagens/giovanna.jpeg' },
  { name: 'Tiago Alves', role: 'db', img: '/imagens/tiago.png' },
  { name: 'Luigi Calvonni', role: 'doc', img: '/imagens/luigi.png' },
  { name: 'João Enomoto', role: 'back', img: '/imagens/enomoto.png' },
  { name: 'Isaac', role: 'back', img: '/imagens/isaac.png' },
  { name: 'João', role: 'db', img: '/imagens/jp.png' },
  { name: 'Estevão', role: 'db', img: '/imagens/estevão.jpg' },
  { name: 'Victor', role: 'back', img: '/imagens/victor.png' },
]

function Sobre() {
  return (
    <div style={{ background: '#F4F1EA', minHeight: '100vh', display: 'flex', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: '100%', background: '#F4F1EA', overflow: 'hidden', position: 'relative' }}>

        
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: '#FFB68C', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(232,131,70,.22)' }}>
          <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, textDecoration: 'none', letterSpacing: '.5px', color: '#16313b' }}>CHEW!!</Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/servicos" style={navStyle}>Serviços</Link>
            <Link to="/adocao" style={navStyle}>Adoção</Link>
            <Link to="/Produtos" style={navStyle}>Produtos</Link>
            <Link to="/sobre" style={{ ...navStyle, color: '#fff', background: '#16313b' }}>Sobre</Link>
            <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px' }}>Entre</Link>
          </nav>
        </header>

        
        <Reveal>
          <section style={{ textAlign: 'center', padding: '56px 40px 30px' }}>
            <div style={{ display: 'inline-block', background: '#fff', color: '#E8530E', fontWeight: 800, fontSize: 13, letterSpacing: '1.5px', padding: '8px 18px', borderRadius: 30, marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,.06)' }}>GRUPO 2 • QUEM FEZ O CHEW!!</div>
            <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 56, lineHeight: 1, color: '#16313b', margin: '0 0 16px' }}>As pessoas por trás<br />do projeto</h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: '#6a6a6a', maxWidth: 520, margin: '0 auto' }}>O CHEW!! nasceu do trabalho e do carinho de um time dedicado. Conheça quem deu vida a cada parte do projeto.</p>
          </section>
        </Reveal>

        {/* grade do grupo */}
        <Reveal>
          <section style={{ padding: '20px 40px 50px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {TEAM.map((m, i) => {
                const r = ROLES[m.role]
                return (
                  <div key={i} style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 10px 26px rgba(0,0,0,.07)', transition: 'transform .3s, box-shadow .3s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 22px 40px rgba(0,0,0,.16)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(0,0,0,.07)' }}>
                   
                    <div style={{ height: 230, background: BG[i % BG.length] }}>
                      {m.img && <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                    </div>
                    
                    <div style={{ padding: '14px 20px 22px', textAlign: 'center' }}>
                      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20, color: '#16313b', margin: '0 0 8px' }}>{m.name}</h3>
                      <span style={{ display: 'inline-block', background: r.tagBg, color: r.tagColor, fontWeight: 700, fontSize: 13, padding: '6px 14px', borderRadius: 30 }}>{r.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </Reveal>

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

export default Sobre