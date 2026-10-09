import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Polices hébergées sur le site (pas d'appel à Google Fonts)
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/quicksand'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
