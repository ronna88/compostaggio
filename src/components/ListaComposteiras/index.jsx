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

export function ListaComposteira() {
  const firestore = getFirestore(app)
  // const [composteiras, setComposteiras] = useState([])
  const [loading, setLoading] = useState([])
  const { carregarComposteiras, composteiras, setComposteiras } =
    useContext(IlhaContext)
  const navigate = useNavigate()

  useEffect(() => {
    console.log(composteiras)
    if (composteiras.length === 0) {
      carregarComposteiras()
    }
  }, [])

  const deleteComposteira = async (composteiraId) => {
    const composteiraRef = doc(firestore, 'composteiras', composteiraId)
    try {
      await deleteDoc(composteiraRef)
      console.log('Composteira Excluida')
      setComposteiras((prevList) =>
        prevList.filter((composteira) => composteira.id !== composteiraId),
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
                <th>NOME</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {composteiras ? (
                composteiras.map((composteira) => {
                  return (
                    <tr key={composteira.id}>
                      <td>{composteira.id}</td>
                      <td>{composteira.nome}</td>
                      <td>
                        <ActionButtons
                          onClick={(e) => {
                            e.preventDefault()
                            navigate(`/composteira/${composteira.id}`)
                          }}
                        >
                          <PencilSimple size={18} color="#f7941e" />
                        </ActionButtons>
                        <ActionButtons
                          onClick={(e) => {
                            deleteComposteira(composteira.id)
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
