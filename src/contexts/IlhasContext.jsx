import { createContext, useEffect, useState } from 'react'
import { app } from '../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  orderBy,
  query,
  doc,
  where,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  getDocsFromCache,
  getDocsFromServer,
  getDocFromServer,
} from 'firebase/firestore'

// TODO: Ajustar Where Clause na busca da listagem das lixeiras

const IlhaContext = createContext({})
const firestore = getFirestore(app)

const IlhaProvider = ({ children }) => {
  const [ilhas, setIlhas] = useState([])
  const [lixeiras, setLixeiras] = useState([])
  const [composteiras, setComposteiras] = useState([])
  const [rotasSemDespejo, setRotasSemDespejo] = useState([])
  const [rotas, setRotas] = useState([])
  const [edit, setEdit] = useState(false)

  const [pesoBombonaOrganica, setPesoBombonaOrganica] = useState()
  const [pesoBombonaJardinagem, setPesoBombonaJardinagem] = useState()

  const carregarIlhas = () => {
    console.log('carregarIlhas...')
    // const agora = new Date()
    // const expireIlhas = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchIlhas = async () => {
      console.log('iniciando consulta de ilhas')
      const ilhasCollection = collection(firestore, 'ilhas')
      const ilhasSnapshot = await getDocsFromCache(ilhasCollection)
      setIlhas(
        ilhasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    fetchIlhas()
  }
  const carregarIlhasServer = () => {
    console.log('carregarIlhasServer...')
    // const agora = new Date()
    // const expireIlhas = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchIlhas = async () => {
      console.log('iniciando consulta de ilhas')
      const ilhasCollection = collection(firestore, 'ilhas')
      const ilhasSnapshot = await getDocsFromServer(ilhasCollection)
      setIlhas(
        ilhasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    fetchIlhas()
  }

  const carregarLixeiras = () => {
    console.log('carregarLixeiras...')
    const fetchLixeiras = async () => {
      console.log('iniciando consulta de lixeiras')
      const lixeirasCollection = collection(firestore, 'lixeiras')
      const lixeirasSnapshot = await getDocsFromCache(
        query(lixeirasCollection, where('deleted', '!=', true)),
      )
      setLixeiras(
        lixeirasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    fetchLixeiras()
  }
  const carregarLixeirasServer = () => {
    console.log('carregarLixeiras...')
    const fetchLixeiras = async () => {
      console.log('iniciando consulta de lixeiras')
      const lixeirasCollection = collection(firestore, 'lixeiras')
      const lixeirasSnapshot = await getDocsFromServer(
        query(lixeirasCollection, where('deleted', '!=', true)),
      )
      setLixeiras(
        lixeirasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    fetchLixeiras()
  }

  const carregarComposteiras = () => {
    console.log('carregarComposteiras...')
    // const agora = new Date()
    // const expireComposteiras = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchComposteiras = async () => {
      console.log('Iniciando consulta das composteiras')
      const composteirasCollection = collection(firestore, 'composteiras')
      const composteirasSnapshot = await getDocsFromCache(
        composteirasCollection,
      )
      setComposteiras(
        composteirasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    console.log(composteiras)
    fetchComposteiras()
  }
  const carregarComposteirasServer = () => {
    console.log('carregarComposteiras...')
    // const agora = new Date()
    // const expireComposteiras = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchComposteiras = async () => {
      console.log('Iniciando consulta das composteiras')
      const composteirasCollection = collection(firestore, 'composteiras')
      const composteirasSnapshot = await getDocsFromServer(
        composteirasCollection,
      )
      setComposteiras(
        composteirasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    fetchComposteiras()
  }

  const carregarRotas = () => {
    console.log('carregarRotas...')
    // const agora = new Date()
    // const expireRotas = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchRotas = async () => {
      console.log('Iniciando consulta das rotas')
      const rotasCollection = collection(firestore, 'rotas')
      const rotasSnapshot = await getDocsFromCache(
        query(rotasCollection, orderBy('date', 'asc')),
      )
      setRotas(
        rotasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    fetchRotas()
  }
  const carregarRotasServer = () => {
    console.log('carregarRotas...')
    // const agora = new Date()
    // const expireRotas = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchRotas = async () => {
      console.log('Iniciando consulta das rotas')
      const rotasCollection = collection(firestore, 'rotas')
      const rotasSnapshot = await getDocsFromServer(
        query(rotasCollection, orderBy('date', 'asc')),
      )
      setRotas(
        rotasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    }
    fetchRotas()
  }

  const carregarRotasDisponiveis = () => {
    const fetchRotasDisponiveis = async () => {
      console.log('Iniciando consulta das rotas')
      const rotasCollection = collection(firestore, 'rotas')
      const rotasSnapshot = await getDocsFromCache(rotasCollection)

      await setRotasSemDespejo(
        rotasSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((r) => r.livre !== 'nao'),
      )
    }
    fetchRotasDisponiveis()
  }
  const carregarRotasDisponiveisServer = () => {
    const fetchRotasDisponiveisServer = async () => {
      console.log('Iniciando consulta das rotas')
      const rotasCollection = collection(firestore, 'rotas')
      const rotasSnapshot = await getDocsFromServer(rotasCollection)
      await setRotasSemDespejo(
        rotasSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((r) => r.livre !== 'nao'),
      )
    }
    fetchRotasDisponiveisServer()
  }

  const carregarBombonaOrganicaServer = () => {
    const fetchBombonaOrganicaServer = async () => {
      const bombonaOrganicaCollection = doc(
        firestore,
        'pesoBombonaOrganica',
        '4ZSXBbuA83ijYjp9Ml9P',
      )

      const bombonaOrganicaSnapshot = await getDocFromServer(
        bombonaOrganicaCollection,
      )

      await setPesoBombonaOrganica(bombonaOrganicaSnapshot.data().peso)
    }
    fetchBombonaOrganicaServer()
  }
  const carregarBombonaJardinagemServer = () => {
    const fetchBombonaJardinagemServer = async () => {
      const bombonaJardinagemCollection = doc(
        firestore,
        'pesoBombonaJardinagem',
        'xo9lP0Fpnz9gB0Mh8Ez4',
      )

      const bombonaJardinagemSnapshot = await getDocFromServer(
        bombonaJardinagemCollection,
      )

      await setPesoBombonaJardinagem(bombonaJardinagemSnapshot.data().peso)
    }
    fetchBombonaJardinagemServer()
  }

  const ilhaContextData = {
    carregarIlhas,
    carregarLixeiras,
    ilhas,
    setIlhas,
    lixeiras,
    setLixeiras,
    carregarComposteiras,
    carregarRotas,
    composteiras,
    setComposteiras,
    rotasSemDespejo,
    setRotasSemDespejo,
    rotas,
    setRotas,
    carregarRotasDisponiveis,
    carregarIlhasServer,
    carregarLixeirasServer,
    carregarComposteirasServer,
    carregarRotasServer,
    carregarRotasDisponiveisServer,
    carregarBombonaOrganicaServer,
    setPesoBombonaOrganica,
    pesoBombonaOrganica,
    carregarBombonaJardinagemServer,
    pesoBombonaJardinagem,
    edit,
    setEdit,
  }

  return (
    <IlhaContext.Provider value={ilhaContextData}>
      {children}
    </IlhaContext.Provider>
  )
}

export { IlhaContext, IlhaProvider }
