import { useState, useEffect } from 'react'

function BackToTop() {
  const [show, setShow] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <button
      onClick={toTop}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Voltar ao topo"
      style={{
        position: 'fixed', right: 26, bottom: 26, zIndex: 60,
        width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: '#E8530E', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hover ? '0 14px 30px rgba(232,83,14,.5)' : '0 8px 22px rgba(232,83,14,.35)',
        opacity: show ? 1 : 0,
        transform: show ? (hover ? 'translateY(-6px) scale(1.08)' : 'none') : 'translateY(20px) scale(.6)',
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity .35s, transform .35s cubic-bezier(.2,.8,.3,1.5), box-shadow .35s',
      }}
    >
      {/* patinha */}
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
        <ellipse cx="12" cy="16" rx="5.2" ry="4.2" />
        <circle cx="6" cy="10.5" r="2.1" />
        <circle cx="10" cy="7.5" r="2.1" />
        <circle cx="14" cy="7.5" r="2.1" />
        <circle cx="18" cy="10.5" r="2.1" />
      </svg>
    </button>
  )
}

export default BackToTop