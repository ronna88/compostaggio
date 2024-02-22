/* eslint-disable prettier/prettier */
import { useContext, useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  CardHeader,
  Container,
  Input,
  LabelForm,
  SaveButton,
  TitleCard,
  SubTitleCard,
} from './styles'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/AuthContext'
import { IlhaContext } from '../../contexts/IlhasContext'


// 4ZSXBbuA83ijYjp9Ml9P      -   ID pesoBombonaOrganica
// xo9lP0Fpnz9gB0Mh8Ez4      -   ID pesoBombonaJardinagem

export function PesoForm() {
  const [edit, setEdit] = useState(false)
  const [rota, setRota] = useState('')
  const [peso, setPeso] = useState('')
  const [pesoEdit, setPesoEdit] = useState('')
  const [date, setDate] = useState(new Date())
  const [lix, setLix] = useState('')
  const navigate = useNavigate()
  const { idLixeira, idRota } = useParams()
  const firestore = getFirestore(app)

  const { usuario } = useContext(AuthContext)
  const { lixeiras, carregarRotasServer } = useContext(IlhaContext)

  const buscarPesoAtual = async () => {
    const docRef = doc(firestore, "pesoBombonaOrganica", "4ZSXBbuA83ijYjp9Ml9P");
    const docSnap = await getDoc(docRef);
    return docSnap.data().peso
  }

  const buscarPesoAtualJardinagem = async () => {
    const docRef = doc(firestore, "pesoBombonaJardinagem", "xo9lP0Fpnz9gB0Mh8Ez4");
    const docSnap = await getDoc(docRef);
    return docSnap.data().peso
  }

  const salvarRota = async () => {
    event.preventDefault()
    const pesoAtual = await buscarPesoAtual()
    const pesoAtualJardinagem = await buscarPesoAtualJardinagem()

    const novaRota = {
      peso,
      date,
      idLixeira,
      livre: 'sim',
    }

    if (!peso || !date || peso === ' ' || date === ' ') {
      toast.warning('Por favor, preencha todos os campos.')
      return
    }
    addDoc(collection(firestore, 'rotas'), novaRota)
      .then((docRef) => {
        toast.success('Peso cadastrado com sucesso.')
        carregarRotasServer()

        // TODO: Verificar se a rota é do tipo organica para jogar na bombona direto. 

        // idRota recém criada;
        const idCriado = docRef.id
        console.log(docRef)
        if (lixeiras.filter((lixeira) => lixeira.id === idLixeira)[0].nome === 'Orgânica') {

          // Enviar para BombonaOrganica
          addDoc(collection(firestore, 'bombonaOrganica'), { idLixeira, idRota: idCriado, peso })
            .then((docRefBombonaOrganica) => {
              toast.success('Peso enviado a Bombona Orgânica')
              const pesoTotal = (parseFloat(pesoAtual) + parseFloat(peso))
              console.log(pesoTotal)
              // Atualizar Peso Total Bombona Organica
              updateDoc(doc(collection(firestore, 'pesoBombonaOrganica'), '4ZSXBbuA83ijYjp9Ml9P'), { peso: pesoTotal })
                .then(() => {
                  console.log(`atualizado peso total da bombona`)
                })
                .catch((error) => {
                  // toast.error(`Erro ao atualizar rota.${error}`)
                  console.log(`Erro ao atualizar o peso total da bombona ${error}`)
                })
              // Fim atualização peso total bombona
            })
            .catch((_err) => {
              toast.error(`Erro ao enviar a Bombona Orgânica ${_err}`)
            }) // Fim envio bombona
        }
        // Bombona Jardinagem
        if (lixeiras.filter((lixeira) => lixeira.id === idLixeira)[0].nome === 'Jardinagem') {

          // Enviar para BombonaJardinagem
          addDoc(collection(firestore, 'bombonaJardinagem'), { idLixeira, idRota: idCriado, peso })
            .then((docRefBombonaJardinagem) => {
              toast.success('Peso enviado a Bombona Jardinagem')
              const pesoTotal = (parseFloat(pesoAtualJardinagem) + parseFloat(peso))
              console.log(pesoTotal)
              // Atualizar Peso Total Bombona Jardinagem
              updateDoc(doc(collection(firestore, 'pesoBombonaJardinagem'), 'xo9lP0Fpnz9gB0Mh8Ez4'), { peso: pesoTotal })
                .then(() => {
                  console.log(`atualizado peso total da bombona jardinagem`)
                })
                .catch((error) => {
                  console.log(error)
                })
              // Fim atualização peso total bombona
            })
            .catch((_err) => {
              toast.error(`Erro ao enviar a Bombona Jardinagem ${_err}`)
            }) // Fim envio bombona
        } // Fim Bombona Jardinagem
      })
      .catch((error) => {
        toast.error('Erro ao cadastrar peso da lixeira.')
        console.log(error)
      })

    setTimeout(() => {
      limpaEstados()
      navigate('/busca')
    }, 2500)
  }

  const limpaEstados = () => {
    setRota('')
    setDate('')
    setPeso('')
  }

  useEffect(() => {
    if (date !== '') {
      setDate(new Date())
    }

    if (window.location.pathname.includes('rota')) {
      setEdit(true)
      setRota(buscarRota(idRota))
    }
  }, [])

  const buscarRota = async (idRota) => {
    const docRef = doc(firestore, 'rotas', idRota)
    const docSnap = await getDoc(docRef)
    setPeso(docSnap.data().nome)
    setLix(docSnap.data().idLixeira)
    setDate(new Date(docSnap.data().date?.seconds * 1000))
    setPesoEdit(docSnap.data().peso)

    return docSnap.data()
  }

  const editarRota = async () => {
    event.preventDefault()
    const pesoAtual = await buscarPesoAtual()
    const pesoAtualJardinagem = await buscarPesoAtualJardinagem()
    let diferencaPesoOrganico
    let diferencaPesoJardinagem

    const updatedRota = {
      id: idRota,
      peso,
      date: new Date(date),
      idLixeira: lix,
      usuario: usuario.email,
      updated_date: new Date().toLocaleString('pt-BR'),
    }

    updateDoc(doc(collection(firestore, 'rotas'), idRota), updatedRota)
      .then(() => {
        toast.success('Rota atualizada com sucesso.')
        // Checar se lixeira da rota é de organico
        if (rota.idLixeira === lixeiras.filter((lixeira) => lixeira.id === idLixeira)[0].nome === 'Orgânico') {
          // checagem se peso anterior é maior que o novo peso editado
          if (rota.peso > peso) {
            // Peso anterior é maior que o editado
            // Necessário pegar a diferença dos valores e subtrair do valor da bombonaOrganica
            diferencaPesoOrganico = parseFloat(peso) - parseFloat(rota.peso)  // número negativo
          }
          if (rota.peso < peso) {
            // Peso anterior é menor que o editado
            // Necessário pegar a diferença dos valores e somar no valor da bombonaOrganica
            diferencaPesoOrganico = parseFloat(peso) - parseFloat(rota.peso)
          }
          if (rota.peso === peso) {
            // pesos iguais, não alterar o peso final da bombona
            diferencaPesoOrganico = 0
          }
          // Iniciar atualização do peso total da bombonaOrganica
          updateDoc(doc(collection(firestore, 'pesoBombonaOrganica'), '4ZSXBbuA83ijYjp9Ml9P'), { peso: (parseFloat(pesoAtual) + parseFloat(diferencaPesoOrganico)) })
            .then(() => {
              toast.success(`Peso atualizado na bombona orgânica!`)
              console.log(parseFloat(pesoAtual) + parseFloat(diferencaPesoOrganico))
            })
            .catch(() => {
              toast.error(`Erro ao atualizar peso na bombona orgânica`)
            })
        }
        // Checar se lixeira da rota é de jardinagem
        if (rota.idLixeira === lixeiras.filter((lixeira) => lixeira.id === idLixeira)[0].nome === 'Jardinagem') {
          // checagem se peso anterior é maior que o novo peso editado
          if (rota.peso > peso) {
            // Peso anterior é maior que o editado
            // Necessário pegar a diferença dos valores e subtrair do valor da bombonaOrganica
            diferencaPesoJardinagem = parseFloat(rota.peso) - parseFloat(peso)
          }
          if (rota.peso < peso) {
            // Peso anterior é menor que o editado
            // Necessário pegar a diferença dos valores e somar no valor da bombonaOrganica
            diferencaPesoJardinagem = parseFloat(peso) - parseFloat(rota.peso)
          }
          if (rota.peso === peso) {
            // pesos iguais, não alterar o peso final da bombona
            diferencaPesoJardinagem = 0
          }
          // Iniciar atualização do peso total da bombonaJardinagem
          updateDoc(doc(collection(firestore, 'pesoBombonajardinagem'), 'xo9lP0Fpnz9gB0Mh8Ez4'), { peso: (parseFloat(pesoAtual) + parseFloat(diferencaPesoJardinagem)) })
            .then(() => {
              toast.success(`Peso atualizado na bombona jardinagem!`)
              console.log(parseFloat(pesoAtual) + parseFloat(diferencaPesoJardinagem))
            })
            .catch(() => {
              toast.error(`Erro ao atualizar peso na bombona jardinagem`)
            })
        }
        carregarRotasServer()
        limpaEstados()
        navigate('/rota')
      })
      .catch((error) => {
        toast.error(`Erro ao atualizar rota.${error}`)
        console.log(error)
      })
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <TitleCard>PESAGEM DA LIXEIRA</TitleCard>
          <SubTitleCard>
            {'COD: ' +
              lixeiras.filter((lixeira) => lixeira.id === idLixeira)[0]
                .descricao +
              ' TIPO: ' +
              lixeiras.filter((lixeira) => lixeira.id === idLixeira)[0].nome}
          </SubTitleCard>
        </CardHeader>
        <div className="card-body">
          <form>
            <div className="mb-2">
              <LabelForm className="form-label">
                PESO EM KG DA LIXEIRA
              </LabelForm>
              <Input
                type="text"
                className="form-control"
                placeholder="Peso em Kg da Lixeira"
                onChange={(e) => {
                  setPeso(e.target.value)
                }}
                value={peso}
              />
            </div>
            <div className="mb-3 react-datepicker-wrapper">
              <LabelForm className="form-label">
                DATA E HORA DA PESAGEM&nbsp;
              </LabelForm>
              <ReactDatePicker
                className="form-control "
                selected={date}
                onChange={(date) => setDate(date)}
                timeInputLabel="Time:"
                dateFormat="dd/MM/yyyy h:mm aa"
                showTimeInput
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
            <br />
            {edit ? (
              <SaveButton onClick={editarRota} className="btn btn-primary">
                Atualizar
              </SaveButton>
            ) : (
              <SaveButton onClick={salvarRota} className="btn btn-primary">
                Cadastrar
              </SaveButton>
            )}
          </form>
        </div>
      </Card>
    </Container>
  )
}
