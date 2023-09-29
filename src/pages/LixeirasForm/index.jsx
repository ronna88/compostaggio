import { useContext, useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  getDoc,
  doc,
} from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import { IlhaContext } from '../../contexts/IlhasContext'
import {
  Card,
  CardHeader,
  Container,
  Input,
  LabelForm,
  SaveButton,
  SelectForm,
  TitleCard,
} from './styles'

export function LixeirasForm() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ilha, setIlha] = useState({ nome: '' })
  const [ilhas, setIlhas] = useState([])
  const [edit, setEdit] = useState(false)
  const { idLixeira } = useParams()
  const navigate = useNavigate()
  const firestore = getFirestore(app)
  const { carregarIlhas } = useContext(IlhaContext)

  const buscarLixeira = async () => {
    const docRef = doc(firestore, 'lixeiras', idLixeira)
    const docSnap = await getDoc(docRef)
    console.log(docSnap.data())
    setNome(docSnap.data().nome)
    setDescricao(docSnap.data().descricao)
    buscarIlha(docSnap.data().ilha)
  }

  const buscarIlha = async (idIlha) => {
    const docRef = doc(firestore, 'ilhas', idIlha)
    const docSnap = await getDoc(docRef)
    console.log(docSnap.data())
    setIlha({ ...ilha, nome: docSnap.data().nome })
  }

  const cadastrarLixeira = () => {
    event.preventDefault()
    const novaLixeira = {
      nome,
      descricao,
      ilha,
    }
    console.log(novaLixeira)
    addDoc(collection(firestore, 'lixeiras'), novaLixeira).then((docRef) => {
      console.log(docRef.id)
    })
    limpaEstados()
    navigate('/lixeira')
  }

  const limpaEstados = () => {
    setNome('')
    setDescricao('')
    setIlha({ nome: '' })
  }

  useEffect(() => {
    if (idLixeira) {
      setEdit(true)
      buscarLixeira()
    }
    if (
      !localStorage.getItem('ilhas') ||
      localStorage.getItem('ilhas').length === 0
    ) {
      carregarIlhas()
    }
    if (localStorage.getItem('ilhas')) {
      setIlhas(JSON.parse(localStorage.getItem('ilhas')))
    }
  }, [])

  return (
    <Container>
      <Card>
        <CardHeader>
          {!edit ? (
            <TitleCard>CADASTRAR LIXEIRAS</TitleCard>
          ) : (
            <TitleCard>EDITAR LIXEIRA</TitleCard>
          )}
        </CardHeader>
        <div className="card-body">
          <form>
            <div className="mb-2">
              <LabelForm>NOME:</LabelForm>
              <Input
                type="text"
                className="form-control"
                placeholder="Nome da Lixeira"
                onChange={(e) => {
                  setNome(e.target.value)
                }}
                value={nome}
              />
            </div>
            <div className="mb-2">
              <LabelForm>DESCRIÇÃO:</LabelForm>
              <Input
                type="text"
                className="form-control"
                placeholder="Descrição da Lixeira"
                onChange={(e) => setDescricao(e.target.value)}
                value={descricao}
              />
            </div>
            <div className="mb-3">
              <LabelForm>ILHA:</LabelForm>
              <SelectForm
                className="form-select"
                onChange={(e) => setIlha(e.target.value)}
              >
                <option selected>Selecione a Ilha...</option>
                {ilhas.map((i) => {
                  return (
                    <option key={i.id} value={i.id}>
                      {i.nome}
                    </option>
                  )
                })}
              </SelectForm>
            </div>
            {!edit ? (
              <SaveButton
                onClick={cadastrarLixeira}
                className="btn btn-primary"
              >
                Cadastrar
              </SaveButton>
            ) : (
              <SaveButton
                onClick={cadastrarLixeira}
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
