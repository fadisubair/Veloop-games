import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { EconomyProvider } from './context/EconomyContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <EconomyProvider>
        <App />
      </EconomyProvider>
    </BrowserRouter>
  </StrictMode>,
)
