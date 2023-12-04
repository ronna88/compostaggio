import { useContext, useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
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
import { toast } from 'react-toastify'

export function AduboForm() {
  const [composteira, setComposteira] = useState({ nome: '' })
  const [composteiras, setComposteiras] = useState([])
  const [peso, setPeso] = useState()
  const [edit, setEdit] = useState(false)
  const { idAdubo } = useParams()
  const navigate = useNavigate()
  const firestore = getFirestore(app)
  const { carregarComposteiras } = useContext(IlhaContext)

  const cadastrarRetiradaAdubo = () => {
    event.preventDefault()

    if (!composteira || !peso) {
      toast.warning('Por favor, preencha todos os campos.')
      return
    }

    let novaRetirada = {
      composteira,
      peso,
      created_date: new Date().toLocaleString('pt-BR'),
      updated_date: new Date().toLocaleString('pt-BR'),
    }
    addDoc(collection(firestore, 'retiradas_adubo'), novaRetirada)
      .then((docRef) => {
        const retiradas = []
        if (localStorage.getItem('retiradas_adubo')) {
          const retiradas = JSON.parse(localStorage.getItem('retiradas_adubo'))
        }
        novaRetirada = { ...novaRetirada, id: docRef.id }
        retiradas.push(novaRetirada)
        localStorage.setItem('retiradas_adubo', JSON.stringify(retiradas))
        limpaEstados()
        toast.success('Retirada cadastrada com sucesso!')
        navigate('/ilha')
      })
      .catch(() => {
        toast.error('Erro ao cadastrar retirada.')
        navigate('/ilha')
      })
  }

  const editarRetiradaAdubo = () => {
    event.preventDefault()
    if (!idAdubo || !peso || ilha.id) {
      toast.warning('Por favor, preencha todos os campos.')
      return
    }

    const updatedAdubo = {
      id: idAdubo,
      peso,
      composteira: ilha.id,
      updated_date: new Date().toLocaleString('pt-BR'),
    }

    updateDoc(
      doc(collection(firestore, 'retiradas_adubo'), idAdubo),
      updatedAdubo,
    )
      .then(() => {
        const listaAdubos = JSON.parse(
          localStorage.getItem('retiradas_adubo'),
        ).filter((adubo) => adubo.id !== idAdubo)
        listaAdubos.push(updatedAdubo)
        localStorage.setItem('retiradas_adubo', JSON.stringify(listaAdubos))
        limpaEstados()
        toast.success('Retirada atualizada com sucesso!')
        navigate('/retiradas')
      })
      .catch((error) => {
        toast.error('Erro ao atualizar retirada.')
        console.log(error)
      })
  }

  const limpaEstados = () => {
    setPeso('')
    setComposteira([])
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
            <TitleCard>CADASTRAR RETIRADA DE ADUBO</TitleCard>
          ) : (
            <TitleCard>EDITAR RETIRADA DE ADUBO</TitleCard>
          )}
        </CardHeader>
        <div className="card-body">
          <form>
            <div className="mb-3">
              <LabelForm>COMPOSTEIRA:</LabelForm>
              <SelectForm
                className="form-select"
                onChange={(e) => setComposteira(e.target.value)}
                value={composteira.id}
              >
                <option>Selecione a Composteira...</option>
                {composteiras.map((i) => {
                  return (
                    <option key={i.id} value={i.id}>
                      {i.nome}
                    </option>
                  )
                })}
              </SelectForm>
            </div>
            <div className="mb-2">
              <LabelForm>PESO RETIRADO:</LabelForm>
              <Input
                type="text"
                className="form-control"
                placeholder="Peso retirado"
                onChange={(e) => setPeso(e.target.value)}
                value={peso}
              />
            </div>
            {!edit ? (
              <SaveButton
                onClick={cadastrarRetiradaAdubo}
                className="btn btn-primary"
              >
                Cadastrar
              </SaveButton>
            ) : (
              <SaveButton
                onClick={editarRetiradaAdubo}
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
