import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { IlhaProvider } from './contexts/IlhasContext'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './styles/theme/dafault'
import { GlobalStyle } from './styles/global'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <AuthProvider>
          <IlhaProvider>
            <Router />
          </IlhaProvider>
        </AuthProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
