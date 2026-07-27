import { useState, useEffect } from 'react';
import FullScreenLoader from './FullScreenLoader';
import { LoadingButton } from './ButtonLoader';
import { ProductGridSkeleton } from './ProductGridSkeleton';

/**
 * Reference usage — not required for production, but shows how the three
 * loaders compose in a real page: full-screen on initial load, skeleton
 * while product data streams in, button loader on the add-to-cart action.
 */
const LoaderShowcase = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Simulate initial page load
  useEffect(() => {
    const t1 = setTimeout(() => setInitialLoading(false), 1800);
    const t2 = setTimeout(() => setProductsLoading(false), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (initialLoading) {
    return <FullScreenLoader label="Loading" subLabel="Curating your selection" />;
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-lg font-medium tracking-wide text-brand-primary">New Arrivals</h1>
          <LoadingButton
            isLoading={addingToCart}
            loadingText="Adding"
            onClick={() => {
              setAddingToCart(true);
              setTimeout(() => setAddingToCart(false), 1600);
            }}
          >
            Add to bag
          </LoadingButton>
        </div>

        {productsLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {/* Real product cards render here once data resolves */}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoaderShowcase;
