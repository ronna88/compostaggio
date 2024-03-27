import { useContext, useEffect, useState } from 'react'
import { IlhaContext } from '../../contexts/IlhasContext'
import { AuthContext } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  deleteDoc,
  getFirestore,
  doc,
  getDoc,
  collection,
  updateDoc,
  getDocsFromServer,
} from 'firebase/firestore'
import { app } from '../../services/firebase'
import {
  Card,
  CardHeader,
  Container,
  ContainerTable,
  SearchBar,
  TableData,
  TitleCard,
  ActionButtons,
} from './styles'
import { PencilSimple, Trash } from '@phosphor-icons/react'
import { toast } from 'react-toastify'

export function ListaLixeiras() {
  const firestore = getFirestore(app)
  const {
    carregarLixeiras,
    lixeiras,
    setLixeiras,
    ilhas,
    carregarLixeirasServer,
  } = useContext(IlhaContext)
  const { usuario } = useContext(AuthContext)
  const navigate = useNavigate()
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    if (!carregado) {
      if (lixeiras.length === 0) {
        carregarLixeirasServer()
        setCarregado(true)
      }
    }
  }, [lixeiras])

  const filterNomeIlha = (ilhaId) => {
    const ilha = ilhas.find((i) => i.id === ilhaId)
    if (ilha) {
      return ilha.nome
    }
  }

  const deleteLixeira = async (lixeiraId) => {
    // Código para deletar registro do firebase
    // const lixeiraRef = doc(firestore, 'lixeiras', lixeiraId)
    // try {
    //   await deleteDoc(lixeiraRef)
    //   console.log('Lixeira Excluida')
    //   toast.success('Lixeira Excluída com sucesso')
    //   setLixeiras((prevList) =>
    //    prevList.filter((lixeira) => lixeira.id !== lixeiraId),
    //   )
    // } catch {
    //  console.log()
    // }

    // TODO: verificar se a lixeira tem pesagem, se tiver fazer com que exclua primeiro as pesagens.
    let temPesagem
    const fetchExisteRotaParaLixeira = async () => {
      const rotasCollection = collection(firestore, 'rotas')
      const rotasSnapshot = await getDocsFromServer(rotasCollection)
      temPesagem =
        rotasSnapshot.docs.filter((r) => r.idLixeira !== lixeiraId).length > 0
      return (
        rotasSnapshot.docs.filter((r) => r.idLixeira !== lixeiraId).length > 0
      )
    }
    await fetchExisteRotaParaLixeira()
    if (temPesagem) {
      toast.error('Lixeira possui pesagens cadastradas. Apague-as primeiro')
    } else {
      const docRef = doc(firestore, 'lixeiras', lixeiraId)
      const docSnap = await getDoc(docRef)

      const updatedLixeira = {
        id: lixeiraId,
        nome: docSnap.data().nome,
        descricao: docSnap.data().descricao,
        ilha: docSnap.data().ilha,
        usuario: usuario.email,
        deleted: true,
        updated_date: new Date().toLocaleString('pt-BR'),
      }

      updateDoc(
        doc(collection(firestore, 'lixeiras'), lixeiraId),
        updatedLixeira,
      )
        .then(() => {
          toast.success('Lixeira deletada com sucesso.')
          carregarLixeirasServer()
          navigate('/lixeira')
        })
        .catch((error) => {
          toast.error('Erro ao deletar a lixeira.')
          console.log(error)
        })
    }
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <TitleCard>LISTAGEM</TitleCard>
          <SearchBar>
            <input type="text" />
          </SearchBar>
        </CardHeader>
        <ContainerTable>
          <TableData>
            <thead>
              <tr>
                <th>ID</th>
                <th>TIPO</th>
                <th>LOCALIZAÇÃO</th>
                <th>ILHA</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {lixeiras ? (
                lixeiras.map((lixeira) => {
                  return (
                    <tr key={lixeira.id}>
                      <td>{lixeira.id}</td>
                      <td>{lixeira.nome}</td>
                      <td>{lixeira.descricao}</td>
                      <td>{filterNomeIlha(lixeira.ilha)}</td>
                      <td>
                        <ActionButtons
                          onClick={(e) => {
                            localStorage.setItem(
                              'editLixeira',
                              JSON.stringify(lixeira),
                            )
                            navigate(`/lixeira/${lixeira.id}`)
                          }}
                        >
                          <PencilSimple size={18} color="#f7941e" />
                        </ActionButtons>
                        <ActionButtons
                          onClick={(e) => {
                            deleteLixeira(lixeira.id)
                          }}
                        >
                          <Trash size={18} color="#ff0000" />
                        </ActionButtons>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4}>Carregando dados....</td>
                </tr>
              )}
              <tr>
                <td></td>
              </tr>
            </tbody>
          </TableData>
        </ContainerTable>
      </Card>
    </Container>
  )
}
