import { useContext, useEffect, useState } from 'react'
import { IlhaContext } from '../../contexts/IlhasContext'
import { useNavigate } from 'react-router-dom'
import { deleteDoc, getFirestore, doc } from 'firebase/firestore'
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
    const lixeiraRef = doc(firestore, 'lixeiras', lixeiraId)
    try {
      await deleteDoc(lixeiraRef)
      console.log('Lixeira Excluida')
      toast.success('Lixeira Excluída com sucesso')
      setLixeiras((prevList) =>
        prevList.filter((lixeira) => lixeira.id !== lixeiraId),
      )
    } catch {
      console.log()
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
