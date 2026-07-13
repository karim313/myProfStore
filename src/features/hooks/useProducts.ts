import { useState, useEffect } from 'react';
import { getProducts } from '../../api/axios';
import type { Product } from '../../data/products';

// Simple in-memory cache to prevent redundant API calls
let cachedProducts: Product[] | null = null;
let fetchPromise: Promise<Product[]> | null = null;

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(cachedProducts || []);
  const [loading, setLoading] = useState<boolean>(!cachedProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedProducts) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = getProducts();
    }

    fetchPromise
      .then((data) => {
        // Extra safety: guarantee we always store an array
        const safeData = Array.isArray(data) ? data : [];
        cachedProducts = safeData;
        setProducts(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch products');
        setLoading(false);
        fetchPromise = null; // Reset on failure
      });
  }, []);

  return { products, loading, error };
};
