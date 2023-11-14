import { Link } from 'react-router-dom'
import { ContainerFooter, ContainerLinks } from './styles'

export function Footer() {
  return (
    <ContainerFooter>
      <ContainerLinks>
        <Link to="/busca">Pesagem de lixeira</Link>
        <Link to="/despejo">Despejo na composteira</Link>
        <Link to="/retirada">Retirada de adubo</Link>
      </ContainerLinks>
      <p>reCICLO Sistema 1.0 - 2023</p>
    </ContainerFooter>
  )
}
