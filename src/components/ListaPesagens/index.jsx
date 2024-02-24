import { useContext, useEffect, useState } from 'react'
import { IlhaContext } from '../../contexts/IlhasContext'
import { useNavigate } from 'react-router-dom'
import { app } from '../../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
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
import { toast } from 'react-toastify'

export function ListaPesagens() {
  const firestore = getFirestore(app)
  const {
    edit,
    setEdit,
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
    carregarBombonaJardinagemServer,
    carregarBombonaOrganicaServer,
    pesoBombonaJardinagem,
    pesoBombonaOrganica,
  } = useContext(IlhaContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    if (!carregado) {
        carregarLixeirasServer()
        carregarIlhasServer()
        carregarRotasServer()
        carregarBombonaJardinagemServer()
        carregarBombonaOrganicaServer()
        setCarregado(true)
    }
  }, [lixeiras, carregado, ilhas, rotas, pesoBombonaJardinagem, pesoBombonaOrganica])

useEffect(() => {
  console.log(`peso Organico: ${pesoBombonaOrganica}`)
  console.log(`peso Jardinagem: ${pesoBombonaJardinagem}`)
},[pesoBombonaOrganica, pesoBombonaJardinagem])

  const filterNomeIlha = (ilhaId) => {
    const ilha = ilhas.find((i) => i.id === ilhaId)
    if (ilha) {
      return ilha.nome
    }
  }

  const atualizarBombona = (tipoLixeira, pesoRota) => {
    let bombonaId
    let pesoBombona 
    let nomeBombona
    if(tipoLixeira === 'Orgânico') {
      bombonaId = '4ZSXBbuA83ijYjp9Ml9P'
      pesoBombona = pesoBombonaOrganica
      nomeBombona = 'pesoBombonaOrganica'
    }
    if(tipoLixeira === 'Jardinagem') {
      bombonaId = 'xo9lP0Fpnz9gB0Mh8Ez4'
      pesoBombona = pesoBombonaJardinagem
      nomeBombona = 'pesoBombonaJardinagem'
    }

    updateDoc(doc(collection(firestore, nomeBombona), bombonaId), {
      peso: (parseFloat(pesoBombona) - parseFloat(pesoRota)).toFixed(2)
    })
      .then(() => {
        toast.success('Atualização realizada com sucesso no peso da Bombona')
        if (tipoLixeira === 'Jardinagem') {
          carregarBombonaJardinagemServer()
        } else {
          carregarBombonaOrganicaServer()
        }
      })
      .catch(() => {
        toast.error('Erro ao atualizar o peso da Bombona')
      })
  }

  const deleteRota = async (rotaId) => {

    const pesoRota = rotas.find((r) => r.id === rotaId).peso
    const tipoLixeira = lixeiras.find((l) => l.id === rotas.find((r) => r.id === rotaId).idLixeira).nome

    const rotaRef = doc(firestore, 'rotas', rotaId)
    try {
      await deleteDoc(rotaRef)
      console.log('Rota Excluida')
      toast.success('Rota excluída com sucesso')
      setRotas((prevList) => prevList.filter((rota) => rota.id !== rotaId))
      carregarRotasServer()
      if(tipoLixeira === 'Jardinagem' || tipoLixeira === 'Orgânico') {
        atualizarBombona(tipoLixeira, pesoRota)
      }
    } catch(error) {
      console.log('Erro ao excluir rota ' + error)
      toast.error('Erro ao excluir Rota de Pesagem')
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
                            setEdit(true)
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
