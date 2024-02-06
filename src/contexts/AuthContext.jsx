import { createContext, useEffect, useState } from 'react'
import { app } from '../services/firebase'
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const AuthContext = createContext({})

async function usuarioNormalizado(usuarioFirebase) {
  const token = await usuarioFirebase.getIdToken()
  return {
    uid: usuarioFirebase.uid,
    email: usuarioFirebase.email,
    token,
    provedor: usuarioFirebase.providerData[0].providerId,
  }
}

function gerenciarCookie(logado) {
  if (logado) {
    const d = new Date()
    var inFifteenMinutes = new Date(new Date().getTime() + 30 * 60 * 1000)
    console.log(inFifteenMinutes)
    console.log(d)
    Cookies.set('compostagio-auth', logado, {
      expires: inFifteenMinutes,
    })
  } else {
    Cookies.remove('compostagio-auth')
  }
}

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)

  const navigate = useNavigate()

  async function configurarSessao(usuarioFirebase) {
    if (usuarioFirebase?.email) {
      const usuario = await usuarioNormalizado(usuarioFirebase)
      setUsuario(usuario)
      gerenciarCookie(true)

      return usuario.email
    } else {
      setUsuario(null)
      gerenciarCookie(false)

      return false
    }
  }

  const signIn = async (email, passoword) => {
    try {
      const auth = getAuth(app)
      const reponse = await signInWithEmailAndPassword(auth, email, passoword)

      await configurarSessao(reponse.user)
      navigate('/ilha')
    } catch (err) {
      toast.error('Erro ao efetuar login')
    }
  }

  const forgotPassword = (email) => {
    const auth = getAuth(app)
    sendPasswordResetEmail(auth, email)
      .then(function () {
        toast.warning(
          'Um email de redefinição de senha foi enviado para o seu email.',
        )
      })
      .catch(function () {
        toast.error(
          'Houve um problema ao tentar enviar um e-mail de redefinição de senha.',
        )
      })
  }

  async function logout() {
    try {
      await configurarSessao(null)
      navigate('/')
    } catch {
      toast.error('Houve um problema ao tentar sair')
    }
  }

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (Cookies.get('compostagio-auth')) {
        if (user) {
          try {
            const usuario = await usuarioNormalizado(user)
            setUsuario(usuario)
          } catch (error) {
            console.error('Erro ao normalizar o usuário:', error)
          }
        } else {
          setUsuario(null)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const authContextData = {
    usuario,
    signIn,
    forgotPassword,
    logout,
  }

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
