import { Route, Routes } from 'react-router-dom'
import { IlhasForm } from './pages/IlhasForm'
import { Home } from './pages/Home'
import { Listagem } from './pages/Listagem'
import { Table } from './components/Table'
import { LixeirasForm } from './pages/LixeirasForm'
import { useState, useEffect, useContext } from 'react'
import { IlhaContext } from './contexts/IlhasContext'
import { BuscaForm } from './pages/BuscaForm'
import { PesoForm } from './pages/PesoForm'
import { DefaultLayout } from './layout/DefaultLayout'
import { ListaIlhas } from './components/ListaIlhas'
import { ListaLixeiras } from './components/ListaLixeiras'

export function Router() {
  // const [listaIlhas, setListaIlhas] = useState([]);
  const { carregarIlhas, carregarLixeiras, ilhas, lixeiras } =
    useContext(IlhaContext)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const headerLixeiras = ['id', 'nome', 'descricao', 'ilha']
  const headerIlhas = ['id', 'nome', 'descricao']

  useEffect(() => {
    if (ilhas.length === 0) {
      // carregarIlhas()
    }
    if (lixeiras.length === 0) {
      // carregarLixeiras()
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro-ilha" element={<IlhasForm />} />
        <Route path="/ilha/:idIlha" element={<IlhasForm />} />
        <Route path="/ilha" element={<ListaIlhas />} />
        <Route path="/cadastro-lixeira" element={<LixeirasForm />} />
        <Route path="/lixeira/:idLixeira" element={<LixeirasForm />} />
        <Route path="/lixeira" element={<ListaLixeiras />} />
        <Route path="/busca" element={<BuscaForm lixeiras={lixeiras} />} />
        <Route path="/peso/:idLixeira" element={<PesoForm />} />
      </Route>
    </Routes>
  )
}
