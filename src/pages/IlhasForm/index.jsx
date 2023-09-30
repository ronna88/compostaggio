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

export function IlhasForm() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const firestore = getFirestore(app)

  const [edit, setEdit] = useState(false)
  const { idIlha } = useParams()

  const navigate = useNavigate()

  const buscarIlha = async () => {
    const docRef = doc(firestore, 'ilhas', idIlha)
    const docSnap = await getDoc(docRef)
    console.log(docSnap.data())
    setNome(docSnap.data().nome)
    setDescricao(docSnap.data().descricao)
  }

  useEffect(() => {
    if (idIlha) {
      setEdit(true)
      buscarIlha()
    }
  }, [])

  const cadastrarIlha = () => {
    event.preventDefault()

    const novaIlha = {
      nome,
      descricao,
      updated_date: new Date().toLocaleString('pt-BR'),
      created_date: new Date().toLocaleString('pt-BR'),
    }
    console.log(novaIlha)
    addDoc(collection(firestore, 'ilhas'), novaIlha).then((docRef) => {
      console.log(docRef.id)
    })
    limpaEstados()
  }

  const editarIlha = () => {
    event.preventDefault()

    const updatedIlha = {
      nome,
      descricao,
      updated_date: new Date().toLocaleString('pt-BR'),
    }

    updateDoc(doc(collection(firestore, 'ilhas'), idIlha), updatedIlha)
      .then(() => {
        console.log('Ilha atualizada')
        limpaEstados()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const limpaEstados = () => {
    setNome('')
    setDescricao('')
    navigate('/ilha')
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          {!edit ? (
            <TitleCard>CADASTRAR ILHA</TitleCard>
          ) : (
            <TitleCard>EDITAR ILHA</TitleCard>
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
            <div className="mb-3">
              <LabelForm className="form-label">DESCRIÇÃO:</LabelForm>
              <Input
                type="text"
                className="form-control"
                placeholder="Descrição da Ilha"
                onChange={(e) => setDescricao(e.target.value)}
                value={descricao}
              />
            </div>

            {!edit ? (
              <SaveButton onClick={cadastrarIlha} className="btn btn-primary">
                Cadastrar
              </SaveButton>
            ) : (
              <SaveButton onClick={editarIlha} className="btn btn-primary">
                Salvar
              </SaveButton>
            )}
          </form>
        </div>
      </Card>
    </Container>
  )
}
