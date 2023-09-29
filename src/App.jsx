import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { IlhaProvider } from './contexts/IlhasContext'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './styles/theme/dafault'
import { GlobalStyle } from './styles/global'

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <IlhaProvider>
          <Router />
        </IlhaProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
