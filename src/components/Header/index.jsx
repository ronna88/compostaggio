import {
  FileText,
  ListDashes,
  PlusSquare,
  Recycle,
  Trash,
  UserSquare,
} from '@phosphor-icons/react'
import { ContainerHeader, ContentHeader, ButtonMenu } from './styles'
import IMGLogo from '../../assets/reciclagemLogo.png'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { SignOut } from '@phosphor-icons/react/dist/ssr'

export function Header() {
  const { usuario, logout } = useContext(AuthContext)

  function sair() {
    logout()
  }
  return (
    <ContainerHeader>
      <ContentHeader>
        <ButtonMenu to="/cadastro-ilha">
          <PlusSquare />
          <span>CADASTRO DE ILHA</span>
        </ButtonMenu>
        <ButtonMenu to="/ilha">
          <ListDashes />
          <span>LISTAGEM DE ILHA</span>
        </ButtonMenu>
        <ButtonMenu to="cadastro-lixeira">
          <Recycle />
          <span>CADASTRO DE LIXEIRA</span>
        </ButtonMenu>
        <ButtonMenu to="/lixeira">
          <Trash />
          <span>LISTAGEM DE LIXEIRA</span>
        </ButtonMenu>
        <img src={IMGLogo} alt="Logo Reciclagem" width={150} />

        <ButtonMenu to="monitoramento">
          <ListDashes />
          <span>DADOS DE MONITORIAMENTO</span>
        </ButtonMenu>
        <ButtonMenu to="cadastro-composteira">
          <FileText />
          <span>CADASTRO DE COMPOSTEIRA</span>
        </ButtonMenu>
        <ButtonMenu to="composteira">
          <ListDashes />
          <span>LISTA DE COMPOSTEIRA</span>
        </ButtonMenu>
        <ButtonMenu>
          {!usuario ? (
            <>
              <UserSquare /> <span>LOGIN</span>
            </>
          ) : (
            <div onClick={() => sair()}>
              <SignOut />
              <span>LOGOUT</span>
            </div>
          )}
        </ButtonMenu>
      </ContentHeader>
    </ContainerHeader>
  )
}
