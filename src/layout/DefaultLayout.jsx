import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { ContainerDefault } from './styles'
import { Footer } from '../components/Footer'

export function DefaultLayout() {
  return (
    <ContainerDefault>
      <Header />
      <Outlet />
      <Footer />
    </ContainerDefault>
  )
}
