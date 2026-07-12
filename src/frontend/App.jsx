import { Routes, Route } from 'react-router-dom'
import BackToTop from './components/BackToTop.jsx'
import PawTrail from './components/PawTrail.jsx'
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
import LoginFuncionario from './pages/LoginFuncionario.jsx'
import Prontuario from './pages/Prontuario.jsx'
import Agendamentos from './pages/Agendamentos.jsx'
import Insumos from './pages/Insumos.jsx'
import Equipe from './pages/Equipe.jsx'
import Limpeza from './pages/Limpeza.jsx'
import Relatorio from './pages/Relatorio.jsx'
import SolicitacoesAdocao from './pages/SolicitacoesAdocao.jsx'
import ClientesPets from './pages/ClientesPets.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/adocao" element={<Adocao />} />
        <Route path="/adotar" element={<Adotar />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/veterinaria" element={<Veterinaria />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/tosa-banho" element={<TosaBanho />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/login" element={<Login />} />

        <Route path="/funcionario/login" element={<LoginFuncionario />} />
        <Route path="/funcionario/prontuario" element={<Prontuario />} />
        <Route path="/funcionario/clientes-pets" element={<ClientesPets />} />
        <Route path="/funcionario/agendamentos" element={<Agendamentos />} />
        <Route path="/funcionario/insumos" element={<Insumos />} />
        <Route path="/funcionario/equipe" element={<Equipe />} />
        <Route path="/funcionario/limpeza" element={<Limpeza />} />
        <Route path="/funcionario/relatorio" element={<Relatorio />} />
        <Route path="/funcionario/adocoes" element={<SolicitacoesAdocao />} />
      </Routes>
      <BackToTop />
      <PawTrail />
    </>
  )
}

export default App