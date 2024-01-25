import { useEffect, useState } from 'react'
import {
  getFirestore,
  getDocs,
  collection,
  query,
  orderBy,
  where,
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
  FilterButtons,
  DateInput,
  LabelForm,
  FormContainer,
  FormButton,
  DownloadLink,
} from './styles'

export function Monitoramento() {
  const firestore = getFirestore(app)
  const [monitoramentos, setMonitoramentos] = useState([])
  const [monitoramentos2, setMonitoramentos2] = useState([])
  const [monitoramentos3, setMonitoramentos3] = useState([])
  const [monitoramentos4, setMonitoramentos4] = useState([])
  const [monitoramentos5, setMonitoramentos5] = useState([])
  const [monitoramentos6, setMonitoramentos6] = useState([])
  const [monitoramentos7, setMonitoramentos7] = useState([])
  const [monitoramentos8, setMonitoramentos8] = useState([])
  const [loading, setLoading] = useState([])
  const [selectedMonitoramento, setSelectedMonitoramento] = useState([])
  const [selected, setSelected] = useState()
  const [inicio, setInicio] = useState()
  const [final, setFinal] = useState()

  const carregarMonitoramentos = (inicio, final) => {
    setLoading(true)
    const agora = new Date()
    // const expireMonitoramentos = new Date(agora.getTime() + 60 * 60 * 1000)
    const dataSemFiltro =
      agora.getFullYear() +
      '/' +
      ('0' + (agora.getMonth() + 1)).slice(-2) +
      '/' +
      ('0' + (agora.getDate() - 5)).slice(-2)

    const fetchMonitoramentos = async (inicio, final) => {
      const monitoramentoCollection = collection(firestore, 'monitoramento1')
      if (!final) {
        final = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
      }
      if (!inicio) {
        inicio = dataSemFiltro
      }
      const q = query(
        monitoramentoCollection,
        where('timestamp', '>=', Date.parse(inicio) / 1000),
        where('timestamp', '<=', Date.parse(final) / 1000),
        orderBy('timestamp', 'asc'),
      )
      const monitoramentosSnapshot = await getDocs(q)
      setMonitoramentos(
        monitoramentosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    const fetchMonitoramentos2 = async (inicio, final) => {
      const monitoramento2Collection = collection(firestore, 'monitoramento2')
      if (!final) {
        final = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
      }
      if (!inicio) {
        inicio = dataSemFiltro
      }
      const q = query(
        monitoramento2Collection,
        where('timestamp', '>=', Date.parse(inicio) / 1000),
        where('timestamp', '<=', Date.parse(final) / 1000),
        orderBy('timestamp', 'asc'),
      )
      const monitoramentos2Snapshot = await getDocs(q)
      setMonitoramentos2(
        monitoramentos2Snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    const fetchMonitoramentos3 = async (inicio, final) => {
      const monitoramento3Collection = collection(firestore, 'monitoramento3')
      if (!final) {
        final = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
      }
      if (!inicio) {
        inicio = dataSemFiltro
      }
      const q = query(
        monitoramento3Collection,
        where('timestamp', '>=', Date.parse(inicio) / 1000),
        where('timestamp', '<=', Date.parse(final) / 1000),
        orderBy('timestamp', 'asc'),
      )
      const monitoramentos3Snapshot = await getDocs(q)
      setMonitoramentos3(
        monitoramentos3Snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    const fetchMonitoramentos4 = async (inicio, final) => {
      const monitoramento4Collection = collection(firestore, 'monitoramento4')
      if (!final) {
        final = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
      }
      if (!inicio) {
        inicio = dataSemFiltro
      }
      const q = query(
        monitoramento4Collection,
        where('timestamp', '>=', Date.parse(inicio) / 1000),
        where('timestamp', '<=', Date.parse(final) / 1000),
        orderBy('timestamp', 'asc'),
      )
      const monitoramentos4Snapshot = await getDocs(q)
      setMonitoramentos4(
        monitoramentos4Snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    const fetchMonitoramentos5 = async (inicio, final) => {
      const monitoramento5Collection = collection(firestore, 'monitoramento5')
      if (!final) {
        final = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
      }
      if (!inicio) {
        inicio = dataSemFiltro
      }
      const q = query(
        monitoramento5Collection,
        where('timestamp', '>=', Date.parse(inicio) / 1000),
        where('timestamp', '<=', Date.parse(final) / 1000),
        orderBy('timestamp', 'asc'),
      )
      const monitoramentos5Snapshot = await getDocs(q)
      setMonitoramentos5(
        monitoramentos5Snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    const fetchMonitoramentos6 = async (inicio, final) => {
      const monitoramento6Collection = collection(firestore, 'monitoramento6')
      if (!final) {
        final = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
      }
      if (!inicio) {
        inicio = dataSemFiltro
      }
      const q = query(
        monitoramento6Collection,
        where('timestamp', '>=', Date.parse(inicio) / 1000),
        where('timestamp', '<=', Date.parse(final) / 1000),
        orderBy('timestamp', 'asc'),
      )
      const monitoramentos6Snapshot = await getDocs(q)
      setMonitoramentos6(
        monitoramentos6Snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    const fetchMonitoramentos7 = async (inicio, final) => {
      const monitoramento7Collection = collection(firestore, 'monitoramento7')
      if (!final) {
        final = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
      }
      if (!inicio) {
        inicio = dataSemFiltro
      }
      const q = query(
        monitoramento7Collection,
        where('timestamp', '>=', Date.parse(inicio) / 1000),
        where('timestamp', '<=', Date.parse(final) / 1000),
        orderBy('timestamp', 'asc'),
      )
      const monitoramentos7Snapshot = await getDocs(q)
      setMonitoramentos7(
        monitoramentos7Snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    const fetchMonitoramentos8 = async (inicio, final) => {
      const monitoramento8Collection = collection(firestore, 'monitoramento8')
      if (!final) {
        final = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
      }
      if (!inicio) {
        inicio = dataSemFiltro
      }
      const q = query(
        monitoramento8Collection,
        where('timestamp', '>=', Date.parse(inicio) / 1000),
        where('timestamp', '<=', Date.parse(final) / 1000),
        orderBy('timestamp', 'asc'),
      )
      const monitoramentos8Snapshot = await getDocs(q)
      setMonitoramentos8(
        monitoramentos8Snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    fetchMonitoramentos(inicio, final)
    fetchMonitoramentos2(inicio, final)
    fetchMonitoramentos3(inicio, final)
    fetchMonitoramentos4(inicio, final)
    fetchMonitoramentos5(inicio, final)
    fetchMonitoramentos6(inicio, final)
    fetchMonitoramentos7(inicio, final)
    fetchMonitoramentos8(inicio, final)
  }

  useEffect(() => {
    if (monitoramentos.length === 0) {
      carregarMonitoramentos(inicio, final)
    }

    if (!selectedMonitoramento) {
      setSelectedMonitoramento(monitoramentos)
    }
  }, [])

  const handleClickFilter = (e) => {
    setSelected(e.target.attributes[0].nodeValue)
    switch (e.target.attributes[0].nodeValue) {
      case '1':
        setSelectedMonitoramento(monitoramentos)
        break
      case '2':
        setSelectedMonitoramento(monitoramentos2)
        break
      case '3':
        setSelectedMonitoramento(monitoramentos3)
        break
      case '4':
        setSelectedMonitoramento(monitoramentos4)
        break
      case '5':
        setSelectedMonitoramento(monitoramentos5)
        break
      case '6':
        setSelectedMonitoramento(monitoramentos6)
        break
      case '7':
        setSelectedMonitoramento(monitoramentos7)
        break
      case '8':
        setSelectedMonitoramento(monitoramentos8)
        break
      default:
        setSelectedMonitoramento(monitoramentos)
    }
  }

  const filterData = () => {
    // console.log('botao')
    carregarMonitoramentos(inicio, final)
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
            <FilterButtons
              label="7"
              selected={selected}
              onClick={handleClickFilter}
            >
              COMPOSTEIRA 7
            </FilterButtons>
            <FilterButtons
              label="8"
              selected={selected}
              onClick={handleClickFilter}
            >
              COMPOSTEIRA 8
            </FilterButtons>
          </FilterButtonContainer>
          <FormContainer>
            <div>
              <LabelForm className="form-label">Data e Hora Inicial:</LabelForm>
              <DateInput
                selected={inicio}
                onChange={(inicio) => setInicio(inicio)}
                timeInputLabel="Time:"
                dateFormat="dd/MM/yyyy h:mm aa"
                showTimeInput
              />
            </div>
            <div>
              <LabelForm className="form-label">Data e Hora Final:</LabelForm>
              <DateInput
                selected={final}
                onChange={(final) => setFinal(final)}
                timeInputLabel="Time:"
                dateFormat="dd/MM/yyyy h:mm aa"
                showTimeInput
              />
            </div>
            <div>
              <FormButton onClick={filterData}>Filtrar</FormButton>
            </div>
            <div>
              <DownloadLink id="btn-export" onClick={exportData}>
                Exportar
              </DownloadLink>
            </div>
          </FormContainer>
        </CardHeader>
        <ContainerTable>
          <TableData id="my-table">
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
              {selectedMonitoramento ? (
                selectedMonitoramento.map((monitoramento) => {
                  return (
                    <tr key={monitoramento.id}>
                      <td>{monitoramento.data_hora}</td>
                      <td>
                        {parseFloat(monitoramento.temperatura1).toFixed(2)}°C
                      </td>
                      <td>{monitoramento.umidade1}%</td>
                      <td>
                        {parseFloat(monitoramento.temperatura2).toFixed(2)}°C
                      </td>
                      <td>{monitoramento.umidade2}%</td>
                      <td>
                        {parseFloat(monitoramento.temperatura3).toFixed(2)}°C
                      </td>
                      <td>{monitoramento.umidade3}%</td>
                      <td>
                        {parseFloat(monitoramento.temperatura4).toFixed(2)}°C
                      </td>
                      <td>{monitoramento.umidade4}%</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={9}>Carregando dados....</td>
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
