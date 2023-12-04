import { useContext, useEffect, useState } from 'react'
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
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/AuthContext'

export function PesoForm() {
  const [rota, setRota] = useState('')
  const [peso, setPeso] = useState('')
  const [date, setDate] = useState(new Date())
  const navigate = useNavigate()
  const { idLixeira } = useParams()
  const firestore = getFirestore(app)

  const { usuario } = useContext(AuthContext)

  const salvarRota = () => {
    event.preventDefault()

    const novaRota = {
      peso,
      date,
      idLixeira,
      livre: 'sim',
    }
    if (!peso || !date) {
      toast.warning('Por favor, preencha todos os campos.')
      return
    }
    addDoc(collection(firestore, 'rotas'), novaRota)
      .then((docRef) => {
        toast.success('Peso cadastrado com sucesso.')
        console.log(docRef.id)
      })
      .catch((error) => {
        toast.error('Erro ao cadastrar peso da lixeira.')
        console.log(error)
      })

    setTimeout(() => {
      limpaEstados()
      navigate('/busca')
    }, 1000)
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
            <div className="mb-3">
              <LabelForm className="form-label">USUARIO:</LabelForm>
              <Input
                type="text"
                className="form-control"
                disabled
                value={usuario ? usuario.email : ''}
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
