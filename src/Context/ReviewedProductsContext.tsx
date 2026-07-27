import { createContext, useContext, useEffect, useState } from "react";
import { getProducts, getProductReview } from "../api/axios";
import type { Product, ProductReview } from "../interface";

export type ReviewedProduct = Product & {
  averageRating: number;
  reviewsCount: number;
  comments: ProductReview[];
};

type ReviewedProductsContextType = {
  reviewedProducts: ReviewedProduct[];
  loading: boolean;
  refreshReviewedProducts: () => Promise<void>;
};

const ReviewedProductsContext = createContext<
  ReviewedProductsContextType | undefined
>(undefined);

export function ReviewedProductsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reviewedProducts, setReviewedProducts] = useState<ReviewedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllReviewed = async () => {
    try {
      const res = await getProducts();
      const products = Array.isArray(res?.products)
        ? res.products
        : Array.isArray(res)
        ? res
        : [];

      if (!products.length) {
        console.warn("ReviewedProductsContext: getProducts returned no products", res);
      }

      const result: ReviewedProduct[] = [];

      for (const product of products) {
        try {
          const review = await getProductReview(product.id);
          if (review && review.reviewsCount > 0) {
            result.push({
              ...product,
              averageRating: review.averageRating ?? 0,
              reviewsCount: review.reviewsCount ?? 0,
              comments: review.comments || (review as any).reviews || [],
            });
          }
        } catch {
          // Ignore individual review fetch errors
        }
      }

      setReviewedProducts(result);
    } catch (err) {
      console.error("Error fetching reviewed products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllReviewed();
  }, []);

  return (
    <ReviewedProductsContext.Provider
      value={{ reviewedProducts, loading, refreshReviewedProducts: getAllReviewed }}
    >
      {children}
    </ReviewedProductsContext.Provider>
  );
}

export function useReviewedProducts() {
  const context = useContext(ReviewedProductsContext);

  if (!context) {
    throw new Error(
      "useReviewedProducts must be used inside ReviewedProductsProvider"
    );
  }

  return context;
}