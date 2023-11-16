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
} from './styles'

export function BuscaForm() {
  const [idLixeira, setIdLixeira] = useState()
  // const [lixeiras, setLixeiras] = useState()
  const navigate = useNavigate()
  const { carregarLixeiras, lixeiras } = useContext(IlhaContext)

  const buscarLixeira = () => {
    event.preventDefault()
    console.log('buscar')
    if (
      !localStorage.getItem('lixeiras') ||
      JSON.parse(localStorage.getItem('lixeiras')).length === 0
    ) {
      carregarLixeiras()
      // setLixeiras(JSON.parse(localStorage.getItem('lixeiras')))
    } else {
      // localStorage lixeiras ja existe.
    }
    console.log(JSON.parse(localStorage.getItem('lixeiras')))
    // setLixeiras(JSON.parse(localStorage.getItem('lixeiras')))

    setTimeout(() => {
      console.log('dentro')
      console.log(lixeiras)
      const lixeira = lixeiras.filter((l) => l.id === idLixeira)
      console.log('lixeira filtrada ')
      navigate('/peso/' + lixeira[0].id)
    }, 3000)
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <TitleCard>BUSCA LIXEIRA</TitleCard>
        </CardHeader>
        <div className="card-body">
          <form>
            <div className="mb-2">
              <LabelForm>CÓD. LIXEIRA</LabelForm>
              <Input
                type="text"
                className="form-control"
                placeholder="Código da Lixeira"
                onChange={(e) => setIdLixeira(e.target.value)}
                value={idLixeira}
              />
            </div>
            <SaveButton onClick={buscarLixeira} className="btn btn-primary">
              Buscar
            </SaveButton>
          </form>
        </div>
      </Card>
    </Container>
  )
}
