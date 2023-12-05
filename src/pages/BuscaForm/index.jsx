import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IlhaContext } from '../../contexts/IlhasContext'
import {
  Card,
  CardHeader,
  Container,
  Input,
  LabelForm,
  SaveButton,
  TitleCard,
  SubTitleCard,
  InputContainer,
  FormContent,
} from './styles'
import { TableFilteredLixeiras } from '../../components/TableFilteredLixeiras'

export function BuscaForm() {
  const [idLixeira, setIdLixeira] = useState('')
  const [nomeLixeira, setNomeLixeira] = useState('')
  const [lixeira, setLixeira] = useState()
  const navigate = useNavigate()
  const { carregarLixeiras, lixeiras } = useContext(IlhaContext)

  const buscarLixeira = () => {
    event.preventDefault()
    carregarLixeiras()
    // let lixeira = {}
    /*
    setTimeout(() => {
      if (JSON.parse(localStorage.getItem('lixeiras')).length !== 0) {
        lixeira = JSON.parse(localStorage.getItem('lixeiras')).filter(
          (l) => l.id === idLixeira,
        )
      } */
    console.log('dentro')
    console.log(lixeiras)
    console.log('lixeira filtrada ')
    console.log(lixeira)
    navigate('/peso/' + lixeira)
    // }, 3000)
  }

  function onChangeNomeLixeiraHandler(e) {
    setIdLixeira('')
    setNomeLixeira(e.target.value)
  }

  function onChangeIdLixeiraHandler(e) {
    setNomeLixeira('')
    setIdLixeira(e.target.value)
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <TitleCard>BUSCA LIXEIRA</TitleCard>
          <SubTitleCard>
            Preencha somente um dos campos para fazer a busca da lixeira{' '}
          </SubTitleCard>
        </CardHeader>
        <div className="card-body">
          <form>
            <FormContent>
              <InputContainer>
                <LabelForm>ID. LIXEIRA</LabelForm>
                <Input
                  type="text"
                  className="form-control"
                  placeholder="ID da Lixeira"
                  onChange={onChangeIdLixeiraHandler}
                  value={idLixeira}
                />
              </InputContainer>
              <InputContainer>
                <LabelForm>CÓD. LIXEIRA</LabelForm>
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Código da Lixeira"
                  onChange={onChangeNomeLixeiraHandler}
                  value={nomeLixeira}
                />
              </InputContainer>
            </FormContent>
            <TableFilteredLixeiras
              lixeiras={JSON.parse(localStorage.getItem('lixeiras'))}
              ilhas={JSON.parse(localStorage.getItem('ilhas'))}
              nomeLixeira={nomeLixeira}
              idLixeira={idLixeira}
              lixeira={lixeira}
              setLixeira={setLixeira}
            />
            <SaveButton onClick={buscarLixeira} className="btn btn-primary">
              Buscar
            </SaveButton>
          </form>
        </div>
      </Card>
    </Container>
  )
}
