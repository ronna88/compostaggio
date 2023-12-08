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
  } = useContext(IlhaContext)
  // const [lixeiras, setLixeiras] = useState([])
  // const [ilhas, setIlhas] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // console.log(lixeiras)
    if (!localStorage.getItem('lixeiras')) {
      carregarLixeiras()
    }
    console.log(lixeiras.length === 0)
    if (lixeiras.length === 0) {
      setLixeiras(JSON.parse(localStorage.getItem('lixeiras')))
    }
    if (!localStorage.getItem('ilhas')) {
      carregarIlhas()
    }
    if (ilhas.length === 0) {
      setIlhas(JSON.parse(localStorage.getItem('ilhas')))
    }
    if (!localStorage.getItem('rotas')) {
      carregarRotas()
    }
    if (rotas.length === 0) {
      setRotas(JSON.parse(localStorage.getItem('rotas')))
    }
    setTimeout(() => {
      // setLixeiras(JSON.parse(localStorage.getItem('lixeiras')))
      // setIlhas(JSON.parse(localStorage.getItem('ilhas')))
      // setRotas(JSON.parse(localStorage.getItem('rotas')))
      if (rotas.size > 0) {
        setLoading(false)
      }
    }, 2000)
    // console.log(rotas)
  }, [])

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
                <th>LIXEIRA</th>
                <th>ILHA</th>
                <th>PESO</th>
                <th>DATA</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                rotas.map((rota) => {
                  console.log(rota)
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
