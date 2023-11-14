import { useContext, useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
  doc,
  getDocs,
} from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import { IlhaContext } from '../../contexts/IlhasContext'
import {
  Card,
  CardHeader,
  Container,
  LabelForm,
  SaveButton,
  SelectForm,
  TitleCard,
} from './styles'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/AuthContext'

export function DespejoForm() {
  const [lixeiras, setLixeiras] = useState([])
  const [composteira, setComposteira] = useState([])
  const [edit, setEdit] = useState(false)
  const [rota, setRota] = useState({ id: '' })
  const [rotaLivre, setRotaLivre] = useState([])
  const navigate = useNavigate()
  const firestore = getFirestore(app)
  const { idDespejo } = useParams()
  const {
    carregarLixeiras,
    carregarComposteiras,
    composteiras,
    setComposteiras,
  } = useContext(IlhaContext)
  const { usuario } = useContext(AuthContext)

  const carregarRotasDisponiveis = () => {
    const fetchRotas = async () => {
      console.log('Iniciando consulta das rotas')
      const rotasCollection = collection(firestore, 'rotas')
      const rotasSnapshot = await getDocs(rotasCollection)

      setRotaLivre(
        rotasSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((r) => r.livre !== 'nao'),
      )

      if (rotaLivre.length === 0) {
        toast.warning(
          'Sem Pesagens disponíveis para despejar nas composteiras!',
        )
      }
    }

    fetchRotas()
  }

  const cadastrarDespejo = () => {
    event.preventDefault()
    let novoDespejo = {
      rota,
      composteira,
      usuario: usuario.email,
      created_date: new Date().toLocaleString('pt-BR'),
      updated_date: new Date().toLocaleString('pt-BR'),
    }
    addDoc(collection(firestore, 'despejos'), novoDespejo).then((docRef) => {
      let despejos = []
      if (localStorage.getItem('despejos')) {
        despejos = JSON.parse(localStorage.getItem('despejos'))
      }
      novoDespejo = { ...novoDespejo, id: docRef.id }
      despejos.push(novoDespejo)
      localStorage.setItem('despejos', JSON.stringify(despejos))

      updateRota(novoDespejo.rota)

      limpaEstados()
      navigate('/despejo')
    })
  }

  const limpaEstados = () => {
    setRota('')
    setComposteira('')
    setRotaLivre('')
  }

  const getRota = (idRota) => {
    return JSON.parse(localStorage.getItem('rotas')).filter(
      (r) => r.id === idRota,
    )
  }

  // método para atualizar estado da rota que foi utilizada
  const updateRota = (idRota) => {
    const rota = getRota(idRota)
    const updatedRota = { ...rota, livre: 'nao' }
    updateDoc(doc(collection(firestore, 'rotas'), idRota), updatedRota).then(
      () => {
        const rotas = JSON.parse(localStorage.getItem('rotas')).filter(
          (rota) => rota.id !== idRota,
        )
        rotas.push(updatedRota)
        localStorage.setItem('rotas', JSON.stringify(rotas))
      },
    )
  }

  const buscaLixeira = (idLixeira) => {
    return lixeiras.filter((l) => l.id === idLixeira)[0]
  }

  useEffect(() => {
    if (
      !localStorage.getItem('lixeiras') ||
      localStorage.getItem('lixeiras').length === 0
    ) {
      carregarLixeiras()

      setLixeiras(JSON.parse(localStorage.getItem('lixeiras')))
    }
    if (localStorage.getItem('lixeiras')) {
      setLixeiras(JSON.parse(localStorage.getItem('lixeiras')))
    }
    if (!localStorage.getItem('composteiras')) {
      carregarComposteiras()
    }
    if (localStorage.getItem('composteiras') && composteiras.length === 0) {
      setComposteiras(JSON.parse(localStorage.getItem('composteiras')))
    }

    carregarRotasDisponiveis()
  }, [])

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
                {rotaLivre
                  ? rotaLivre.map((r) => {
                      const data = new Date(r.date.seconds * 1000)
                      setTimeout(() => {
                        return (
                          <option key={r.id} value={r.id}>{`${data
                            .getDate()
                            .toString()
                            .padStart(2, '0')}/${(data.getMonth() + 1)
                            .toString()
                            .padStart(2, '0')}/${data.getFullYear()} - 
                            ${data.getHours()}:${data.getMinutes()} - 
                            ${buscaLixeira(r.idLixeira)?.descricao}`}</option>
                        )
                      }, 1500)
                    })
                  : ''}
              </SelectForm>
            </div>
            <div className="mb-3">
              <LabelForm>COMPOSTEIRA:</LabelForm>
              <SelectForm
                className="form-select"
                onChange={(e) => setComposteira(e.target.value)}
                value={composteira.id}
              >
                <option>
                  Selecione a composteira onde será despejado o resíduo...
                </option>
                {composteiras
                  ? composteiras.map((c) => {
                      // console.log(c)
                      return (
                        <option key={c.id} value={c.id}>{`${c.nome}`}</option>
                      )
                    })
                  : ''}
              </SelectForm>
            </div>
            {!edit ? (
              <SaveButton
                onClick={cadastrarDespejo}
                className="btn btn-primary"
              >
                Cadastrar
              </SaveButton>
            ) : (
              <SaveButton
                onClick={cadastrarDespejo}
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
