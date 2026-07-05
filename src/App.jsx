import { Routes, Route } from 'react-router-dom'
import BackToTop from './components/BackToTop.jsx'
import Home from './pages/Home.jsx'
import Sobre from './pages/Sobre.jsx'
import Adocao from './pages/Adocao.jsx'
import Adotar from './pages/Adotar.jsx'
import Servicos from './pages/Servicos.jsx'
import Produtos from './pages/Produtos.jsx'
import Veterinaria from './pages/Veterinaria.jsx'
import Agendar from './pages/Agendar.jsx'
import TosaBanho from './pages/TosaBanho.jsx'
import Carrinho from './pages/Carrinho.jsx'
import Login from './pages/Login.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/adocao" element={<Adocao />} />
        <Route path="/adotar" element={<Adotar />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/Produtos" element={<Produtos />} />
        <Route path="/veterinaria" element={<Veterinaria />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/tosa-banho" element={<TosaBanho />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <BackToTop />
    </>
  )
}

export default App