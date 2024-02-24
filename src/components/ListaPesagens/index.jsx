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
  DownloadLink,
} from './styles'
import { PencilSimple, Trash } from '@phosphor-icons/react'

export function ListaPesagens() {
  const firestore = getFirestore(app)
  const {
    lixeiras,
    setLixeiras,
    carregarLixeiras,
    carregarIlhas,
    ilhas,
    setIlhas,
    carregarRotas,
    rotas,
    setRotas,
    carregarLixeirasServer,
    carregarIlhasServer,
    carregarRotasServer,
  } = useContext(IlhaContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [carregado, setCarregado] = useState(false)
  const [carregado2, setCarregado2] = useState(false)
  const [carregado3, setCarregado3] = useState(false)

  // TODO: ao excluir atualizar o peso total da bombona

  useEffect(() => {
    if (!carregado) {
      if (lixeiras.length === 0) {
        carregarLixeirasServer()
        setCarregado(true)
      }
    }
  }, [lixeiras, carregado])

  useEffect(() => {
    if (!carregado2) {
      if (ilhas.length === 0) {
        carregarIlhasServer()
        setCarregado2(true)
      }
    }
  }, [ilhas, carregado2])

  useEffect(() => {
    if (!carregado3) {
      if (rotas.length === 0) {
        carregarRotasServer()
        setCarregado3(true)
      }
    }
  }, [rotas, carregado3])

  const filterNomeIlha = (ilhaId) => {
    const ilha = ilhas.find((i) => i.id === ilhaId)
    if (ilha) {
      return ilha.nome
    }
  }

  const deleteRota = async (rotaId) => {
    const rotaRef = doc(firestore, 'rotas', rotaId)
    try {
      await deleteDoc(rotaRef)
      console.log('Rota Excluida')
      setRotas((prevList) => prevList.filter((rota) => rota.id !== rotaId))
    } catch {
      console.log()
    }
  }

  const getLixeira = (idLixeira) => {
    const lix = lixeiras.find((l) => l.id === idLixeira)
    if (lix) {
      return lix
    }
  }

  const exportData = () => {
    const tableRows = document.querySelectorAll('tr')
    const CSVString = Array.from(tableRows)
      .map((row) =>
        Array.from(row.cells)
          .map((cell) => cell.textContent)
          .join(';'),
      )
      .join('\n')
    document
      .getElementById('btn-export')
      .setAttribute(
        'href',
        `data:text/csvcharset=utf-8,${encodeURIComponent(CSVString)}`,
      )

    document.getElementById('btn-export').setAttribute('download', 'table.csv')
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <TitleCard>LISTAGEM</TitleCard>
          <SearchBar>
            <input type="text" />
          </SearchBar>
          <div>
            <DownloadLink id="btn-export" onClick={exportData}>
              Exportar
            </DownloadLink>
          </div>
        </CardHeader>
        <ContainerTable>
          <TableData id="my-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>LIXEIRA</th>
                <th>ILHA</th>
                <th>PESO</th>
                <th>DATA</th>
              </tr>
            </thead>
            <tbody>
              {rotas ? (
                rotas.map((rota) => {
                  const date = new Date(rota.date.seconds * 1000)
                  const formattedDate = date.toLocaleDateString('pt-BR')
                  return (
                    <tr key={rota.id}>
                      <td>{rota.id}</td>
                      <td>
                        {getLixeira(rota.idLixeira)?.descricao} -{' '}
                        {getLixeira(rota.idLixeira)?.nome}
                      </td>
                      <td>
                        {filterNomeIlha(getLixeira(rota.idLixeira)?.ilha)}
                      </td>
                      <td>{rota.peso} Kg</td>
                      <td>{formattedDate}</td>
                      <td>
                        <ActionButtons
                          onClick={(e) => {
                            localStorage.setItem(
                              'editRota',
                              JSON.stringify(rota),
                            )
                            navigate(`/rota/${rota.id}`)
                          }}
                        >
                          <PencilSimple size={18} color="#f7941e" />
                        </ActionButtons>
                        <ActionButtons
                          onClick={(e) => {
                            deleteRota(rota.id)
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
