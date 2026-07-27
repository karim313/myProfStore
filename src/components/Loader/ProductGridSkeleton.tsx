import React from 'react';

/**
 * Single product card skeleton: image block + shimmer sweep + two text bars
 * (title line, price line — price rendered in a faint gold tint so the
 * skeleton foreshadows real card layout).
 */
const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-3">
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-primary/5">
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent motion-reduce:hidden"
      />
    </div>
    <div className="h-3 w-3/4 rounded-full bg-brand-primary/10" />
    <div className="h-3 w-1/3 rounded-full bg-brand-accent/25" />
  </div>
);

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Page-section skeleton for a product grid — drop in wherever the real
 * <ProductGrid /> will render while data is in flight.
 */
export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 4,
  className = '',
}) => (
  <div
    role="status"
    aria-label="Loading products"
    className={`grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 ${className}`}
  >
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export default ProductGridSkeleton;
