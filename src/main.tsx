import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReviewedProductsProvider } from './Context/ReviewedProductsContext.tsx'
import { AuthProvider } from './features/context/tokenContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ReviewedProductsProvider>
        <App />
      </ReviewedProductsProvider>
    </AuthProvider>
  </StrictMode>,
)
