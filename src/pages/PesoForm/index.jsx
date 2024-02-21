import { useContext, useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
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
  SubTitleCard,
} from './styles'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/AuthContext'
import { IlhaContext } from '../../contexts/IlhasContext'

export function PesoForm() {
  const [edit, setEdit] = useState(false)
  const [rota, setRota] = useState('')
  const [peso, setPeso] = useState('')
  const [date, setDate] = useState(new Date())
  const [lix, setLix] = useState('')
  const navigate = useNavigate()
  const { idLixeira, idRota } = useParams()
  const firestore = getFirestore(app)

  const { usuario } = useContext(AuthContext)
  const { lixeiras, carregarRotasServer } = useContext(IlhaContext)

  const salvarRota = () => {
    event.preventDefault()

    const novaRota = {
      peso,
      date,
      idLixeira,
      livre: 'sim',
    }

    if (!peso || !date || peso === ' ' || date === ' ') {
      toast.warning('Por favor, preencha todos os campos.')
      return
    }
    addDoc(collection(firestore, 'rotas'), novaRota)
      .then((docRef) => {
        toast.success('Peso cadastrado com sucesso.')
        console.log(docRef.id)
        const idCriado = docRef.id
        carregarRotasServer()
        addDoc(collection(firestore, 'bombonaOrganica'), {peso: peso, idLixeira: idLixeira, idRota: idCriado})
        .then((docRef) => {
          toast.success('Enviado a bombona Organica')
        })
        .catch((error) => {
          console.lof(error)
          toast.error('Erro ao enviar a bombona')
        })
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

    if (window.location.pathname.includes('rota')) {
      setEdit(true)
      buscarRota(idRota)
      console.log('oi')
    }
  }, [])

  const buscarRota = async () => {
    if (localStorage.getItem('rotas')) {
      const rota = JSON.parse(localStorage.getItem('rotas')).find(
        (r) => r.id === idRota,
      )
      setPeso(rota.peso)
      setLix(rota.idLixeira)
      console.log(rota)
      console.log(rota.date?.seconds * 1000)
      if (isNaN(rota.date?.seconds * 1000)) {
        // testar
        setDate(new Date(rota.date))
      } else {
        setDate(new Date(rota.date?.seconds * 1000))
      }
    } else {
      const docRef = doc(firestore, 'rotas', idRota)
      const docSnap = await getDoc(docRef)
      setPeso(docSnap.data().nome)
      setLix(docSnap.data().idLixeira)
      // setDate(docSnap.data().date)
    }
    console.log(peso)
  }

  const editarRota = () => {
    event.preventDefault()
    const updatedRota = {
      id: idRota,
      peso,
      date: new Date(date),
      idLixeira: lix,
      usuario: usuario.email,
      updated_date: new Date().toLocaleString('pt-BR'),
    }

    updateDoc(doc(collection(firestore, 'rotas'), idRota), updatedRota)
      .then(() => {
        //const rotas = JSON.parse(localStorage.getItem('rotas')).filter(
        //  (rota) => rota.id !== idRota,
        //)
        //rotas.push(updatedRota)
        //localStorage.removeItem('rotas')
        //setTimeout(() => {
        //  localStorage.setItem('rotas', JSON.stringify(rotas))
          toast.success('Rota atualizada com sucesso.')
          carregarRotasServer()
          limpaEstados()
        //}, 2500)
        navigate('/rota')
      })
      .catch((error) => {
        toast.error(`Erro ao atualizar rota.${error}`)
        console.log(error)
      })
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <TitleCard>PESAGEM DA LIXEIRA</TitleCard>
          <SubTitleCard>
            {'COD: ' +
              lixeiras.filter((lixeira) => lixeira.id === idLixeira)[0]
                .descricao +
              ' TIPO: ' +
              lixeiras.filter((lixeira) => lixeira.id === idLixeira)[0].nome}
          </SubTitleCard>
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
                dateFormat="dd/MM/yyyy h:mm aa"
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
            {edit ? (
              <SaveButton onClick={editarRota} className="btn btn-primary">
                Atualizar
              </SaveButton>
            ) : (
              <SaveButton onClick={salvarRota} className="btn btn-primary">
                Cadastrar
              </SaveButton>
            )}
          </form>
        </div>
      </Card>
    </Container>
  )
}
