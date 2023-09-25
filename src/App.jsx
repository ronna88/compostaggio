import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { IlhaProvider } from './contexts/IlhasContext'



function App() {

  return (
    <BrowserRouter>
      <IlhaProvider>
        <Router />
      </IlhaProvider>
    </BrowserRouter>
  )
}

export default App
