import { useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  CardHeader,
  Container,
  Input,
  LabelForm,
  SaveButton,
  TitleCard,
} from './styles'

export function PesoForm() {
  const [rota, setRota] = useState('')
  const [peso, setPeso] = useState('')
  const [date, setDate] = useState(new Date())
  const navigate = useNavigate()
  const { idLixeira } = useParams()

  const firestore = getFirestore(app)

  const salvarRota = () => {
    event.preventDefault()

    const novaRota = {
      peso,
      date,
      idLixeira,
      livre: 'sim',
    }

    addDoc(collection(firestore, 'rotas'), novaRota).then((docRef) => {
      console.log(docRef.id)
    })

    limpaEstados()
    navigate('/busca')
  }

  const limpaEstados = () => {
    setRota('')
    setDate('')
    setPeso('')
  }

  useEffect(() => {
    if (date !== '') {
      setDate(new Date())
    }
  }, [])

  return (
    <Container>
      <Card>
        <CardHeader>
          <TitleCard>PESAGEM DA LIXEIRA</TitleCard>
        </CardHeader>
        <div className="card-body">
          <form>
            <div className="mb-2">
              <LabelForm className="form-label">
                PESO EM KG DA LIXEIRA
              </LabelForm>
              <Input
                type="text"
                className="form-control"
                placeholder="Peso em Kg da Lixeira"
                onChange={(e) => {
                  setPeso(e.target.value)
                }}
                value={peso}
              />
            </div>
            <div className="mb-3 react-datepicker-wrapper">
              <LabelForm className="form-label">
                DATA E HORA DA PESAGEM&nbsp;
              </LabelForm>
              <ReactDatePicker
                className="form-control "
                selected={date}
                onChange={(date) => setDate(date)}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
              />
            </div>
            <br />
            <SaveButton onClick={salvarRota} className="btn btn-primary">
              Cadastrar
            </SaveButton>
          </form>
        </div>
      </Card>
    </Container>
  )
}
