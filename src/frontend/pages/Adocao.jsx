import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'

const navStyle = {
  fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b',
  textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(255,255,255,.5)',
}
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }
const ctaBtn = (bg, color) => ({
  fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color, background: bg,
  textDecoration: 'none', borderRadius: 14, padding: '14px 32px',
})


const PETS = [
  { name: 'Amora', age: '2 anos', tag: 'GATA', tagColor: '#D06A8E', img: '/imagens/amoradoc.jpg', desc: 'Carinhosa, adora um colo quentinho e soneca ao sol.' },
  { name: 'Bartô', age: '1 ano', tag: 'GATO', tagColor: '#1B6FB0', img: '/imagens/bartoadoc.jpg', desc: 'Curioso e brincalhão, vive explorando cada cantinho.' },
  { name: 'Mel', age: '8 meses', tag: 'GATA', tagColor: '#D06A8E', img: '/imagens/meladoc.jpg', desc: 'Doce e tranquila, perfeita pra quem ama paz.' },
  { name: 'Thor', age: '3 anos', tag: 'CÃO', tagColor: '#E8530E', img: '/imagens/thoradoc.jpg', desc: 'Companheiro fiel, ama passeios e bolinhas.' },
  { name: 'Nina & Tico', age: '1 ano', tag: 'Passáros', tagColor: '#7a8a2e', img: '/imagens/ninaetico.jpg', desc: 'A dupla mais fofa, sempre juntinhos e dóceis.' },
  { name: 'Pipoca', age: '6 meses', tag: 'ROEDOR', tagColor: '#C99B2E', img: '/imagens/pipoca.jpg', desc: 'Pequenina e cheia de energia, um docinho.' },
  { name: 'Café e Pingado', age: '2 anos', tag: 'CÃO', tagColor: '#E8530E', img: '/imagens/cafe.jpg', desc: 'Irmãos , muito fofinhos e brincalhões' },
  { name: 'Kiko', age: '2 anos', tag: 'Pássaros', tagColor: '#1B888D', img: '/imagens/chicoadoc.jpg', desc: 'Calminho e fascinante, pra tutores especiais.' },
  { name: 'Chico', age: '2 anos', tag: 'EXÓTICO', tagColor: '#1B888D', img: '/imagens/chico.jpg', desc: 'Calminho e Carinhoso, pra tutores especiais.' },
]


function Adocao() {
  const [svcMenu, setSvcMenu] = useState(false)

  return (
    <div style={{ background: '#EA9CAF', minHeight: '100vh', display: 'flex', justifyContent: 'center', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 1180, background: '#EA9CAF', position: 'relative' }}>


        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: '#fbb6c4', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(190,140,140,.2)' }}>
          <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, textDecoration: 'none', letterSpacing: '.5px', color: '#16313b' }}>CHEW!!</Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* menu Serviços com submenu */}
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
            <Link to="/adocao" style={{ ...navStyle, color: '#fff', background: '#E8530E' }}>Adoção</Link>
            <Link to="/produtos" style={navStyle}>Produtos</Link>
            <Link to="/login" style={navStyle}>Cadastro</Link>
            <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px' }}>Entre</Link>
          </nav>
        </header>


        <Reveal>
          <section style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '54px 40px 30px' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ display: 'inline-block', background: '#fff', color: '#D06A8E', fontWeight: 800, fontSize: 13, letterSpacing: '1.5px', padding: '8px 18px', borderRadius: 30, marginBottom: 20, boxShadow: '0 4px 12px rgba(208,106,142,.18)' }}>ADOTE • APADRINHE • AME</div>
              <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 60, lineHeight: .98, color: '#16313b', margin: '0 0 16px' }}>Encontre seu<br />melhor amigo</h1>
              <p style={{ fontSize: 18, lineHeight: 1.55, color: '#6a5b5b', maxWidth: 460, margin: '0 0 28px' }}>Centenas de focinhos esperando por um lar cheio de amor. Toda ajudinha conta.</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a href="#bichinhos" style={ctaBtn('#E8530E', '#fff')}>Conhecer bichinhos</a>
                <a href="#Adotar" style={ctaBtn('#fff', '#D06A8E')}>Quero Adotar</a>
              </div>
            </div>


            <div style={{ flex: '0 0 300px', height: 300, borderRadius: 30, overflow: 'hidden', border: '7px solid #fff', boxShadow: '0 18px 40px rgba(208,106,142,.22)', transform: 'rotate(3deg)', transition: 'transform .35s cubic-bezier(.2,.8,.3,1.4)', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.04)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(3deg) scale(1)' }}>
              <img src="/imagens/adocao.jpg" alt="Adoção" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>

          </section>
        </Reveal>


        <Reveal>
          <section style={{ display: 'flex', justifyContent: 'center', gap: 18, padding: '18px 40px 40px', flexWrap: 'wrap' }}>
            <div style={{ background: '#EED8D5', borderRadius: 22, padding: '20px 34px', textAlign: 'center', minWidth: 150 }}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, color: '#D06A8E' }}>320+</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#7a6a6a' }}>adoções felizes</div>
            </div>
            <div style={{ background: '#DDE7F4', borderRadius: 22, padding: '20px 34px', textAlign: 'center', minWidth: 150 }}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, color: '#1B6FB0' }}>85</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#5a6a7a' }}>esperando por você</div>
            </div>
            <div style={{ background: '#E7EDD3', borderRadius: 22, padding: '20px 34px', textAlign: 'center', minWidth: 150 }}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, color: '#7a8a2e' }}>140</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#6a7a4a' }}>padrinhos & madrinhas</div>
            </div>
          </section>
        </Reveal>

        {/* grade dos bichinhos */}
        <Reveal>
          <section id="bichinhos" style={{ padding: '20px 40px 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: 34 }}>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 40, color: '#16313b', margin: '0 0 8px' }}>Quem está esperando</h2>
              <p style={{ fontSize: 16, color: '#8a7a7a', margin: 0 }}>Conheça alguns dos nossos focinhos disponíveis para adoção.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
              {PETS.map((p, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 10px 26px rgba(0,0,0,.08)', transition: 'transform .3s, box-shadow .3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 22px 40px rgba(0,0,0,.16)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(0,0,0,.08)' }}>
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '22px 22px 6px 6px' }}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{ position: 'absolute', top: 10, right: 10, background: p.tagColor, color: '#fff', fontWeight: 800, fontSize: 11, letterSpacing: '.5px', padding: '5px 11px', borderRadius: 30 }}>{p.tag}</span>
                  </div>
                  <div style={{ padding: '14px 16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20, color: '#16313b' }}>{p.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#aa9a9a' }}>{p.age}</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: '#8a7a7a', margin: '0 0 14px', lineHeight: 1.4 }}>{p.desc}</p>
                    <Link to={`/adotar?pet=${encodeURIComponent(p.name)}`} style={{ display: 'block', textAlign: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: '#fff', background: '#16313b', textDecoration: 'none', borderRadius: 11, padding: 10 }}>Quero adotar</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Adotar */}
        <Reveal>
          <section id="Adotar" style={{ display: 'flex', alignItems: 'center', gap: 40, margin: '30px 24px', background: 'linear-gradient(135deg,#EED8D5 0%,#F4DDE8 100%)', borderRadius: 30, padding: '44px 48px' }}>
            <div style={{ flex: '0 0 280px', height: 260, borderRadius: 26, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 16px 36px rgba(0,0,0,.14)', transform: 'rotate(-3deg)' }}>
              <img src="/imagens/apeloadocao.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ display: 'inline-block', background: '#fff', color: '#D06A8E', fontWeight: 800, fontSize: 12, letterSpacing: '1px', padding: '6px 14px', borderRadius: 30, marginBottom: 14 }}>NÃO PODE ADOTAR AGORA?</span>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 36, color: '#16313b', margin: '0 0 12px', lineHeight: 1.05 }}>Apadrinhe um bichinho</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#6a5b5b', maxWidth: 440, margin: '0 0 22px' }}>Com uma contribuição mensal você garante ração, vacinas e muito carinho para um pet que ainda espera por um lar.</p>
              <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', background: '#E8530E', textDecoration: 'none', borderRadius: 13, padding: '13px 28px' }}>Adotar agora</Link>
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
              <Link to="/produtos" style={footLink}>Produtos</Link>
            </nav>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default Adocao