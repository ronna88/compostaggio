import { Navigate, Route, Routes } from 'react-router-dom'
import { IlhasForm } from './pages/IlhasForm'
import { Listagem } from './pages/Listagem'
import { Table } from './components/Table'
import { LixeirasForm } from './pages/LixeirasForm'
import { useState, useEffect, useContext } from 'react'
import { IlhaContext } from './contexts/IlhasContext'
import { BuscaForm } from './pages/BuscaForm'
import { AduboForm } from './pages/AduboForm'
import { PesoForm } from './pages/PesoForm'
import { DefaultLayout } from './layout/DefaultLayout'
import { ListaIlhas } from './components/ListaIlhas'
import { ListaLixeiras } from './components/ListaLixeiras'
import { ComposteiraForm } from './pages/ComposteirasForm'
import { ListaComposteira } from './components/ListaComposteiras'
import { Monitoramento } from './components/Monitoramento'
import { Login } from './pages/Login'
import Cookies from 'js-cookie'


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

  function PrivateRoute({ children }) {
    if (Cookies.get('compostagio-auth')) {
      return <>{children}</>
    } else {
      return <Navigate to="/" />
    }
  }

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Login />} />
        <Route
          path="/cadastro-ilha"
          element={
            <PrivateRoute>
              <IlhasForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/ilha/:idIlha"
          element={
            <PrivateRoute>
              <IlhasForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/ilha"
          element={
            <PrivateRoute>
              <ListaIlhas />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastro-lixeira"
          element={
            <PrivateRoute>
              <LixeirasForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/lixeira/:idLixeira"
          element={
            <PrivateRoute>
              <LixeirasForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/lixeira"
          element={
            <PrivateRoute>
              <ListaLixeiras />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastro-composteira"
          element={
            <PrivateRoute>
              <ComposteiraForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/composteira/:idComposteira"
          element={
            <PrivateRoute>
              <ComposteiraForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/composteira"
          element={
            <PrivateRoute>
              <ListaComposteira />
            </PrivateRoute>
          }
        />
        <Route
          path="/busca"
          element={
            <PrivateRoute>
              <BuscaForm lixeiras={lixeiras} />
            </PrivateRoute>
          }
        />
        <Route
          path="/retirada"
          element={
            <PrivateRoute>
              <AduboForm lixeiras={lixeiras} />
            </PrivateRoute>
          }
        />
        <Route
          path="/peso/:idLixeira"
          element={
            <PrivateRoute>
              <PesoForm />
            </PrivateRoute>
          }
        />
           <Route
          path="/despejo"
          element={
            <PrivateRoute>
              <DespejoForm />
            </PrivateRoute>
          }
        /> 
        <Route
          path="/monitoramento"
          element={
            <PrivateRoute>
              <Monitoramento />
            </PrivateRoute>
          }
        />

      </Route>
    </Routes>
  )
}
