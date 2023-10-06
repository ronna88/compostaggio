import { useContext, useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  getDoc,
  doc,
  updateDoc,
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

export function AduboForm() {
  const [composteiras, setComposteiras] = useState([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ilha, setIlha] = useState({ nome: '' })
  const [ilhas, setIlhas] = useState([])
  const [edit, setEdit] = useState(false)
  const { idAdubo } = useParams()
  const navigate = useNavigate()
  const firestore = getFirestore(app)
  const { carregarIlhas, carregarComposteiras } = useContext(IlhaContext)

  const cadastrarRetiradaAdubo = () => {
    event.preventDefault()
    let novaLixeira = {
      nome,
      descricao,
      ilha,
      created_date: new Date().toLocaleString('pt-BR'),
      updated_date: new Date().toLocaleString('pt-BR'),
    }
    addDoc(collection(firestore, 'lixeiras'), novaLixeira).then((docRef) => {
      const lixeiras = JSON.parse(localStorage.getItem('lixeiras'))
      novaLixeira = { ...novaLixeira, id: docRef.id }
      console.log(novaLixeira)
      lixeiras.push(novaLixeira)
      console.log(lixeiras)
      localStorage.setItem('lixeiras', JSON.stringify(lixeiras))
      limpaEstados()
      navigate('/lixeira')
    })
  }

  const editarRetiradaAdubo = () => {
    event.preventDefault()
    const updatedAdubo = {
      id: idAdubo,
      nome,
      descricao,
      ilha: ilha.id,
      updated_date: new Date().toLocaleString('pt-BR'),
    }

    updateDoc(doc(collection(firestore, 'adubo'), idAdubo), updatedAdubo)
      .then(() => {
        const listaAdubos = JSON.parse(localStorage.getItem('adubos')).filter(
          (adubo) => adubo.id !== idAdubo,
        )
        listaAdubos.push(updatedAdubo)
        localStorage.setItem('adubos', JSON.stringify(listaAdubos))
        limpaEstados()
        navigate('/adubo')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const limpaEstados = () => {
    setNome('')
    setDescricao('')
    setIlha({ nome: '' })
  }

  const buscarComposteiras = () => {
    if (!localStorage.getItem('composteiras')) {
      carregarComposteiras()
    }

    if (!composteiras) {
      setComposteiras(JSON.parse(localStorage.getItem('composteiras')))
    }
  }

  useEffect(() => {
    if (idAdubo) {
      setEdit(true)
      buscarComposteiras()
    }
    if (
      !localStorage.getItem('composteiras') ||
      localStorage.getItem('composteiras').length === 0
    ) {
      buscarComposteiras()
    }
    if (localStorage.getItem('composteiras')) {
      setComposteiras(JSON.parse(localStorage.getItem('composteiras')))
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
                value={ilha.id}
              >
                <option>Selecione a Ilha...</option>
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
              <SaveButton onClick={editarLixeira} className="btn btn-primary">
                Salvar
              </SaveButton>
            )}
          </form>
        </div>
      </Card>
    </Container>
  )
}
