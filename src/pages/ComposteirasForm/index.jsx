import { useEffect, useState, useContext } from 'react'
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
import { AuthContext } from '../../contexts/AuthContext'
import { IlhaContext } from '../../contexts/IlhasContext'
import { toast } from 'react-toastify'

export function ComposteiraForm() {
  const [nome, setNome] = useState('')
  const firestore = getFirestore(app)
  const { usuario } = useContext(AuthContext)
  const [edit, setEdit] = useState(false)
  const { idComposteira } = useParams()
  const { carregarComposteirasServer, composteiras } = useContext(IlhaContext)

  const navigate = useNavigate()

  const buscarComposteira = async () => {
    if (composteiras.length !== 0) {
      const composteira = composteiras.find((l) => l.id === idComposteira)
      setNome(composteira.nome)
    } else {
      const docRef = doc(firestore, 'composteiras', idComposteira)
      const docSnap = await getDoc(docRef)
      setNome(docSnap.data().nome)
    }
  }

  useEffect(() => {
    if (idComposteira) {
      setEdit(true)
      buscarComposteira()
    }
  }, [])

  const cadastrarComposteira = () => {
    event.preventDefault()

    if (!nome || !usuario) {
      toast.warning('Por favor, preencha todos os campos.')
      return
    }

    const novaComposteira = {
      nome,
      usuario: usuario.email,
      updated_date: new Date().toLocaleString('pt-BR'),
      created_date: new Date().toLocaleString('pt-BR'),
    }

    addDoc(collection(firestore, 'composteiras'), novaComposteira)
      .then((docRef) => {
        carregarComposteirasServer()
        limpaEstados()
        toast.success('Composteira cadastrada com sucesso.')
        navigate('/composteira')
      })
      .catch((error) => {
        toast.error(`Erro ao cadastrar composteira. ${error}`)
        limpaEstados()
        navigate('/composteira')
      })
  }

  const editarComposteira = () => {
    event.preventDefault()

    if (!idComposteira || !nome || !usuario) {
      toast.warning('Por favor, preencha todos os campos.')
      return
    }

    const updatedComposteira = {
      id: idComposteira,
      nome,
      usuario: usuario.email,
      updated_date: new Date().toLocaleString('pt-BR'),
    }

    updateDoc(
      doc(collection(firestore, 'composteiras'), idComposteira),
      updatedComposteira,
    )
      .then(() => {
        limpaEstados()
        carregarComposteirasServer()
        toast.success('Composteira atualizada com sucesso.')
        navigate('/composteira')
      })
      .catch((error) => {
        toast.error(`Erro ao cadastrar composteira.${error}`)
        limpaEstados()
        console.log(error)
        navigate('/composteira')
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
                placeholder="Nome da Composteira"
                onChange={(e) => {
                  setNome(e.target.value)
                }}
                value={nome}
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
