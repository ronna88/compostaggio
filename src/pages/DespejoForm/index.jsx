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
  Input,
} from './styles'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/AuthContext'

export function DespejoForm() {
  const [count, setCount] = useState(0)
  const [composteira, setComposteira] = useState([])
  const [edit, setEdit] = useState(false)
  const [rota, setRota] = useState({ id: '' })
  const [rotaLivre, setRotaLivre] = useState([])
  const navigate = useNavigate()
  const firestore = getFirestore(app)
  const { idDespejo } = useParams()
  const [rotasSemDespejoCarregadas, setRotasSemDespejoCarregadas] =
    useState(false)
  const {
    carregarLixeirasServer,
    lixeiras,
    carregarComposteirasServer,
    composteiras,
    setComposteiras,
    carregarRotasDisponiveisServer,
    rotasSemDespejo,
    rotasSemDespejoServer,
    carrgarRotasServer,
    carregarBombonaOrganicaServer,
    setPesoBombonaOrganica,
    pesoBombonaOrganica,
    setRotasSemDespejo,
  } = useContext(IlhaContext)
  const { usuario } = useContext(AuthContext)

  const cadastrarDespejo = () => {
    event.preventDefault()
    const novoDespejo = {
      rota,
      composteira,
      usuario: usuario.email,
      created_date: new Date().toLocaleString('pt-BR'),
      updated_date: new Date().toLocaleString('pt-BR'),
    }
    addDoc(collection(firestore, 'despejos'), novoDespejo)
      .then((docRef) => {
        rotasSemDespejoServer()
        updateRota(novoDespejo.rota)
        toast.success('Despejo de resíduo cadastrado com sucesso.')
        limpaEstados()
        navigate('/ilha')
      })
      .catch((error) => {
        toast.error(`Erro ao cadastrar despejo de resíduo. ${error}`)
        console.log(error)
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

  // Método para atualizar estado da rota que foi utilizada
  const updateRota = (idRota) => {
    const rota = getRota(idRota)
    const updatedRota = { ...rota, livre: 'nao' }
    updateDoc(doc(collection(firestore, 'rotas'), idRota), updatedRota).then(
      () => {
        carrgarRotasServer()
        toast.success('Rota atualizada com sucesso!')
      },
    )
  }

  const buscaLixeira = (idLixeira) => {
    return lixeiras.filter((l) => l.id === idLixeira)[0]
  }

  useEffect(() => {
    // setR(carregarRotasDisponiveisServer())
    //if (composteiras.length === 0) {
    //  carregarComposteirasServer()
    // }
    // if (lixeiras.length === 0) {
    //  carregarLixeirasServer()
    // }
    // if (!pesoBombonaOrganica) {
    //  carregarBombonaOrganicaServer()
    // }
  }, [])

  useEffect(() => {
    if (!pesoBombonaOrganica) {
      carregarBombonaOrganicaServer()
    }
  }, [pesoBombonaOrganica])

  useEffect(() => {
    if (composteiras.length === 0) {
      carregarComposteirasServer()
    }
  }, [composteiras])

  useEffect(() => {
    if (lixeiras.length === 0) {
      carregarLixeirasServer()
    }
  }, [lixeiras])

  useEffect(() => {
    if (!rotasSemDespejoCarregadas) {
      carregarRotasDisponiveisServer()
      setRotasSemDespejoCarregadas(true)
    }
  }, [rotasSemDespejoCarregadas])

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
                {parseFloat(pesoBombonaOrganica) !== 0 ? (
                  <option value="4ZSXBbuA83ijYjp9Ml9P" disabled>
                    Bombona Orgânica - {pesoBombonaOrganica} Kg
                  </option>
                ) : (
                  <option value="4ZSXBbuA83ijYjp9Ml9P">
                    Bombona Orgânica - {pesoBombonaOrganica} Kg
                  </option>
                )}
                {rotasSemDespejo[0]?.existe !== 'nao'
                  ? rotasSemDespejo.map((r) => {
                      const data = new Date(r?.date?.seconds * 1000)

                      return (
                        <option key={r.id} value={r.id}>{`${data
                          .getDate()
                          .toString()
                          .padStart(2, '0')}/${(data.getMonth() + 1)
                          .toString()
                          .padStart(2, '0')}/${data.getFullYear()} - 
                            ${data.getHours()}:${data.getMinutes()} - 
                            ${buscaLixeira(r.idLixeira)?.descricao} - 
                            ${r.peso}Kg`}</option>
                      )
                    })
                  : console.log(rotasSemDespejo)}
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
                      return (
                        <option key={c.id} value={c.id}>{`${c.nome}`}</option>
                      )
                    })
                  : ''}
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
