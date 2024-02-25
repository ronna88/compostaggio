import { useContext, useEffect, useState } from 'react'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
  doc,
  getDocs,
  getDocFromServer,
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

// TODO: verificar a edição da pesagem para pesagens diferentes das bombonas
// TODO: criar tela de lista de depositos na composteira

export function DespejoForm() {
  const [composteira, setComposteira] = useState([])
  const [edit, setEdit] = useState(false)
  const [rota, setRota] = useState({ id: '' })
  const [rotaLivre, setRotaLivre] = useState([])
  const navigate = useNavigate()
  const firestore = getFirestore(app)
  const { idDespejo } = useParams()
  const [pesoEditavel, setPesoEditavel] = useState('')
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
    carregarRotasServer,
    carregarBombonaOrganicaServer,
    setPesoBombonaOrganica,
    pesoBombonaOrganica,
    carregarBombonaJardinagemServer,
    pesoBombonaJardinagem,
    setPesoBombonaJardinagem,
    setRotasSemDespejo,
  } = useContext(IlhaContext)
  const { usuario } = useContext(AuthContext)

  useEffect(() => {
    if (!rotasSemDespejoCarregadas) {
      carregarRotasDisponiveisServer()
      carregarBombonaOrganicaServer()
      carregarBombonaJardinagemServer()
      carregarComposteirasServer()
      carregarLixeirasServer()
      setRotasSemDespejoCarregadas(true)
    }
  }, [rotasSemDespejoCarregadas, pesoBombonaJardinagem, pesoBombonaOrganica, composteiras, lixeiras])

  const cadastrarDespejo = () => {
    let pesoAtualComposteira
    let colecao
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
        carregarRotasDisponiveisServer()
        
        toast.success('Despejo de resíduo cadastrado com sucesso.')

        // TODO: pesos das bombonas e das composteiras estao atualizando ok. falta testar quando desposita a lixeira completa. depois ajustar a edição do cadastro de deposito.
        if (pesoEditavel > 0) {
          const fetchComposteiraServer = async () => {
            const composteiraSelecionadaCollection = doc(
              firestore,
              'composteiras',
              composteira,
            )
            const composteiraSelecionadaSnap = await getDocFromServer(
              composteiraSelecionadaCollection,
            )
            pesoAtualComposteira = composteiraSelecionadaSnap.data().peso
          }
          fetchComposteiraServer()

          // console.log(parseFloat(composteiras.filter((c) => c.id === composteira)[0].peso) + parseFloat(pesoEditavel.replace(',','.')))
          updateDoc(doc(collection(firestore, 'composteiras'), composteira), {
            peso: (
              parseFloat(composteiras.filter((c) => c.id === composteira)[0].peso) + parseFloat(pesoEditavel.replace(',','.'))
            ).toFixed(2),
          })
            .then(() => {
              console.log('peso composteira atualizado')
              toast.success('Peso da composteira atualizado!')
              // pesoBombonaOrganica
              if (rota === '4ZSXBbuA83ijYjp9Ml9P') {
                colecao = 'pesoBombonaOrganica'
              }
              // pesoBombonajardinagem
              if (rota === 'xo9lP0Fpnz9gB0Mh8Ez4') {
                colecao = 'pesoBombonaJardinagem'
              }
              updateDoc(doc(collection(firestore, colecao), rota), {
                peso: (
                  parseFloat(pesoBombonaOrganica) - parseFloat(pesoEditavel.replace(',','.'))
                ).toFixed(2),
              })
                .then(() => {
                  console.log('Atualizado com sucesso o peso da bombona')
                })
                .catch(() => {
                  console.log('Erro ao atualizar o peso da bombona ')
                  toast.error('Erro ao atualizar o peso da bombona')
                })
            })
            .catch(()=> {
              console.log("Erro ao atualizar o peso da Composteira")
              toast.error("Erro ao atualizar o peso da Composteira")
            })
        } else {
          updateRota(novoDespejo.rota)
          const fetchComposteiraServer = async () => {
            const composteiraSelecionadaCollection = doc(
              firestore,
              'composteiras',
              composteira,
            )
            const composteiraSelecionadaSnap = await getDocFromServer(
              composteiraSelecionadaCollection,
            )
            // pesoAtualComposteira = 
            console.log(composteiraSelecionadaSnap.data())
            console.log(rotasSemDespejo)
            console.log(rota)
            console.log(rotasSemDespejo.find((r) => r.id === rota))
            console.log(parseFloat(composteiraSelecionadaSnap.data().peso) + parseFloat(rotasSemDespejo.find((r) => r.id === rota).peso).toFixed(2))
            await updateDoc(doc(firestore, 'composteiras', composteira), {
              peso: (parseFloat(composteiraSelecionadaSnap.data().peso) + parseFloat(rotasSemDespejo.find((r) => r.id === rota).peso)).toFixed(2)
            })
            .then(() => {
              console.log('atualizou peso da composteira')
            })
            .catch((_err) => {
              console.log('erro ao atualizar o peso da composteira')
            })
          }
          fetchComposteiraServer()

          
        }

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
    return rotasSemDespejo.filter(
      (r) => r.id === idRota,
    )
  }

  // Método para atualizar estado da rota que foi utilizada
  const updateRota = (idRota) => {
    const rota = getRota(idRota)
    const updatedRota = { ...rota, livre: 'nao' }
    updateDoc(doc(collection(firestore, 'rotas'), idRota), updatedRota).then(
      () => {
        carregarRotasServer()
        toast.success('Rota atualizada com sucesso!')
      },
    )
  }

  const buscaLixeira = (idLixeira) => {
    return lixeiras.filter((l) => l.id === idLixeira)[0]
  }

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
                {parseFloat(pesoBombonaOrganica) === 0 ? (
                  <option value="4ZSXBbuA83ijYjp9Ml9P" disabled>
                    Bombona Orgânica - {pesoBombonaOrganica} Kg
                  </option>
                ) : (
                  <option value="4ZSXBbuA83ijYjp9Ml9P">
                    Bombona Orgânica - {pesoBombonaOrganica} Kg
                  </option>
                )}
                {parseFloat(pesoBombonaJardinagem) === 0 ? (
                  <option value="xo9lP0Fpnz9gB0Mh8Ez4" disabled>
                    Bombona Jardinagem - {pesoBombonaJardinagem} Kg
                  </option>
                ) : (
                  <option value="xo9lP0Fpnz9gB0Mh8Ez4">
                    Bombona Jardinagem - {pesoBombonaJardinagem} Kg
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
            {rota === '4ZSXBbuA83ijYjp9Ml9P' ||
            rota === 'xo9lP0Fpnz9gB0Mh8Ez4' ? (
              <div className="mb-2">
                <LabelForm>PESO À DESPEJAR:</LabelForm>
                <Input
                  type="number"
                  step={0.1}
                  className="form-control"
                  placeholder="Peso a ser depositado na composteira"
                  onChange={(e) => setPesoEditavel(e.target.value)}
                  value={pesoEditavel}
                />
              </div>
            ) : (
              ''
            )}
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
