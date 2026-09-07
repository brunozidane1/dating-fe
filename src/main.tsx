import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" richColors closeButton toastOptions={{ classNames: { success: 'lume-toast-success', error: 'lume-toast-error', toast: 'lume-toast' } }} />
  </StrictMode>,
)
