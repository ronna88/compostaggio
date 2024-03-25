import { useContext, useEffect, useState } from 'react'
import { IlhaContext } from '../../contexts/IlhasContext'
import { useNavigate } from 'react-router-dom'
import {
  deleteDoc,
  getFirestore,
  doc,
  memoryLocalCache,
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

export function ListaIlhas() {
  const firestore = getFirestore(app)
  const {
    carregarIlhas,
    carregarLixeiras,
    ilhas,
    carregarIlhasServer,
    setIlhas,
  } = useContext(IlhaContext)
  const [carregado, setCarregado] = useState(false)
  const [ilhasCarregadas, setIlhasCarregadas] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!carregado) {
      if (ilhas.length === 0) {
        carregarIlhasServer()
        setCarregado(true)
      }
    }
  }, [ilhas])

  const deleteIlha = async (ilhaId) => {
    const ilhaRef = doc(firestore, 'ilhas', ilhaId)
    try {
      await deleteDoc(ilhaRef)
      console.log('Ilha Excluida')
      toast.success('Ilha Excluída com sucesso')
      setIlhas((prevList) => prevList.filter((ilha) => ilha.id !== ilhaId))
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
                <th>NOME</th>
                <th>DESCRIÇÃO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {ilhas ? (
                ilhas.map((ilha) => {
                  return (
                    <tr key={ilha.id}>
                      <td>{ilha.id}</td>
                      <td>{ilha.nome}</td>
                      <td>{ilha.descricao}</td>
                      <td>
                        <ActionButtons
                          onClick={(e) => {
                            localStorage.setItem(
                              'editIlha',
                              JSON.stringify(ilha),
                            )
                            navigate(`/ilha/${ilha.id}`)
                          }}
                        >
                          <PencilSimple size={18} color="#f7941e" />
                        </ActionButtons>
                        <ActionButtons
                          onClick={(e) => {
                            deleteIlha(ilha.id)
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
