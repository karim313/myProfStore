import { useState, useCallback } from 'react';
import { addToCart } from '../../api/axios';

export function useCart() {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Add a single product to cart with quantity = 1.
   * Tracks loading + success state per product id.
   */
  const handleAddToCart = useCallback(async (productId: number, e?: React.MouseEvent) => {
    e?.stopPropagation(); // prevent card click / navigation
    if (loadingId === productId) return; // already in flight

    setLoadingId(productId);
    setError(null);
    try {
      await addToCart({ productId, quantity: 1 });
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 2000); // reset check-mark after 2 s
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'فشل إضافة المنتج للسلة';
      setError(msg);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoadingId(null);
    }
  }, [loadingId]);

  return { handleAddToCart, loadingId, addedId, error };
}
