import { createContext, useEffect, useState } from 'react'
import { app } from '../services/firebase'
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  orderBy,
  query,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
} from 'firebase/firestore'

const firestore = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})

const IlhaContext = createContext({})
const firestoreDb = getFirestore(app)

const IlhaProvider = ({ children }) => {
  const [ilhas, setIlhas] = useState([])
  const [lixeiras, setLixeiras] = useState([])
  const [composteiras, setComposteiras] = useState([])
  const [rotasSemDespejo, setRotasSemDespejo] = useState([])
  const [rotas, setRotas] = useState([])

  const carregarIlhas = () => {
    console.log('carregarIlhas...')
    // const agora = new Date()
    // const expireIlhas = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchIlhas = async () => {
      console.log('iniciando consulta de ilhas')
      const ilhasCollection = collection(firestore, 'ilhas')
      const ilhasSnapshot = await getDocs(ilhasCollection)
      setIlhas(
        ilhasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
      // console.log(ilhasSnapshot)
    }
    // console.log(ilhas)
    fetchIlhas()
  }

  const carregarLixeiras = () => {
    console.log('carregarLixeiras...')
    // const agora = new Date()
    // const expireLixeiras = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchLixeiras = async () => {
      console.log('iniciando consulta de lixeiras')
      const lixeirasCollection = collection(firestore, 'lixeiras')
      const lixeirasSnapshot = await getDocs(lixeirasCollection)
      setLixeiras(
        lixeirasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
      console.log(lixeirasSnapshot)
    }
    console.log(lixeiras)
    fetchLixeiras()
  }

  const carregarComposteiras = () => {
    console.log('carregarComposteiras...')
    // const agora = new Date()
    // const expireComposteiras = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchComposteiras = async () => {
      console.log('Iniciando consulta das composteiras')
      const composteirasCollection = collection(firestore, 'composteiras')
      const composteirasSnapshot = await getDocs(composteirasCollection)
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
      const rotasSnapshot = await getDocs(
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
      const rotasSnapshot = await getDocs(rotasCollection)

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
  }

  return (
    <IlhaContext.Provider value={ilhaContextData}>
      {children}
    </IlhaContext.Provider>
  )
}

export { IlhaContext, IlhaProvider }
