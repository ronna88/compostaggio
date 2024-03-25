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
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

export function LixeirasForm() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ilha, setIlha] = useState({ nome: '' })
  const [edit, setEdit] = useState(false)
  const { idLixeira } = useParams()
  const navigate = useNavigate()
  const firestore = getFirestore(app)
  const { carregarIlhasServer, carregarLixeirasServer, ilhas, lixeiras } =
    useContext(IlhaContext)
  const { usuario } = useContext(AuthContext)

  const buscarLixeira = async () => {
    if (lixeiras) {
      const lixeira = lixeiras.find((l) => l.id === idLixeira)
      setNome(lixeira.nome)
      setDescricao(lixeira.descricao)
      buscarIlha(lixeira.ilha)
    } else {
      const docRef = doc(firestore, 'lixeiras', idLixeira)
      const docSnap = await getDoc(docRef)

      setNome(docSnap.data().nome)
      setDescricao(docSnap.data().descricao)
      buscarIlha(docSnap.data().ilha)
    }
  }

  const buscarIlha = async (idIlha) => {
    if (ilhas) {
      const ilha = ilhas.find((i) => i.id === idIlha)
      setIlha({ ...ilha, nome: ilha.nome })
    } else {
      const docRef = doc(firestore, 'ilhas', idIlha)
      const docSnap = await getDoc(docRef)
      setIlha({ ...ilha, nome: docSnap.data().nome })
    }
  }

  const cadastrarLixeira = (event) => {
    event.preventDefault()

    if (!nome || !descricao || !ilha || !usuario.email) {
      toast.warning('Por favor, preencha todos os campos.')
      return
    }

    const novaLixeira = {
      nome,
      descricao,
      ilha,
      usuario: usuario.email,
      created_date: new Date().toLocaleString('pt-BR'),
      updated_date: new Date().toLocaleString('pt-BR'),
    }
    addDoc(collection(firestore, 'lixeiras'), novaLixeira)
      .then((docRef) => {
        console.log(docRef.id)
        updateDoc(
          doc(collection(firestore, 'lixeiras'), docRef.id),
          novaLixeira,
        )
          .then(() => {
            console.log('inserido id')
          })
          .catch((error) => {
            console.log(error)
          })

        carregarLixeirasServer()
        limpaEstados()
        toast.success('Lixeira cadastrada com sucesso.')
        navigate('/lixeira')
      })
      .catch((error) => {
        toast.error(`Erro ao atualizar lixeira. ${error}`)
        console.log(error)
      })
  }

  const editarLixeira = () => {
    event.preventDefault()
    const updatedLixeira = {
      id: idLixeira,
      nome,
      descricao,
      ilha: ilha.id,
      usuario: usuario.email,
      updated_date: new Date().toLocaleString('pt-BR'),
    }

    updateDoc(doc(collection(firestore, 'lixeiras'), idLixeira), updatedLixeira)
      .then(() => {
        limpaEstados()
        toast.success('Lixeira atualizada com sucesso.')
        carregarLixeirasServer()
        navigate('/lixeira')
      })
      .catch((error) => {
        toast.error('Erro ao atualizar lixeira.')
        console.log(error)
      })
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

    if (ilhas.length === 0) {
      carregarIlhasServer()
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
              <LabelForm>TIPO DE LIXEIRA:</LabelForm>
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
              <LabelForm>LOCALIZAÇÃO:</LabelForm>
              <Input
                type="text"
                className="form-control"
                placeholder="Localização da Lixeira"
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
