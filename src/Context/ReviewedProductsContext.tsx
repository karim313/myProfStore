import { createContext, useContext, useEffect, useState } from "react";
import { getProducts, getProductReview } from "../api/axios"; // عدل المسار

type ReviewedProduct = {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
  averageRating: number;
  reviewsCount: number;
  comments: any[];
};

type ReviewedProductsContextType = {
  reviewedProducts: ReviewedProduct[];
  loading: boolean;
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
      const products = res.data.products;

      const result = [];

      for (const product of products) {
        const review = await getProductReview(product.id);

        if (review.reviewsCount > 0) {
          result.push({
            ...product,
            averageRating: review.averageRating,
            reviewsCount: review.reviewsCount,
            comments: review.reviews,
          });
        }
      }

      setReviewedProducts(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllReviewed();
  }, []);

  return (
    <ReviewedProductsContext.Provider
      value={{ reviewedProducts, loading }}
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