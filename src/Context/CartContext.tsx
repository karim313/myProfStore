import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '../interface';
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  getProductById,
} from '../api/axios';
import { useAuth } from '../features/context/tokenContext';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number, productId?: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

function getCartItemId(item: unknown): number | null {
  const obj = item as Record<string, unknown>;
  const candidates = [
    obj?.id,
    obj?.cartItemId,
    (obj?.cartItem as Record<string, unknown>)?.id,
    (obj?.cartItem as Record<string, unknown>)?.cartItemId,
  ];
  const matched = candidates.find((val) => typeof val === 'number' && Number.isFinite(val));
  return matched != null ? Number(matched) : null;
}

function getCartItemProductId(item: unknown): number | null {
  const obj = item as Record<string, unknown>;
  const candidates = [
    obj?.productId,
    (obj?.product as Record<string, unknown>)?.id,
    (obj?.product as Record<string, unknown>)?.productId,
  ];
  const matched = candidates.find((val) => typeof val === 'number' && Number.isFinite(val));
  return matched != null ? Number(matched) : null;
}

function getCartItemQuantity(item: unknown): number {
  const obj = item as Record<string, unknown>;
  return Number(obj?.quantity ?? obj?.qty ?? (obj?.cartItem as Record<string, unknown>)?.quantity ?? 1) || 1;
}

function getCartItemsPayload(data: unknown): unknown[] {
  const obj = data as Record<string, unknown>;
  if (Array.isArray(data)) return data;
  if (Array.isArray(obj?.items)) return obj.items as unknown[];
  if (Array.isArray(obj?.cartItems)) return obj.cartItems as unknown[];
  if (Array.isArray((obj?.data as Record<string, unknown>)?.items)) return (obj.data as Record<string, unknown>).items as unknown[];
  if (Array.isArray((obj?.data as Record<string, unknown>)?.cartItems)) return (obj.data as Record<string, unknown>).cartItems as unknown[];
  return [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token && !isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getCart();
      const payload = getCartItemsPayload(res);
      const fullCart = await Promise.all(
        payload.map(async (item: unknown) => {
          const cartItemId = getCartItemId(item) ?? Math.random();
          const productId = getCartItemProductId(item);
          let product: Product | null = null;
          if (productId) {
            try {
              product = await getProductById(productId);
            } catch (_) {
              /* ignore fallback product fetch failure */
            }
          }
          const itemObj = item as Record<string, unknown>;
          const fallbackProduct: Product = {
            id: productId ?? cartItemId,
            name: (itemObj?.name as string) ?? (itemObj?.productName as string) ?? 'Product',
            description: (itemObj?.description as string) ?? '',
            finalPrice: Number(itemObj?.price ?? itemObj?.finalPrice ?? 0),
            originalPrice: Number(itemObj?.originalPrice ?? itemObj?.price ?? 0),
            discountPercentage: 0,
            offerEndDate: '',
            mainImage: (itemObj?.image as string) ?? (itemObj?.mainImage as string) ?? '',
            images: [],
            mainVideo: '',
            videos: [],
            category: '',
            stockQuantity: 100,
          };

          return {
            id: cartItemId,
            productId: productId ?? cartItemId,
            quantity: getCartItemQuantity(item),
            product: product || fallbackProduct,
          };
        })
      );
      setCartItems(fullCart as CartItem[]);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Refresh cart on mount and when authentication or cartUpdated events trigger
  useEffect(() => {
    refreshCart();

    const handleCartUpdated = () => {
      refreshCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdated);
    window.addEventListener('storage', handleCartUpdated);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
      window.removeEventListener('storage', handleCartUpdated);
    };
  }, [isAuthenticated, refreshCart]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      await apiAddToCart({ productId: product.id, quantity });
      await refreshCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await apiUpdateCartItem(cartItemId, { quantity });
      // Refresh cart to ensure consistency with server
      await refreshCart();
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: number, productId?: number) => {
    try {
      await apiRemoveFromCart(productId ?? cartItemId);
      // Refresh cart to ensure consistency with server
      await refreshCart();
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await apiClearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
