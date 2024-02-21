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
import { toast } from 'react-toastify'

export function BuscaForm() {
  const [idLixeira, setIdLixeira] = useState('')
  const [nomeLixeira, setNomeLixeira] = useState('')
  const [lixeira, setLixeira] = useState()
  const navigate = useNavigate()
  const { carregarLixeiras, lixeiras, ilhas, carregarLixeirasServer } = useContext(IlhaContext)

  const buscarLixeira = () => {
    event.preventDefault()
    // carregarLixeiras()
    if (!lixeira || lixeira === 'Selecione a lixeira') {
      toast.error('Lixeira não Selecionada!')
    } else {
      console.log(lixeira)
      navigate('/peso/' + lixeira)
    }
  }

  function onChangeNomeLixeiraHandler(e) {
    setIdLixeira('')
    setNomeLixeira(e.target.value)
  }

  function onChangeIdLixeiraHandler(e) {
    setNomeLixeira('')
    setIdLixeira(e.target.value)
  }

  useEffect(() => {
    if (lixeiras.length === 0) {
      carregarLixeirasServer()
    }
  }, [lixeiras])

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
              lixeiras={lixeiras}
              ilhas={ilhas}
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
