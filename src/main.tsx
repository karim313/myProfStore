import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReviewedProductsProvider } from './Context/ReviewedProductsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReviewedProductsProvider>
      <App />
    </ReviewedProductsProvider>
  </StrictMode>,
)
