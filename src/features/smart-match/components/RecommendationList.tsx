import type { Product } from '../../data/products';
import RecommendationCard from './RecommendationCard';

export default function RecommendationList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لم يتم العثور على منتجات تطابق تفضيلاتك.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="text-sm font-semibold text-gray-700 mb-1">المنتجات المقترحة لك:</div>
      {products.map(p => (
        <RecommendationCard key={p.id} product={p} />
      ))}
    </div>
  );
}
