import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const isV2 = window.location.pathname.replace(/\/+$/, '') === '/v2'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App ghostTyping={!isV2} />
  </StrictMode>,
)
