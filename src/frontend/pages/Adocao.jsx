import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";

function useParallax(speed) {
    const [offset, setOffset] = useState(0);
    useEffect(function () {
        function onScroll() {
            setOffset(window.scrollY * speed);
        }
        window.addEventListener("scroll", onScroll);
        return function () {
            window.removeEventListener("scroll", onScroll);
        };
    }, [speed]);
    return offset;
}

function isLogged() { try { return localStorage.getItem('chew_logged_in') === '1' } catch { return false } }
function doLogout() { try { localStorage.removeItem('chew_logged_in') } catch { } }

const navStyle = {
    fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b',
    textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(255,255,255,.5)',
}
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }
const ctaBtn = (bg, color) => ({
    fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color, background: bg,
    textDecoration: 'none', borderRadius: 14, padding: '14px 32px',
})


// Resolve a imagem do pet pelo nome (fallback enquanto não há imagem_url no banco)
function getPetImage(nome, imagem_url) {
    if (imagem_url) return imagem_url;
    const n = (nome || '').toLowerCase();
    if (n.includes('amora')) return '/imagens/amoradoc.jpg';
    if (n.includes('bartô') || n.includes('barto')) return '/imagens/bartoadoc.jpg';
    if (n.includes('mel')) return '/imagens/meladoc.jpg';
    if (n.includes('thor')) return '/imagens/thoradoc.jpg';
    if (n.includes('nina') || n.includes('tico')) return '/imagens/ninaetico.jpg';
    if (n.includes('pipoca')) return '/imagens/pipoca.jpg';
    if (n.includes('café') || n.includes('cafe') || n.includes('pingado')) return '/imagens/cafe.jpg';
    if (n.includes('kiko')) return '/imagens/chicoadoc.jpg';
    if (n.includes('chico')) return '/imagens/chico.jpg';
    if (n.includes('cinza')) return '/imagens/bartoadoc.jpg';
    if (n.includes('farofa')) return '/imagens/cafe.jpg';
    if (n.includes('bruto')) return '/imagens/adocao1.jpg';
    if (n.includes('rex')) return '/imagens/thoradoc.jpg';
    if (n.includes('coelho')) return '/imagens/coelho1.jpg';
    return '/imagens/adocao.jpg';
}

// Cor do badge baseado na raça
function getTagColor(raca) {
    const r = (raca || '').toLowerCase();
    if (r.includes('gato') || r.includes('persa') || r.includes('siamês') || r.includes('srd')) return '#D06A8E';
    if (r.includes('pássaro') || r.includes('passaro') || r.includes('calopsita') || r.includes('periquito')) return '#1B888D';
    if (r.includes('roedor') || r.includes('hamster') || r.includes('coelho')) return '#C99B2E';
    if (r.includes('réptil') || r.includes('reptil')) return '#7a8a2e';
    return '#E8530E'; // padrão = cão
}

function Adocao() {
    const [svcMenu, setSvcMenu] = useState(false)
    const [logged, setLogged] = useState(isLogged())
    const [hoverHero, setHoverHero] = useState(false)
    const parallaxOffset = useParallax(0.3)
    const [pets, setPets] = useState([])
    const [loadingPets, setLoadingPets] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3000/api/animais-adocao?status=Dispon%C3%ADvel')
            .then(res => res.json())
            .then(data => { setPets(Array.isArray(data) ? data : []); setLoadingPets(false); })
            .catch(() => setLoadingPets(false));
    }, [])

    function handleLogout() {
        doLogout()
        setLogged(false)
    }

    function handleShare() {
        const shareData = {
            title: 'CHEW - Adoção de pets',
            text: 'Dá uma olhada nesses bichinhos esperando por um lar!',
            url: window.location.href,
        }
        if (navigator.share) {
            navigator.share(shareData).catch(function () { })
        } else {
            navigator.clipboard.writeText(shareData.url)
            alert('Link copiado! Compartilhe com quem você conhece.')
        }
    }

    const heroTransform = 'translateY(' + (-parallaxOffset) + 'px) rotate(' + (hoverHero ? '0deg' : '3deg') + ') scale(' + (hoverHero ? 1.04 : 1) + ')'

    return (
        <div style={{ background: '#EA9CAF', minHeight: '100vh', display: 'flex', fontFamily: "'Nunito', sans-serif" }}>
            <style>{`
        .chew-adocao-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 980px) {
          .chew-adocao-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .chew-adocao-hero { flex-wrap: wrap; }
        .chew-doacao-section { flex-wrap: wrap; }
        .chew-doacao-section > div:last-child { min-width: 280px; }
      `}</style>
            <div style={{ width: '100%', background: '#EA9CAF', position: 'relative' }}>


                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: '#fbb6c4', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(190,140,140,.2)', flexWrap: 'wrap', gap: 12 }}>
                    <Link to="/" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, textDecoration: 'none', letterSpacing: '.5px', color: '#16313b' }}>CHEW!!</Link>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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
                        {!logged && <Link to="/login" style={navStyle}>Cadastro</Link>}
                        {!logged && (
                            <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px' }}>Entre</Link>
                        )}
                        {logged && (
                            <button onClick={handleLogout} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', background: 'transparent', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px', cursor: 'pointer' }}>Sair</button>
                        )}
                    </nav>
                </header>


                <Reveal>
                    <section className="chew-adocao-hero" style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '54px 40px 30px' }}>
                        <div style={{ flex: 1, textAlign: 'left', minWidth: 280 }}>
                            <div style={{ display: 'inline-block', background: '#fff', color: '#D06A8E', fontWeight: 800, fontSize: 13, letterSpacing: '1.5px', padding: '8px 18px', borderRadius: 30, marginBottom: 20, boxShadow: '0 4px 12px rgba(208,106,142,.18)' }}>ADOTE • RECOMENDE • AME</div>
                            <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 60, lineHeight: .98, color: '#16313b', margin: '0 0 16px' }}>Encontre seu<br />melhor amigo</h1>
                            <p style={{ fontSize: 18, lineHeight: 1.55, color: '#6a5b5b', maxWidth: 460, margin: '0 0 28px' }}>Centenas de focinhos esperando por um lar cheio de amor. Toda ajudinha conta.</p>
                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                <a href="#bichinhos" style={ctaBtn('#E8530E', '#fff')}>Conhecer bichinhos</a>
                                <a href="#ajudar" style={ctaBtn('#fff', '#D06A8E')}>Não posso adotar agora</a>
                            </div>
                        </div>

                        <div
                            style={{ flex: '0 0 300px', height: 300, borderRadius: 30, overflow: 'hidden', border: '7px solid #fff', boxShadow: '0 18px 40px rgba(208,106,142,.22)', transform: heroTransform, transition: 'transform .35s cubic-bezier(.2,.8,.3,1.4)', cursor: 'pointer' }}
                            onMouseEnter={function () { setHoverHero(true) }}
                            onMouseLeave={function () { setHoverHero(false) }}
                        >
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
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#6a7a4a' }}>indicações de amigos</div>
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
                        <div className="chew-adocao-grid" style={{ display: 'grid', gap: 22 }}>
                            {loadingPets ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 0', fontSize: 17, color: '#7a6a6a', fontWeight: 600 }}>
                                    🐾 Carregando focinhos...
                                </div>
                            ) : pets.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 0', fontSize: 17, color: '#7a6a6a', fontWeight: 600 }}>
                                    🎉 No momento todos os pets já foram adotados! Volte em breve.
                                </div>
                            ) : (
                                pets.map((p) => {
                                    const img = getPetImage(p.nome, p.imagem_url);
                                    const tagColor = getTagColor(p.raca);
                                    const tag = (p.raca || 'Pet').toUpperCase();
                                    const age = p.faixa_etaria || 'Idade desconhecida';
                                    const desc = p.hist_medico || 'Lindo pet cheio de carinho esperando por um lar amoroso.';
                                    return (
                                        <div key={p.id_animal_adocao} style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 10px 26px rgba(0,0,0,.08)', transition: 'transform .3s, box-shadow .3s' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 22px 40px rgba(0,0,0,.16)' }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(0,0,0,.08)' }}>
                                            <div style={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '22px 22px 6px 6px' }}>
                                                <img src={img} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                                <span style={{ position: 'absolute', top: 10, right: 10, background: tagColor, color: '#fff', fontWeight: 800, fontSize: 11, letterSpacing: '.5px', padding: '5px 11px', borderRadius: 30 }}>{tag}</span>
                                            </div>
                                            <div style={{ padding: '14px 16px 18px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20, color: '#16313b' }}>{p.nome}</span>
                                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#aa9a9a' }}>{age}</span>
                                                </div>
                                                <p style={{ fontSize: 13.5, color: '#8a7a7a', margin: '0 0 14px', lineHeight: 1.4 }}>{desc}</p>
                                                <Link to={`/adotar?pet=${encodeURIComponent(p.nome)}`} style={{ display: 'block', textAlign: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: '#fff', background: '#16313b', textDecoration: 'none', borderRadius: 11, padding: 10 }}>Quero adotar</Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </Reveal>

                {/* Não posso adotar agora -> recomendar */}
                <Reveal>
                    <section id="ajudar" className="chew-doacao-section" style={{ display: 'flex', alignItems: 'center', gap: 40, margin: '30px 24px', background: 'linear-gradient(135deg,#EED8D5 0%,#F4DDE8 100%)', borderRadius: 30, padding: '44px 48px' }}>
                        <div style={{ flex: '0 0 280px', height: 260, borderRadius: 26, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 16px 36px rgba(0,0,0,.14)', transform: 'rotate(-3deg)' }}>
                            <img src="/imagens/apeloadocao.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <span style={{ display: 'inline-block', background: '#fff', color: '#D06A8E', fontWeight: 800, fontSize: 12, letterSpacing: '1px', padding: '6px 14px', borderRadius: 30, marginBottom: 14 }}>NÃO PODE ADOTAR AGORA?</span>
                            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 36, color: '#16313b', margin: '0 0 12px', lineHeight: 1.05 }}>Ajude sem adotar</h2>
                            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#6a5b5b', maxWidth: 440, margin: '0 0 22px' }}>Nem todo mundo pode adotar agora, e tudo bem. Você ainda pode fazer diferença indicando esses bichinhos pra alguém que possa.</p>
                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                <button onClick={handleShare} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', background: '#E8530E', border: 'none', cursor: 'pointer', borderRadius: 13, padding: '13px 28px' }}>Indicar para um amigo</button>
                            </div>
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

            </div>
        </div>
    )
}

export default Adocao