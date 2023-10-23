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

export function DespejoForm() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ilha, setIlha] = useState({ nome: '' })
  const [lixeiras, setLixeiras] = useState([])
  const [lixeira, setLixeira] = useState([])
  const [edit, setEdit] = useState(false)
  const [rotas, setRotas] = useState([])
  const [rota, setRota] = useState({ id: '' })
  const navigate = useNavigate()
  const firestore = getFirestore(app)
  const { idDespejo } = useParams()
  const { carregarLixeiras, carregarRotas } = useContext(IlhaContext)

  /*
  const buscarLixeira = async () => {
    if (localStorage.getItem('lixeiras')) {
      const lixeira = JSON.parse(localStorage.getItem('lixeiras')).find(
        (l) => l.id === idLixeira,
      )
      setNome(lixeira.nome)
      setDescricao(lixeira.descricao)
      buscarIlha(lixeira.ilha)
    } else {
      const docRef = doc(firestore, 'lixeiras', idLixeira)
      const docSnap = await getDoc(docRef)
      // console.log(docSnap.data())
      setNome(docSnap.data().nome)
      setDescricao(docSnap.data().descricao)
      buscarIlha(docSnap.data().ilha)
    }
  }
  */

  const cadastrarLixeira = () => {
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

  /*
  const editarLixeira = () => {
    event.preventDefault()
    const updatedLixeira = {
      id: idLixeira,
      nome,
      descricao,
      ilha: ilha.id,
      updated_date: new Date().toLocaleString('pt-BR'),
    }

    updateDoc(doc(collection(firestore, 'lixeiras'), idLixeira), updatedLixeira)
      .then(() => {
        const lixeiras = JSON.parse(localStorage.getItem('lixeiras')).filter(
          (lixeira) => lixeira.id !== idLixeira,
        )
        console.log(lixeiras)
        lixeiras.push(updatedLixeira)
        localStorage.setItem('lixeiras', JSON.stringify(lixeiras))
        limpaEstados()
        navigate('/lixeira')
      })
      .catch((error) => {
        console.log(error)
      })
  }
  */

  const limpaEstados = () => {
    setNome('')
    setDescricao('')
    setIlha({ nome: '' })
  }

  const filterRotasLivres = () => {
    // Função para filtrar as rotas que ainda não foram despejadas na composteira
    // para liberar a seleção destas.
    const rt = JSON.parse(localStorage.getItem('rotas'))
    const rtTemp = []
    for (let i = 0; i < rt.length; i++) {
      console.log('oiiiii')
      if (!rt[i.livre]) {
        console.log('livre')
        rtTemp.push(rt[i])
        console.log(rt[i])
      }
    }
    console.log(rtTemp)
    setRotas(rtTemp)
  }

  useEffect(() => {
    filterRotasLivres()
    if (idDespejo) {
      setEdit(true)
      // buscarLixeira()
    }
    if (
      !localStorage.getItem('lixeiras') ||
      localStorage.getItem('lixeiras').length === 0
    ) {
      carregarLixeiras()
    }
    if (localStorage.getItem('lixeiras')) {
      setLixeiras(JSON.parse(localStorage.getItem('lixeiras')))
    }
    if (
      !localStorage.getItem('rotas') ||
      JSON.parse(localStorage.getItem('rotas')).length === 0
    ) {
      carregarRotas()
    }
    if (localStorage.getItem('rotas')) {
      setRotas(JSON.parse(localStorage.getItem('rotas')))
    }
  }, [])

  useEffect(() => {
    console.log(rotas)
  }, [rotas])

  return (
    <Container>
      <Card>
        <CardHeader>
          {!edit ? (
            <TitleCard>DEPOSITAR RESÍDUOS NA COMPOSTEIRA</TitleCard>
          ) : (
            <TitleCard>EDITAR DEPÓSITO DE RESÍDUOS NA COMPOSTEIRA</TitleCard>
          )}
        </CardHeader>
        <div className="card-body">
          <form>
            <div className="mb-3">
              <LabelForm>PESAGEM:</LabelForm>
              <SelectForm
                className="form-select"
                onChange={(e) => setRota(e.target.value)}
                value={rota.id}
              >
                <option>Selecione a pesagem realizada...</option>
                {rotas
                  ? rotas.map((r) => {
                      const data = new Date(r.date.seconds*1000)
                      console.log(data)
                      return (
                        <option value={r.idLixeira}>{`${data
                          .getDate()
                          .toString()
                          .padStart(2, '0')}/${(data.getMonth() + 1)
                          .toString()
                          .padStart(2, '0')}/${data.getFullYear()}`}</option>
                      )
                    })
                  : ''}
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
