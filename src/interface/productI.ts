// Product Image
export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

// Product Video
export interface ProductVideo {
  id: number;
  videoUrl: string;
  isMain: boolean;
}

// Product Review
export interface ProductReview {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Main Product
export interface Product {
  id: number;
  name: string;
  description: string;

  stockQuantity: number;
  category: string;

  originalPrice: number;
  discountPercentage: number | null;
  finalPrice: number;

  offerEndDate: string | null;

  mainImage: string | null;
  images: ProductImage[];

  mainVideo: string | null;
  videos: ProductVideo[];

  // موجودة فقط عند جلب التقييمات
  averageRating?: number;
  reviewsCount?: number;
  comments?: ProductReview[];
}

// Pagination Response
export interface ProductsResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  products: Product[];
}



// for create or put product
export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;

  discountPercentage?: number | null;
  offerStartDate?: string | null;
  offerEndDate?: string | null;
}