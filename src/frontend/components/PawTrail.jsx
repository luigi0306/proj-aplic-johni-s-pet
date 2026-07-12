import { useEffect, useRef } from 'react'

const CORES = ['#E8530E', '#1B888D', '#7FB9E6', '#F6B500', '#D06A8E', '#9166B8', '#7a8a2e']

function criarPatinha(x, y) {
  const patinha = document.createElement('div')
  const cor = CORES[Math.floor(Math.random() * CORES.length)]
  const rotacao = Math.random() * 100 - 50
  const tamanho = 15 + Math.random() * 11
  const deslocX = (Math.random() - 0.5) * 16
  const deslocY = (Math.random() - 0.5) * 16

  patinha.innerHTML = `
    <svg width="${tamanho}" height="${tamanho}" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="65" rx="26" ry="22" fill="${cor}" />
      <ellipse cx="22" cy="30" rx="11" ry="14" fill="${cor}" />
      <ellipse cx="46" cy="18" rx="11" ry="14" fill="${cor}" />
      <ellipse cx="72" cy="20" rx="11" ry="14" fill="${cor}" />
      <ellipse cx="90" cy="38" rx="10" ry="13" fill="${cor}" />
    </svg>
  `
  patinha.style.position = 'fixed'
  patinha.style.left = x - tamanho / 2 + deslocX + 'px'
  patinha.style.top = y - tamanho / 2 + deslocY + 'px'
  patinha.style.pointerEvents = 'none'
  patinha.style.zIndex = '999999'
  patinha.style.opacity = '1'
  patinha.style.transform = `rotate(${rotacao}deg) scale(1)`
  patinha.style.transition = 'opacity 1s ease, transform 1s ease'

  document.body.appendChild(patinha)

  void patinha.offsetWidth

  patinha.style.opacity = '0'
  patinha.style.transform = `rotate(${rotacao}deg) scale(0.25) translateY(16px)`

  setTimeout(function () {
    patinha.remove()
  }, 1000)
}

export default function PawTrail() {
  const podecriar = useRef(true)
  const contador = useRef(0)

  useEffect(function () {
    function onMove(e) {
      if (!podecriar.current) return
      podecriar.current = false

      // só cria a patinha a cada 3 movimentos, pra deixar mais espaçado
      contador.current += 1;
      if (contador.current % 3 === 0) {
        criarPatinha(e.clientX, e.clientY)
      }

      requestAnimationFrame(function () {
        podecriar.current = true
      })
    }

    window.addEventListener('mousemove', onMove)
    return function () {
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return null
}