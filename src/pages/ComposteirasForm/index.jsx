import { useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  Card,
  CardHeader,
  Container,
  TitleCard,
  SaveButton,
  Input,
  LabelForm,
} from './styles'
import { useNavigate, useParams } from 'react-router-dom'

export function ComposteiraForm() {
  const [nome, setNome] = useState('')
  const firestore = getFirestore(app)

  const [edit, setEdit] = useState(false)
  const { idComposteira } = useParams()

  const navigate = useNavigate()

  const buscarComposteira = async () => {
    const docRef = doc(firestore, 'composteiras', idComposteira)
    const docSnap = await getDoc(docRef)
    console.log(docSnap.data())
    setNome(docSnap.data().nome)
  }

  useEffect(() => {
    if (idComposteira) {
      setEdit(true)
      buscarComposteira()
    }
  }, [])

  const cadastrarComposteira = () => {
    event.preventDefault()

    let novaComposteira = {
      nome,
      updated_date: new Date().toLocaleString('pt-BR'),
      created_date: new Date().toLocaleString('pt-BR'),
    }
    console.log(novaComposteira)
    addDoc(collection(firestore, 'composteiras'), novaComposteira).then(
      (docRef) => {
        const composteiras = JSON.parse(localStorage.getItem('composteiras'))
        novaComposteira = { ...novaComposteira, id: docRef.id }
        console.log(novaComposteira)
        composteiras.push(novaComposteira)
        console.log(composteiras)
        localStorage.setItem('composteiras', JSON.stringify(composteiras))
        limpaEstados()
        navigate('/composteira')
      },
    )
    limpaEstados()
  }

  const editarComposteira = () => {
    event.preventDefault()

    const updatedComposteira = {
      id: idComposteira,
      nome,
      updated_date: new Date().toLocaleString('pt-BR'),
    }

    updateDoc(
      doc(collection(firestore, 'composteiras'), idComposteira),
      updatedComposteira,
    )
      .then(() => {
        console.log('Composteira atualizada')
        const composteiras = JSON.parse(
          localStorage.getItem('composteiras'),
        ).filter((composteira) => composteira.id !== idComposteira)
        console.log(composteiras)
        composteiras.push(updatedComposteira)
        localStorage.setItem('composteiras', JSON.stringify(composteiras))
        limpaEstados()
        navigate('/composteira')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const limpaEstados = () => {
    setNome('')
    navigate('/composteira')
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          {!edit ? (
            <TitleCard>CADASTRAR COMPOSTEIRA</TitleCard>
          ) : (
            <TitleCard>EDITAR COMPOSTEIRA</TitleCard>
          )}
        </CardHeader>
        <div className="card-body">
          <form>
            <div className="mb-2">
              <LabelForm className="form-label">NOME:</LabelForm>
              <Input
                type="text"
                className="form-control"
                placeholder="Nome da Ilha"
                onChange={(e) => {
                  setNome(e.target.value)
                }}
                value={nome}
              />
            </div>

            {!edit ? (
              <SaveButton
                onClick={cadastrarComposteira}
                className="btn btn-primary"
              >
                Cadastrar
              </SaveButton>
            ) : (
              <SaveButton
                onClick={editarComposteira}
                className="btn btn-primary"
              >
                Salvar
              </SaveButton>
            )}
          </form>
        </div>
      </Card>
    </Container>
  )
}