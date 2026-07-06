import React from 'react';
import type { Product } from '../../../data/products';
import RecommendationCard from './RecommendationCard';

export default function RecommendationList({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="text-sm font-semibold text-gray-700 mb-1">المنتجات المقترحة لك:</div>
      {products.map(p => (
        <RecommendationCard key={p.id} product={p} />
      ))}
    </div>
  );
}
