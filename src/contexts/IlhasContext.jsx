import { createContext, useState } from 'react'
import { app } from '../services/firebase'
import { addDoc, collection, getFirestore, getDocs } from 'firebase/firestore'

const IlhaContext = createContext({})
const firestore = getFirestore(app)

const IlhaProvider = ({ children }) => {
  const [ilhas, setIlhas] = useState([])
  const [lixeiras, setLixeiras] = useState([])

  const carregarIlhas = () => {
    console.log('carregarIlhas...')
    const agora = new Date()
    const expireIlhas = new Date(agora.getTime() + 60 * 60 * 1000)

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
      localStorage.setItem(
        'ilhas',
        JSON.stringify(
          ilhasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        ),
      )
      localStorage.setItem('expireIlhas', expireIlhas)
    }
    if (
      !localStorage.getItem('ilhas') ||
      !localStorage.getItem('expireIlhas')
    ) {
      fetchIlhas()
    }
    if (agora > localStorage.getItem('expireIlhas')) {
      console.log('Fora do prazo de cache...')
      fetchIlhas()
    }
  }

  const carregarLixeiras = () => {
    console.log('carregarLixeiras...')
    const agora = new Date()
    const expireLixeiras = new Date(agora.getTime() + 60 * 60 * 1000)

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
      localStorage.setItem(
        'lixeiras',
        JSON.stringify(
          lixeirasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        ),
      )
      localStorage.setItem('expireLixeiras', expireLixeiras)
    }
    if (
      !localStorage.getItem('lixeiras') ||
      !localStorage.getItem('expireLixeiras') ||
      JSON.parse(localStorage.getItem('lixeiras')).length === 0
    ) {
      fetchLixeiras()
    }
    if (agora > localStorage.getItem('expireLixeiras')) {
      console.log('Fora do prazo de cache...')
      fetchLixeiras()
    }
  }

  const carregarComposteiras = () => {
    console.log('carregarComposteiras...')
    const agora = new Date()
    const expireComposteiras = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchComposteiras = async () => {
      console.log('Iniciando consulta das composteiras')
      const composteirasCollection = collection(firestore, 'composteiras')
      const composteirasSnapshot = await getDocs(composteirasCollection)
      localStorage.setItem(
        'composteiras',
        JSON.stringify(
          composteirasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        ),
      )
      localStorage.setItem('expireComposteiras', expireComposteiras)
    }
    if (
      !localStorage.getItem('composteiras') ||
      !localStorage.getItem('expireComposteiras') ||
      JSON.parse(localStorage.getItem('composteiras')).length === 0
    ) {
      fetchComposteiras()
    }
    if (agora > localStorage.getItem('expireComposteiras')) {
      console.log('Fora do prazo de cache...')
      fetchComposteiras()
    }
  }

  const carregarRotas = () => {
    console.log('carregarRotas...')
    const agora = new Date()
    const expireRotas = new Date(agora.getTime() + 60 * 60 * 1000)

    const fetchRotas = async () => {
      console.log('Iniciando consulta das rotas')
      const rotasCollection = collection(firestore, 'rotas')
      const rotasSnapshot = await getDocs(rotasCollection)
      localStorage.setItem(
        'rotas',
        JSON.stringify(
          rotasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        ),
      )
      localStorage.setItem('expireRotas', expireRotas)
    }
    if (
      !localStorage.getItem('rotas') ||
      !localStorage.getItem('expireRotas') ||
      JSON.parse(localStorage.getItem('rotas')).length === 0
    ) {
      fetchRotas()
    }
    if (agora > localStorage.getItem('expireRotas')) {
      console.log('Fora do prazo de cache...')
      fetchRotas()
    }
  }

  const ilhaContextData = {
    carregarIlhas,
    carregarLixeiras,
    ilhas,
    lixeiras,
    setIlhas,
    carregarComposteiras,
    carregarRotas,
  }

  return (
    <IlhaContext.Provider value={ilhaContextData}>
      {children}
    </IlhaContext.Provider>
  )
}

export { IlhaContext, IlhaProvider }
