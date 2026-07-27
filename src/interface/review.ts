import type { ProductReview } from "./productI";

export interface AddReviewRequest {
  rating: number;
  comment: string;
}

export interface ProductReviewsResponse {
  averageRating: number;
  reviewsCount: number;
  comments: ProductReview[];
}