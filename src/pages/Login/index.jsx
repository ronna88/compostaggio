import { useState, useEffect, useContext } from 'react'
import {
  ButtonLogin,
  ButtonResetPassword,
  ContainerLogin,
  ContentLogin,
  ContentOptions,
  Input,
} from './styles'

import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const { signIn, forgotPassword } = useContext(AuthContext)

  function handleSubmit(event) {
    event.preventDefault()
    if (!email || !password) {
      toast.warning('Informe seu e-mail ou senha para acessar')
      return false
    }
    signIn(email, password)
    if (rememberMe) {
      const rememberInfos = {
        email,
        password,
      }

      localStorage.setItem('@rememberInfos', JSON.stringify(rememberInfos))
    }
  }

  function handleResetPassaword() {
    if (!email) {
      toast.warning('Informe seu e-mail para recuperar sua senha')
      return false
    }

    forgotPassword(email)
  }

  useEffect(() => {
    const rememberInfos = localStorage.getItem('@rememberInfos')

    if (rememberInfos) {
      const { email, password } = JSON.parse(
        localStorage.getItem('@rememberInfos'),
      )
      if (email && password) {
        setEmail(email)
        setPassword(password)
        setRememberMe(true)
      }
    }
  }, [])

  return (
    <ContainerLogin>
      <ContentLogin onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <ContentOptions>
          <div>
            <input
              checked={rememberMe}
              type="checkbox"
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Lembrar-me</span>
          </div>
          <ButtonResetPassword ativo onClick={handleResetPassaword}>
            Esqueceu sua senha ?
          </ButtonResetPassword>
        </ContentOptions>
        <ButtonLogin type="submit">LOGIN</ButtonLogin>
      </ContentLogin>
    </ContainerLogin>
  )
}
