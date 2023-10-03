import { useContext, useEffect, useState } from 'react'
import { IlhaContext } from '../../contexts/IlhasContext'
import { useNavigate } from 'react-router-dom'
import {
  getFirestore,
  getDocs,
  collection,
  query,
  orderBy,
  Query,
} from 'firebase/firestore'
import { app } from '../../services/firebase'
import {
  Card,
  CardHeader,
  Container,
  ContainerTable,
  FilterButtonContainer,
  TableData,
  TitleCard,
  ActionButtons,
  FilterButtons,
} from './styles'
import { PencilSimple, Trash } from '@phosphor-icons/react'

export function Monitoramento() {
  const firestore = getFirestore(app)
  const { carregarIlhas } = useContext(IlhaContext)
  const [monitoramentos, setMonitoramentos] = useState([])
  const [selected, setSelected] = useState('1')
  const navigate = useNavigate()

  const carregarMonitoramentos = () => {
    const agora = new Date()
    const expireMonitoramentos = new Date(agora.getTime() + 60 * 60 * 1000)
    const fetchMonitoramentos = async () => {
      const monitoramentoCollection = collection(firestore, 'monitoramento1')
      const q = query(monitoramentoCollection, orderBy('data_hora', 'desc'))
      const monitoramentosSnapshot = await getDocs(q)
      setMonitoramentos(
        monitoramentosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
      localStorage.setItem(
        'monitoramentos',
        JSON.stringify(
          monitoramentosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        ),
      )
      localStorage.setItem('expireMonitoramentos', expireMonitoramentos)
    }
    if (
      !localStorage.getItem('monitoramentos') ||
      !localStorage.getItem('expireMonitoramentos')
    ) {
      fetchMonitoramentos()
    }
    if (agora > localStorage.getItem('expireMonitoramentos')) {
      fetchMonitoramentos()
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('monitoramentos')) {
      carregarMonitoramentos()
    }

    if (monitoramentos.length === 0) {
      setMonitoramentos(JSON.parse(localStorage.getItem('monitoramentos')))
    }
  }, [monitoramentos])

  const handleClickFilter = (e) => {
    setSelected(e.target.attributes[0].nodeValue)
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <TitleCard>MONITORAMENTO</TitleCard>
          <FilterButtonContainer>
            <FilterButtons
              label="1"
              selected={selected}
              onClick={handleClickFilter}
            >
              COMPOSTEIRA 1
            </FilterButtons>
            <FilterButtons
              label="2"
              selected={selected}
              onClick={handleClickFilter}
            >
              COMPOSTEIRA 2
            </FilterButtons>
            <FilterButtons
              label="3"
              selected={selected}
              onClick={handleClickFilter}
            >
              COMPOSTEIRA 3
            </FilterButtons>
            <FilterButtons
              label="4"
              selected={selected}
              onClick={handleClickFilter}
            >
              COMPOSTEIRA 4
            </FilterButtons>
            <FilterButtons
              label="5"
              selected={selected}
              onClick={handleClickFilter}
            >
              COMPOSTEIRA 5
            </FilterButtons>
            <FilterButtons
              label="6"
              selected={selected}
              onClick={handleClickFilter}
            >
              COMPOSTEIRA 6
            </FilterButtons>
          </FilterButtonContainer>
        </CardHeader>
        <ContainerTable>
          <TableData>
            <thead>
              <tr>
                <th>Data Hora</th>
                <th>TEMPERATURA 1</th>
                <th>UMIDADE 1</th>
                <th>TEMPERATURA 2</th>
                <th>UMIDADE 2</th>
                <th>TEMPERATURA 3</th>
                <th>UMIDADE 3</th>
                <th>TEMPERATURA 4</th>
                <th>UMIDADE 4</th>
              </tr>
            </thead>
            <tbody>
              {monitoramentos ? (
                monitoramentos.map((monitoramento) => {
                  return (
                    <tr key={monitoramento.id}>
                      <td>{monitoramento.data_hora}</td>
                      <td>{monitoramento.temperatura1}°C</td>
                      <td>{monitoramento.umidade1}%</td>
                      <td>{monitoramento.temperatura2}°C</td>
                      <td>{monitoramento.umidade2}%</td>
                      <td>{monitoramento.temperatura3}°C</td>
                      <td>{monitoramento.umidade3}%</td>
                      <td>{monitoramento.temperatura4}°C</td>
                      <td>{monitoramento.umidade4}%</td>
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
