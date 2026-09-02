import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReviewedProductsProvider } from './Context/ReviewedProductsContext.tsx'
import { AuthProvider } from './features/context/tokenContext.tsx'
import { CartProvider } from './Context/CartContext.tsx'
import { WishlistProvider } from './Context/WishlistContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ReviewedProductsProvider>
            <App />
          </ReviewedProductsProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
