import { useContext, useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
  doc,
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

export function DespejoForm() {
  const [lixeiras, setLixeiras] = useState([])
  const [composteira, setComposteira] = useState([])
  const [edit, setEdit] = useState(false)
  const [rotas, setRotas] = useState([])
  const [rota, setRota] = useState({ id: '' })
  const navigate = useNavigate()
  const firestore = getFirestore(app)
  const { idDespejo } = useParams()
  const {
    carregarLixeiras,
    carregarRotas,
    carregarComposteiras,
    composteiras,
    setComposteiras,
    rotasSemDespejo,
    setRotasSemDespejo,
  } = useContext(IlhaContext)

  const cadastrarDespejo = () => {
    event.preventDefault()
    let novoDespejo = {
      rota,
      composteira,
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
    setRotasSemDespejo('')
  }

  const buscarRota = () => {
    // Função para filtrar as rotas que ainda não foram despejadas na composteira
    // para liberar a seleção destas.
    // const rt = JSON.parse(localStorage.getItem('rotas'))
    // const rtTemp = rt.filter((rota) => rota.livre !== 'nao')
    // console.log('filtradas as rotas')
    // console.log(rtTemp)
    setRotas(rotasSemDespejo)
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
    return lixeiras.filter((lixeira) => lixeira.id === idLixeira)[0]
  }

  useEffect(() => {
    if (
      !localStorage.getItem('lixeiras') ||
      localStorage.getItem('lixeiras').length === 0
    ) {
      carregarLixeiras()
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
  }, [])

  useEffect(() => {
    if (rotasSemDespejo.length === 0) {
      carregarRotas()
      setRotas(rotasSemDespejo)
    }

    if (rotasSemDespejo.length === 0) {
      toast.warning(
        'Não existem pesagens de lixeira disponíveis para despejar na composteira',
      )
    }
  }, [rotasSemDespejo])

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
                      const data = new Date(r.date.seconds * 1000)

                      return (
                        <option key={r.id} value={r.id}>{`${data
                          .getDate()
                          .toString()
                          .padStart(2, '0')}/${(data.getMonth() + 1)
                          .toString()
                          .padStart(2, '0')}/${data.getFullYear()} - 
                          ${data.getHours()}:${data.getMinutes()} - 
                          ${buscaLixeira(r.idLixeira).descricao}`}</option>
                      )
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
