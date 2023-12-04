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
import { toast } from 'react-toastify'

export function ComposteiraForm() {
  const [nome, setNome] = useState('')
  const firestore = getFirestore(app)
  const { usuario } = useContext(AuthContext)
  const [edit, setEdit] = useState(false)
  const { idComposteira } = useParams()

  const navigate = useNavigate()

  const buscarComposteira = async () => {
    if (localStorage.getItem('composteiras')) {
      const composteira = JSON.parse(localStorage.getItem('composteiras')).find(
        (l) => l.id === idComposteira,
      )
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

    let novaComposteira = {
      nome,
      usuario: usuario.email,
      updated_date: new Date().toLocaleString('pt-BR'),
      created_date: new Date().toLocaleString('pt-BR'),
    }

    addDoc(collection(firestore, 'composteiras'), novaComposteira)
      .then((docRef) => {
        const composteiras = JSON.parse(localStorage.getItem('composteiras'))
        novaComposteira = { ...novaComposteira, id: docRef.id }

        composteiras.push(novaComposteira)
        console.log(composteiras)
        localStorage.setItem('composteiras', JSON.stringify(composteiras))
        limpaEstados()
        toast.success('Composteira cadastrada com sucesso.')
        navigate('/composteira')
      })
      .catch(() => {
        toast.error('Erro ao cadastrar composteira.')
        navigate('/composteira')
      })
    limpaEstados()
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
        console.log('Composteira atualizada')
        const composteiras = JSON.parse(
          localStorage.getItem('composteiras'),
        ).filter((composteira) => composteira.id !== idComposteira)
        console.log(composteiras)
        composteiras.push(updatedComposteira)
        localStorage.setItem('composteiras', JSON.stringify(composteiras))
        limpaEstados()
        toast.success('Composteira atualizada com sucesso.')
        navigate('/composteira')
      })
      .catch((error) => {
        toast.error('Erro ao cadastrar composteira.')
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
