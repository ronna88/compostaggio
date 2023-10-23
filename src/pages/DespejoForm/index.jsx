import { useContext, useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
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
      const despejos = JSON.parse(localStorage.getItem('despejos'))
      novoDespejo = { ...novoDespejo, id: docRef.id }
      console.log(novoDespejo)
      despejos.push(novoDespejo)
      console.log(despejos)
      localStorage.setItem('despejos', JSON.stringify(despejos))
      limpaEstados()
      navigate('/despejo')
    })
  }

  const limpaEstados = () => {
    setRota('')
    setComposteira('')
  }

  const filterRotasLivres = () => {
    // Função para filtrar as rotas que ainda não foram despejadas na composteira
    // para liberar a seleção destas.
    const rt = JSON.parse(localStorage.getItem('rotas'))
    const rtTemp = []
    for (let i = 0; i < rt.length; i++) {
      if (!rt[i.livre]) {
        rtTemp.push(rt[i])
        console.log(rt[i])
      }
    }
    console.log(rtTemp)
    setRotas(rtTemp)
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
    if (
      !localStorage.getItem('rotas') ||
      JSON.parse(localStorage.getItem('rotas')).length === 0
    ) {
      carregarRotas()
    }
    if (localStorage.getItem('rotas')) {
      setRotas(JSON.parse(localStorage.getItem('rotas')))
      filterRotasLivres()
    }
    if (!localStorage.getItem('composteiras')) {
      carregarComposteiras()
    }
    if (localStorage.getItem('composteiras') && composteiras.length === 0) {
      setComposteiras(JSON.parse(localStorage.getItem('composteiras')))
    }
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
                      console.log(c)
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
