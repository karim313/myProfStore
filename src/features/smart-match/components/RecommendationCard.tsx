import React from 'react';
import type { Product } from '../../../data/products';

export default function RecommendationCard({ product }: { product: Product }) {
  return (
    <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img src={product.imageCover} alt={product.title} className="w-20 h-20 object-cover" />
      <div className="p-3 flex flex-col justify-center flex-1">
        <h4 className="font-semibold text-sm text-[#00342B] line-clamp-1">{product.title}</h4>
        <p className="text-emerald-500 font-bold text-sm mt-1">{product.price.toLocaleString()} د.ع</p>
      </div>
    </div>
  );
}
