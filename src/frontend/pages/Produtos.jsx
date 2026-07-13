import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'

function useParallax(speed) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * speed)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])
  return offset
}

function FadeZoomCard({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.9)',
        transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const API_BASE = 'http://localhost:3000/api'

function normalizarTexto(txt) {
  return txt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const navStyle = { fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', padding: '8px 16px', borderRadius: 30, background: 'rgba(255,255,255,.55)' }
const footLink = { color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }
const money = (n) => 'R$ ' + n.toFixed(2).replace('.', ',')

const CATS = {
  dog:     { label: 'Cachorro', color: '#E8530E' },
  cat:     { label: 'Gato', color: '#1B6FB0' },
  bird:    { label: 'Pássaro', color: '#7a8a2e' },
  hamster: { label: 'Hamster', color: '#C99B2E' },
}
const SEC = {
  food:  { label: 'Alimentação', bg: '#E7EDD3' },
  bath:  { label: 'Banho', bg: '#DDE7F4' },
  toy:   { label: 'Brinquedos', bg: '#EADFF2' },
  acc:   { label: 'Acessórios', bg: '#F6DCD0' },
  roupa: { label: 'Roupinhas', bg: '#F7D6E0' },
}
const SEC_ORDER = ['food', 'bath', 'toy', 'acc', 'roupa']

const CATALOG = [
  { id: 'd1', cat: 'dog', sec: 'food', kind: 'Ração', name: 'Ração Pedigree Adulto 10kg', price: 89.9, img: '/imagens/ração.jpg' },
  { id: 'd2', cat: 'dog', sec: 'food', kind: 'Ração', name: 'Ração Golden Fórmula Cães', price: 129.9, img: '/imagens/rac2.jpg' },
  { id: 'd3', cat: 'dog', sec: 'food', kind: 'Ração', name: 'Ração Premier Raças Pequenas', price: 114.9, img: '/imagens/rac4.jpg' },
  { id: 'd4', cat: 'dog', sec: 'food', kind: 'Ração', name: 'Ração GranPlus Filhotes', price: 98.9, img: '/imagens/rac5.jpg' },
  { id: 'd27', cat: 'dog', sec: 'food', kind: 'Ração', name: 'Ração Special Senior 10kg', price: 104.9, img: '/imagens/rac6.jpg' },
  { id: 'd5', cat: 'dog', sec: 'food', kind: 'Petisco', name: 'Petisco Doguitos Carne', price: 12.9, img: '/imagens/petiscach.jpg' },
  { id: 'd28', cat: 'dog', sec: 'food', kind: 'Petisco', name: 'Petisco Sticks de Frango', price: 13.9, img: '/imagens/petisccach2.jpg' },
  { id: 'd29', cat: 'dog', sec: 'food', kind: 'Petisco', name: 'Petisco Bifinho Tradicional', price: 11.9, img: '/imagens/petisccach3.jpg' },
  { id: 'd6', cat: 'dog', sec: 'bath', kind: 'Higiene', name: 'Shampoo Neutro Sanol', price: 24.9, img: '/imagens/shampocac1.jpg' },
  { id: 'd7', cat: 'dog', sec: 'bath', kind: 'Higiene', name: 'Condicionador Pelo Brilhante', price: 27.9, img: '/imagens/shampocac2.jpg' },
  { id: 'd30', cat: 'dog', sec: 'bath', kind: 'Higiene', name: 'Perfume Pet Floral', price: 19.9, img: '/imagens/shampocac3.jpg' },
  { id: 'd31', cat: 'dog', sec: 'bath', kind: 'Higiene', name: 'Shampoo Antipulgas', price: 29.9, img: '/imagens/shampocac4.jpg' },
  { id: 'd8', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Bolinha Maciça', price: 14.9, img: '/imagens/brinque6.jpg' },
  { id: 'd9', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Osso de Nylon', price: 22.9, img: '/imagens/brinque7.jpg' },
  { id: 'd10', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Mordedor de Corda', price: 18.9, img: '/imagens/brinque8.jpg' },
  { id: 'd11', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Frisbee de Borracha', price: 26.9, img: '/imagens/brinque22.jpg' },
  { id: 'd12', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Pelúcia com Apito', price: 21.9, img: '/imagens/brinque23.jpg' },
  { id: 'd13', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Kong Recheável', price: 44.9, img: '' },
  { id: 'd14', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Disco Voador', price: 19.9, img: '' },
  { id: 'd15', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Pato de Vinil', price: 16.9, img: '' },
  { id: 'd16', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Bola com Guizo', price: 15.9, img: '' },
  { id: 'd17', cat: 'dog', sec: 'toy', kind: 'Brinquedo', name: 'Puxador Dental', price: 23.9, img: '' },
  { id: 'd18', cat: 'dog', sec: 'acc', kind: 'Acessório', name: 'Coleira Peitoral + Guia', price: 54.9, img: '/imagens/coleircach1.jpg' },
  { id: 'd32', cat: 'dog', sec: 'acc', kind: 'Acessório', name: 'Coleira Ajustável Nylon', price: 24.9, img: '/imagens/coleircach2.jpg' },
  { id: 'd33', cat: 'dog', sec: 'acc', kind: 'Acessório', name: 'Guia Retrátil 5m', price: 44.9, img: '/imagens/coleircach3.jpg' },
  { id: 'd34', cat: 'dog', sec: 'acc', kind: 'Acessório', name: 'Coleira com Placa de Identificação', price: 19.9, img: '/imagens/coleicach4.jpg' },
  { id: 'd19', cat: 'dog', sec: 'acc', kind: 'Acessório', name: 'Cama Fofa Redonda', price: 119.9, img: '' },
  { id: 'd20', cat: 'dog', sec: 'acc', kind: 'Acessório', name: 'Comedouro Duplo Inox', price: 49.9, img: '' },
  { id: 'd21', cat: 'dog', sec: 'acc', kind: 'Acessório', name: 'Casinha de Madeira', price: 189.9, img: '' },
  { id: 'd22', cat: 'dog', sec: 'roupa', kind: 'Roupinha', name: 'Roupinha de Frio Xadrez', price: 39.9, img: '/imagens/roupadog1.jpg' },
  { id: 'd23', cat: 'dog', sec: 'roupa', kind: 'Roupinha', name: 'Moletom Canino Cinza', price: 44.9, img: '/imagens/roupadog2.jpg' },
  { id: 'd24', cat: 'dog', sec: 'roupa', kind: 'Roupinha', name: 'Capa de Chuva Impermeável', price: 49.9, img: '/imagens/roupadog3.jpg' },
  { id: 'd25', cat: 'dog', sec: 'roupa', kind: 'Roupinha', name: 'Vestido Pet com Laço', price: 42.9, img: '/imagens/roupadog4.jpg' },
  { id: 'd26', cat: 'dog', sec: 'roupa', kind: 'Roupinha', name: 'Suéter Listrado Quentinho', price: 38.9, img: '/imagens/roupadog5.jpg' },
  { id: 'c1', cat: 'cat', sec: 'food', kind: 'Ração', name: 'Ração Whiskas Sabor Peixe', price: 74.9, img: '/imagens/racgat1.jpg' },
  { id: 'c2', cat: 'cat', sec: 'food', kind: 'Ração', name: 'Ração Golden Special Gatos', price: 69.9, img: '/imagens/racgato2.jpg' },
  { id: 'c3', cat: 'cat', sec: 'food', kind: 'Ração', name: 'Ração Premier Gatos Castrados', price: 99.9, img: '/imagens/racgato3.jpg' },
  { id: 'c4', cat: 'cat', sec: 'food', kind: 'Ração', name: 'Ração GranPlus Gatos', price: 64.9, img: '/imagens/racgato4.jpg' },
  { id: 'c23', cat: 'cat', sec: 'food', kind: 'Ração', name: 'Ração Fancy Feast Filhotes', price: 79.9, img: '/imagens/racgato5.jpg' },
  { id: 'c24', cat: 'cat', sec: 'food', kind: 'Ração', name: 'Ração Special Gatos Idosos', price: 84.9, img: '/imagens/racgato6.jpg' },
  { id: 'c5', cat: 'cat', sec: 'food', kind: 'Petisco', name: 'Petisco Whiskas Saúde', price: 9.9, img: '/imagens/petiscgat1.jpg' },
  { id: 'c25', cat: 'cat', sec: 'food', kind: 'Petisco', name: 'Petisco Cream Malte', price: 10.9, img: '/imagens/petiscgat2.jpg' },
  { id: 'c26', cat: 'cat', sec: 'food', kind: 'Petisco', name: 'Petisco Snacks de Salmão', price: 11.9, img: '/imagens/petiscgat3.jpg' },
  { id: 'c6', cat: 'cat', sec: 'bath', kind: 'Higiene', name: 'Shampoo Sanol Gatos', price: 26.9, img: '/imagens/shampogat1.jpg' },
  { id: 'c7', cat: 'cat', sec: 'bath', kind: 'Higiene', name: 'Lenços Umedecidos Pet', price: 15.9, img: '/imagens/shampogat2.jpg' },
  { id: 'c27', cat: 'cat', sec: 'bath', kind: 'Higiene', name: 'Perfume Felino', price: 18.9, img: '/imagens/shampogat3.jpg' },
  { id: 'c28', cat: 'cat', sec: 'bath', kind: 'Higiene', name: 'Shampoo Antipulgas Gatos', price: 28.9, img: '/imagens/shampogat4.jpg' },
  { id: 'c8', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Ratinho de Pelúcia', price: 11.9, img: '/imagens/brinque24.jpg' },
  { id: 'c9', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Varinha com Penas', price: 16.9, img: '/imagens/brinque25.jpg' },
  { id: 'c10', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Bolinha com Guizo', price: 9.9, img: '/imagens/brinque26.jpg' },
  { id: 'c11', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Coleira Laser Interativa', price: 39.9, img: '/imagens/brinqgat1.jpg' },
  { id: 'c12', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Túnel Dobrável', price: 34.9, img: '/imagens/brinquegat2.jpg' },
  { id: 'c13', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Peixe com Catnip', price: 18.9, img: '/imagens/brinquegat3.jpg' },
  { id: 'c14', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Mola Colorida', price: 8.9, img: '/imagens/brinquegat4.jpg' },
  { id: 'c15', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Almofada de Catnip', price: 19.9, img: '' },
  { id: 'c16', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Bola de Sisal', price: 12.9, img: '' },
  { id: 'c17', cat: 'cat', sec: 'toy', kind: 'Brinquedo', name: 'Circuito com Bolinha', price: 45.9, img: '' },
  { id: 'c22', cat: 'cat', sec: 'acc', kind: 'Acessório', name: 'Coleira com Guizo', price: 14.9, img: '/imagens/coleigat1.jpg' },
  { id: 'c29', cat: 'cat', sec: 'acc', kind: 'Acessório', name: 'Coleira Ajustável Gato', price: 17.9, img: '/imagens/coleigat2.jpg' },
  { id: 'c30', cat: 'cat', sec: 'acc', kind: 'Acessório', name: 'Guia para Gatos', price: 29.9, img: '/imagens/coleigat3.jpg' },
  { id: 'c31', cat: 'cat', sec: 'acc', kind: 'Acessório', name: 'Coleira com Sininho', price: 13.9, img: '/imagens/coleigat4.jpg' },
  { id: 'c18', cat: 'cat', sec: 'acc', kind: 'Acessório', name: 'Arranhador Torre', price: 149.9, img: '' },
  { id: 'c19', cat: 'cat', sec: 'acc', kind: 'Acessório', name: 'Caixa de Areia com Bordas', price: 59.9, img: '' },
  { id: 'c20', cat: 'cat', sec: 'acc', kind: 'Acessório', name: 'Comedouro de Cerâmica', price: 34.9, img: '' },
  { id: 'c21', cat: 'cat', sec: 'acc', kind: 'Acessório', name: 'Cama Iglu Fechada', price: 89.9, img: '' },
  { id: 'c32', cat: 'cat', sec: 'roupa', kind: 'Roupinha', name: 'Moletom Felino', price: 34.9, img: '/imagens/roupagat1.jpg' },
  { id: 'c33', cat: 'cat', sec: 'roupa', kind: 'Roupinha', name: 'Vestido para Gatos', price: 32.9, img: '/imagens/roupagat2.jpg' },
  { id: 'c34', cat: 'cat', sec: 'roupa', kind: 'Roupinha', name: 'Suéter Gatinho', price: 29.9, img: '/imagens/roupagat3.jpg' },
  { id: 'c35', cat: 'cat', sec: 'roupa', kind: 'Roupinha', name: 'Capa de Chuva Felina', price: 36.9, img: '/imagens/roupagat4.jpg' },
  { id: 'c36', cat: 'cat', sec: 'roupa', kind: 'Roupinha', name: 'Roupinha de Frio Gato', price: 33.9, img: '/imagens/roupagat5.jpg' },
  { id: 'b1', cat: 'bird', sec: 'food', kind: 'Sementes', name: 'Mix de Sementes Premium', price: 18.9, img: '/imagens/racpass1.jpg' },
  { id: 'b2', cat: 'bird', sec: 'food', kind: 'Ração', name: 'Ração Farinhada Trinca-Ferro', price: 24.9, img: '/imagens/racpass2.jpg' },
  { id: 'b3', cat: 'bird', sec: 'food', kind: 'Alimento', name: 'Papa de Ovos', price: 21.9, img: '' },
  { id: 'b4', cat: 'bird', sec: 'food', kind: 'Sementes', name: 'Alpiste Selecionado', price: 14.9, img: '' },
  { id: 'b5', cat: 'bird', sec: 'food', kind: 'Petisco', name: 'Frutas Desidratadas', price: 16.9, img: '/imagens/petispass.jpg' },
  { id: 'b6', cat: 'bird', sec: 'bath', kind: 'Higiene', name: 'Banheira para Pássaros', price: 16.9, img: '/imagens/acessopass1.jpg' },
  { id: 'b7', cat: 'bird', sec: 'acc', kind: 'Acessório', name: 'Poleiro Natural de Madeira', price: 22.9, img: '/imagens/acessopass2.jpg' },
  { id: 'b10', cat: 'bird', sec: 'acc', kind: 'Acessório', name: 'Comedouro de Bico', price: 12.9, img: '/imagens/acesspass2.jpg' },
  { id: 'b8', cat: 'bird', sec: 'acc', kind: 'Acessório', name: 'Gaiola Redonda', price: 179.9, img: '/imagens/casinhapas1.jpg' },
  { id: 'b9', cat: 'bird', sec: 'acc', kind: 'Acessório', name: 'Ninho de Fibra', price: 19.9, img: '/imagens/casinhapas2.jpg' },
  { id: 'b11', cat: 'bird', sec: 'acc', kind: 'Acessório', name: 'Casinha de Madeira para Pássaros', price: 64.9, img: '/imagens/casinhapas3.jpg' },
  { id: 'b12', cat: 'bird', sec: 'acc', kind: 'Acessório', name: 'Ninho Redondo de Palha', price: 24.9, img: '/imagens/casinhapas4.jpg' },
  { id: 'b13', cat: 'bird', sec: 'acc', kind: 'Acessório', name: 'Casa Aviário Decorativa', price: 149.9, img: '/imagens/casinhapas5.jpg' },
  { id: 'h1', cat: 'hamster', sec: 'food', kind: 'Ração', name: 'Ração Hamster Completa', price: 19.9, img: '/imagens/rachams.jpg' },
  { id: 'h2', cat: 'hamster', sec: 'food', kind: 'Sementes', name: 'Mix de Grãos e Sementes', price: 16.9, img: '/imagens/rachams2.jpg' },
  { id: 'h3', cat: 'hamster', sec: 'food', kind: 'Alimento', name: 'Blocos de Feno', price: 12.9, img: '/imagens/rachams3.jpg' },
  { id: 'h14', cat: 'hamster', sec: 'food', kind: 'Ração', name: 'Ração Premium Hamster', price: 22.9, img: '/imagens/rachams4.jpg' },
  { id: 'h4', cat: 'hamster', sec: 'food', kind: 'Petisco', name: 'Petisco de Frutas', price: 9.9, img: '/imagens/petiscroed1.jpg' },
  { id: 'h5', cat: 'hamster', sec: 'food', kind: 'Petisco', name: 'Snack Crocante', price: 8.9, img: '/imagens/petisroedo2.jpg' },
  { id: 'h15', cat: 'hamster', sec: 'bath', kind: 'Higiene', name: 'Shampoo Seco para Hamster', price: 17.9, img: '/imagens/shampohams.webp' },
  { id: 'h16', cat: 'hamster', sec: 'bath', kind: 'Higiene', name: 'Perfume Roedor', price: 14.9, img: '/imagens/shamphams2.webp' },
  { id: 'h6', cat: 'hamster', sec: 'toy', kind: 'Brinquedo', name: 'Roda de Exercícios', price: 29.9, img: '/imagens/brinque1.jpg' },
  { id: 'h7', cat: 'hamster', sec: 'toy', kind: 'Brinquedo', name: 'Bola Passeadora', price: 24.9, img: '/imagens/brinque2.jpg' },
  { id: 'h8', cat: 'hamster', sec: 'toy', kind: 'Brinquedo', name: 'Túnel Colorido', price: 22.9, img: '/imagens/brinque3.jpg' },
  { id: 'h9', cat: 'hamster', sec: 'toy', kind: 'Brinquedo', name: 'Ponte de Madeira', price: 18.9, img: '/imagens/brinque4.jpg' },
  { id: 'h10', cat: 'hamster', sec: 'toy', kind: 'Brinquedo', name: 'Escada Roedora', price: 15.9, img: '/imagens/brinque5.jpg' },
  { id: 'h11', cat: 'hamster', sec: 'acc', kind: 'Acessório', name: 'Casinha de Madeira', price: 34.9, img: '' },
  { id: 'h12', cat: 'hamster', sec: 'acc', kind: 'Acessório', name: 'Bebedouro Gota', price: 14.9, img: '' },
  { id: 'h13', cat: 'hamster', sec: 'acc', kind: 'Acessório', name: 'Rodinha Silenciosa', price: 27.9, img: '' },
  { id: 'h17', cat: 'hamster', sec: 'roupa', kind: 'Roupinha', name: 'Roupinha de Frio Hamster', price: 16.9, img: '/imagens/roupahams1.jpg' },
  { id: 'h18', cat: 'hamster', sec: 'roupa', kind: 'Roupinha', name: 'Fantasia de Coelhinho', price: 18.9, img: '/imagens/roupahams2.jpg' },
  { id: 'h19', cat: 'hamster', sec: 'roupa', kind: 'Roupinha', name: 'Suéter Mini', price: 15.9, img: '/imagens/roupahams3.jpg' },
  { id: 'h20', cat: 'hamster', sec: 'roupa', kind: 'Roupinha', name: 'Capa Impermeável Mini', price: 17.9, img: '/imagens/roupahams4.jpg' },
]

function loadCart() { try { return JSON.parse(localStorage.getItem('chew_cart') || '{}') } catch { return {} } }
function saveCart(c) { try { localStorage.setItem('chew_cart', JSON.stringify(c)) } catch {} }
function isLogged() { try { return localStorage.getItem('chew_logged_in') === '1' } catch { return false } }
function doLogout() { try { localStorage.removeItem('chew_logged_in') } catch {} }

const CAT_MAP = {
  'Cachorro': 'dog',
  'Gato': 'cat',
  'Pássaro': 'bird',
  'Hamster': 'hamster'
}

const SEC_MAP = {
  'Alimentação': 'food',
  'Banho': 'bath',
  'Brinquedos': 'toy',
  'Acessórios': 'acc',
  'Roupinhas': 'roupa'
}

function Produtos() {
  const navigate = useNavigate()
  const [cat, setCat] = useState('dog')
  const [cart, setCart] = useState(loadCart())
  const [cartOpen, setCartOpen] = useState(false)
  const [svcMenu, setSvcMenu] = useState(false)
  const [logged, setLogged] = useState(isLogged())
  const parallaxOffset = useParallax(0.35)

  const [busca, setBusca] = useState('')
  const [resultadosBackend, setResultadosBackend] = useState(null)
  const [buscandoBackend, setBuscandoBackend] = useState(false)
  const [catalog, setCatalog] = useState(() => CATALOG)

  useEffect(() => {
    fetch(API_BASE + '/produtos')
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar produtos')
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id_produto,
            cat: CAT_MAP[p.especie] || 'dog',
            sec: SEC_MAP[p.secao] || 'food',
            kind: p.categoria || '',
            name: p.nome,
            price: parseFloat(p.preco),
            img: p.imagem_url,
            estoque: p.estoque_atual
          }))
          setCatalog(mapped)
        }
      })
      .catch(err => {
        console.error('Erro ao carregar produtos do backend:', err)
      })
  }, [])

  useEffect(function () {
    const termo = busca.trim()

    if (!termo) {
      setResultadosBackend(null)
      return
    }

    let cancelado = false
    setBuscandoBackend(true)

    const timer = setTimeout(function () {
      fetch(API_BASE + '/produtos/busca?termo=' + encodeURIComponent(termo))
        .then(function (res) {
          if (!res.ok) throw new Error('endpoint indisponível')
          return res.json()
        })
        .then(function (data) {
          if (!cancelado && Array.isArray(data)) {
            setResultadosBackend(data)
          }
        })
        .catch(function () {
          if (!cancelado) setResultadosBackend(null)
        })
        .finally(function () {
          if (!cancelado) setBuscandoBackend(false)
        })
    }, 350)

    return function () {
      cancelado = true
      clearTimeout(timer)
    }
  }, [busca])

  function add(p) {
    if (!isLogged()) { navigate('/login'); return }
    const id = 'prod:' + p.id
    const c = loadCart()
    const e = c[id] || { id: p.id, name: p.name, price: p.price, img: p.img, color: (CATS[p.cat] && CATS[p.cat].color) || '#E8530E', qty: 0 }
    e.qty++; c[id] = e
    saveCart(c); setCart({ ...c }); setCartOpen(true)
  }
  function inc(id) { const c = loadCart(); if (c[id]) { c[id].qty++; saveCart(c); setCart({ ...c }) } }
  function dec(id) { const c = loadCart(); if (c[id]) { c[id].qty--; if (c[id].qty <= 0) delete c[id]; saveCart(c); setCart({ ...c }) } }
  function handleLogout() { doLogout(); setLogged(false) }

  const ids = Object.keys(cart)
  const count = ids.reduce((a, id) => a + cart[id].qty, 0)
  const total = ids.reduce((a, id) => a + cart[id].qty * cart[id].price, 0)

  const termoBusca = busca.trim()
  const buscando = termoBusca.length > 0

  const resultadosBusca = buscando
    ? (resultadosBackend !== null
        ? resultadosBackend.map(p => ({
            id: p.id_produto,
            cat: CAT_MAP[p.especie] || 'dog',
            sec: SEC_MAP[p.secao] || 'food',
            kind: p.categoria || '',
            name: p.nome,
            price: parseFloat(p.preco),
            img: p.imagem_url,
            estoque: p.estoque_atual
          }))
        : catalog.filter(function (p) {
            const alvo = normalizarTexto(p.name + ' ' + p.kind)
            return alvo.includes(normalizarTexto(termoBusca))
          }))
    : []

  const sections = SEC_ORDER
    .map((s) => ({ key: s, ...SEC[s], items: catalog.filter((p) => p.cat === cat && p.sec === s) }))
    .filter((s) => s.items.length > 0)

  function ProdutoCard({ p, delay }) {
    return (
      <FadeZoomCard delay={delay}>
        <div style={{ background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 10px 26px rgba(0,0,0,.07)', display: 'flex', flexDirection: 'column', transition: 'transform .3s, box-shadow .3s' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 22px 40px rgba(0,0,0,.16)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(0,0,0,.07)' }}>
          <div style={{ position: 'relative', height: 200, background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
            <span style={{ position: 'absolute', top: 10, left: 10, background: (CATS[p.cat] && CATS[p.cat].color) || '#16313b', color: '#fff', fontWeight: 800, fontSize: 10, letterSpacing: '.5px', padding: '4px 10px', borderRadius: 30 }}>{(CATS[p.cat] && CATS[p.cat].label) || ''}</span>
            {p.img
              ? <img src={p.img} alt={p.name} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
              : <span style={{ fontSize: 13, color: '#bbb' }}>foto em breve</span>}
          </div>
          <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#aa9f88', textTransform: 'uppercase', letterSpacing: '.5px' }}>{p.kind}</span>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#16313b', margin: '2px 0 10px', lineHeight: 1.2 }}>{p.name}</span>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 20, color: '#E8530E' }}>{money(p.price)}</span>
              <button onClick={() => add(p)} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 13, color: '#fff', background: '#16313b', border: 'none', cursor: 'pointer', borderRadius: 10, padding: '9px 14px' }}>+ Add</button>
            </div>
          </div>
        </div>
      </FadeZoomCard>
    )
  }

  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh', display: 'flex', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: '100%', background: '#F7F4EE', position: 'relative' }}>

        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: '#FFD57C', borderRadius: '0 0 26px 26px', boxShadow: '0 6px 18px rgba(214,168,70,.25)', flexWrap: 'wrap', gap: 12 }}>
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
            <Link to="/adocao" style={navStyle}>Adoção</Link>
            <Link to="/produtos" style={{ ...navStyle, color: '#fff', background: '#16313b' }}>Produtos</Link>
            {!logged && <Link to="/login" style={navStyle}>Cadastro</Link>}
            {!logged && (
              <Link to="/login" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', textDecoration: 'none', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px' }}>Entre</Link>
            )}
            {logged && (
              <button onClick={handleLogout} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: '#16313b', background: 'transparent', border: '2px solid #16313b', borderRadius: 30, padding: '7px 20px', cursor: 'pointer' }}>Sair</button>
            )}
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', width: 46, height: 46, borderRadius: '50%', border: 'none', background: '#16313b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6" /></svg>
              {count > 0 && <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, padding: '0 5px', borderRadius: 20, background: '#E8530E', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFD57C' }}>{count}</span>}
            </button>
          </nav>
        </header>

        <Reveal>
          <section style={{ margin: '8px 24px 0', borderRadius: 34, overflow: 'hidden', background: 'linear-gradient(135deg,#FFE3A8 0%,#FFD57C 100%)', padding: '46px 56px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'inline-block', background: '#fff', color: '#C58A12', fontWeight: 800, fontSize: 13, letterSpacing: '1px', padding: '7px 16px', borderRadius: 30, marginBottom: 16 }}>CHEW! STORE</div>
              <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 54, lineHeight: 1, color: '#16313b', margin: '0 0 12px' }}>Tudo para o seu pet</h1>
              <p style={{ fontSize: 17, lineHeight: 1.55, color: '#5a4d2d', maxWidth: 440, margin: '0 0 24px' }}>Ração, petiscos, brinquedos e acessórios para cães, gatos, pássaros e hamsters. Qualidade que seu melhor amigo merece.</p>
              
              <a
                href="#catalogo"
                onClick={function (e) {
                  e.preventDefault()
                  const alvo = document.getElementById('catalogo')
                  if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                style={{ display: 'inline-block', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', background: '#E8530E', textDecoration: 'none', borderRadius: 14, padding: '14px 32px', cursor: 'pointer' }}
              >
                Ver catálogo
              </a>
            </div>
            <div style={{ flex: '0 0 300px', height: 250, borderRadius: 26, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 18px 40px rgba(0,0,0,.18)', transform: `translateY(${-parallaxOffset}px)` }}>
              <img src="/imagens/produprin.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section id="catalogo" style={{ padding: '44px 40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 36, color: '#16313b', margin: '0 0 8px' }}>Nosso catálogo</h2>
              <p style={{ fontSize: 16, color: '#8a7d62', margin: 0 }}>Escolha o tipo de bichinho, ou busque direto pelo nome do produto.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
                <input
                  type="text"
                  value={busca}
                  onChange={function (e) { setBusca(e.target.value) }}
                  placeholder="Buscar produto (ex: ração, coleira, shampoo...)"
                  style={{
                    width: '100%',
                    height: 50,
                    borderRadius: 30,
                    border: '2px solid #e2dccd',
                    padding: '0 46px 0 20px',
                    fontSize: 15,
                    fontFamily: "'Nunito', sans-serif",
                    boxSizing: 'border-box',
                    outline: 'none',
                    background: '#fff',
                  }}
                />
                <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aa9f88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </span>
              </div>
            </div>

            {!buscando && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 34 }}>
                {Object.keys(CATS).map((k) => {
                  const on = k === cat
                  return (
                    <button key={k} onClick={() => setCat(k)} style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, cursor: 'pointer', borderRadius: 30, padding: '10px 22px', border: `2px solid ${on ? CATS[k].color : '#e2dccd'}`, background: on ? CATS[k].color : '#fff', color: on ? '#fff' : '#16313b' }}>{CATS[k].label}</button>
                  )
                })}
              </div>
            )}

            {buscando ? (
              <div style={{ marginBottom: 40 }}>
                <p style={{ textAlign: 'center', fontSize: 14, color: '#8a7d62', marginBottom: 20 }}>
                  {resultadosBusca.length} resultado(s) para "{termoBusca}"
                  {buscandoBackend ? ' — buscando no servidor...' : ''}
                </p>
                {resultadosBusca.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#aa9f88', fontSize: 15 }}>Nenhum produto encontrado. Tenta outro termo!</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
                    {resultadosBusca.map((p, i) => (
                      <ProdutoCard key={p.id} p={p} delay={(i % 4) * 80} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              sections.map((sec) => (
                <div key={sec.key} style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <span style={{ width: 44, height: 44, borderRadius: 14, background: sec.bg, flexShrink: 0 }}></span>
                    <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 26, color: '#16313b', margin: 0 }}>{sec.label}</h3>
                    <span style={{ flex: 1, height: 2, background: '#e7e2d4', borderRadius: 2 }}></span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
                    {sec.items.map((p, i) => (
                      <ProdutoCard key={p.id} p={p} delay={(i % 4) * 80} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>
        </Reveal>

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

        {cartOpen && (
          <>
            <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(22,49,59,.45)', zIndex: 40 }}></div>
            <aside style={{ position: 'fixed', top: 0, right: 0, width: 390, maxWidth: '90vw', height: '100%', background: '#fff', zIndex: 41, boxShadow: '-12px 0 40px rgba(0,0,0,.2)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', background: '#FFD57C' }}>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 22, color: '#16313b' }}>Seu carrinho</span>
                <button onClick={() => setCartOpen(false)} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.55)', cursor: 'pointer', fontSize: 18, color: '#16313b' }}>✕</button>
              </div>
              {count > 0 ? (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {ids.map((id) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 12, borderRadius: 16, background: '#F7F4EE' }}>
                        <span style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: cart[id].color || '#eee' }}></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: '#16313b', lineHeight: 1.2 }}>{cart[id].name}</div>
                          <div style={{ fontSize: 13, color: '#E8530E', fontWeight: 700 }}>{money(cart[id].price)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
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
                      <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 26, color: '#E8530E' }}>{money(total)}</span>
                    </div>
                    <Link to="/carrinho" style={{ display: 'block', textAlign: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', background: '#16313b', textDecoration: 'none', borderRadius: 14, padding: 15 }}>Ir para o carrinho</Link>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 40, textAlign: 'center' }}>
                  <p style={{ fontSize: 15, color: '#999', margin: 0 }}>Seu carrinho está vazio.<br />Escolha um produtinho para começar.</p>
                </div>
              )}
            </aside>
          </>
        )}

      </div>
    </div>
  )
}

export default Produtos