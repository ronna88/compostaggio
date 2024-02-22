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
import { DespejoForm } from './pages/DespejoForm'
import { ListaPesagens } from './components/ListaPesagens'

export function Router() {

  function PrivateRoute({ children }) {
    if (Cookies.get('compostagio-auth')) {
      return <>{children}</>
    } else {
      return <Navigate to="/login" />
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DefaultLayout />
          </PrivateRoute>
        }
      >
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
              <BuscaForm  />
            </PrivateRoute>
          }
        />
        <Route
          path="/retirada"
          element={
            <PrivateRoute>
              <AduboForm  />
            </PrivateRoute>
          }
        />
        <Route
          path="/rota"
          element={
            <PrivateRoute>
              <ListaPesagens />
            </PrivateRoute>
          }
        />
        <Route
          path="/rota/:idRota"
          element={
            <PrivateRoute>
              <PesoForm />
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
