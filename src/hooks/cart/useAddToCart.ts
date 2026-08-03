import { useState, useCallback } from 'react';
import { handleAddToCart } from '../../helper/addToCart';
import { toast } from 'sonner';

export type AddToCartState = 'idle' | 'loading' | 'success' | 'error';

export function useAddToCart() {
  const [status, setStatus] = useState<AddToCartState>('idle');

  const addToCart = useCallback(async (productId: number) => {
    if (status === 'loading') return false;

    setStatus('loading');
    try {
      await handleAddToCart({ productId, quantity: 1 });
      setStatus('success');
      
      toast.success('Added to cart successfully', {
        duration: 2000,
        className: 'bg-white border border-gray-100 shadow-xl rounded-xl text-sm font-semibold text-gray-900',
      });

      // Try mobile vibration
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(15);
        } catch (e) {
          // ignore
        }
      }

      // Reset success state after animation duration to allow re-adds
      setTimeout(() => setStatus('idle'), 2000);
      return true;

    } catch (error) {
      console.error('Failed to add to cart:', error);
      setStatus('error');
      
      toast.error('Failed to add to cart. Please try again.', {
        duration: 3000,
      });

      // Reset error state
      setTimeout(() => setStatus('idle'), 2000);
      return false;
    }
  }, [status]);

  return { status, addToCart };
}
