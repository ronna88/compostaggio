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

export function Header() {
  return (
    <ContainerHeader>
      <ContentHeader>
        <ButtonMenu>
          <Recycle />
          <span>CADASTRO DE LIXEIRA</span>
        </ButtonMenu>
        <ButtonMenu>
          <Trash />
          <span>LISTAGEM DE LIXEIRA</span>
        </ButtonMenu>
        <ButtonMenu>
          <PlusSquare />
          <span>CADASTRO DE ILHA</span>
        </ButtonMenu>
        <ButtonMenu>
          <ListDashes />
          <span>LISTAGEM DE ILHA</span>
        </ButtonMenu>
        <img src={IMGLogo} alt="Logo Reciclagem" width={150} />

        <ButtonMenu>
          <ListDashes />
          <span>DADOS DE MONITORIAMENTO</span>
        </ButtonMenu>
        <ButtonMenu>
          <FileText />
          <span>CADASTRO DE COMPOSTEIRA</span>
        </ButtonMenu>
        <ButtonMenu>
          <ListDashes />
          <span>LISTA DE COMPOSTEIRA</span>
        </ButtonMenu>
        <ButtonMenu>
          <UserSquare />
          <span>LOGIN</span>
        </ButtonMenu>
      </ContentHeader>
    </ContainerHeader>
  )
}
