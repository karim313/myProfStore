import { addToCart } from '@/api/axios';

export async function handleAddToCart(data: { productId: number; quantity: number }) {
  const res = await addToCart(data);
  return res;
}