import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getProducts } from '../../api/axios';
import { useReviewedProducts } from '@/Context/ReviewedProductsContext';
import ProductMediaGallery from './ProductMediaGallery';
import ProductReviewsDialog from '../../components/Dialog/ProductReviewsDialog';
import { getPrimaryImage } from '../../lib/productMedia';

export default function SpecificProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState<boolean>(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const { reviewedProducts } = useReviewedProducts();

  const getProductReview = (productId?: number) => {
    if (!productId) return null;
    return reviewedProducts.find((item: any) => item.id === productId);
  };

  const review = getProductReview(product?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductById(Number(id));
        setProduct(res);

        // Fetch related products from the same category
        const allProductsRes = await getProducts();
        const allProducts = allProductsRes?.products || [];
        const related = allProducts
          .filter((p: any) => p.category === res.category && p.id !== res.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-main-color flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00342B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">جاري تحميل المنتج...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-main-color py-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Media Section (Gallery & Fullscreen Video/Images) */}
          <div className="w-full">
            <ProductMediaGallery product={product} />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="bg-emerald-100 text-[#00342B] text-xs font-bold px-3 py-1 rounded-full">
                {product?.category || 'عام'}
              </span>
              {product?.stockQuantity != null && (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    product.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.stockQuantity > 0 ? `متوفر في المخزون (${product.stockQuantity})` : 'غير متوفر حالياً'}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-[#00342B] leading-tight">{product?.name}</h1>

            {/* Ratings Bar */}
            <div className="flex items-center gap-3 border-y border-gray-100 py-3">
              {review ? (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="font-bold text-gray-800">{review.averageRating?.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({review.reviewsCount} تقييم)</span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">لا توجد تقييمات بعد</span>
              )}
              <button
                type="button"
                onClick={() => setReviewsDialogOpen(true)}
                className="text-sm font-semibold text-[#00342B] hover:underline cursor-pointer mr-auto"
              >
                عرض التقييمات / إضافة تقييم
              </button>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-1">وصف المنتج</h3>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{product?.description}</p>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#00342B]">${product?.finalPrice}</span>
                {product?.originalPrice && product?.originalPrice > product?.finalPrice && (
                  <span className="text-gray-400 line-through text-lg">${product?.originalPrice}</span>
                )}
              </div>
              {product?.discountPercentage && product.discountPercentage > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  خصم {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-2">
              <button
                type="button"
                className="w-full bg-[#00342B] hover:bg-[#014237] text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-emerald-950/30 cursor-pointer flex items-center justify-center gap-2 text-lg"
              >
                أضف إلى السلة
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#00342B] mb-6">منتجات ذات صلة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <a
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={getPrimaryImage(relatedProduct)}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#00342B]">${relatedProduct.finalPrice}</span>
                    {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.finalPrice && (
                      <span className="text-sm text-gray-400 line-through">${relatedProduct.originalPrice}</span>
                    )}
                  </div>
                  {relatedProduct.discountPercentage && relatedProduct.discountPercentage > 0 && (
                    <span className="inline-block mt-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      خصم {relatedProduct.discountPercentage}%
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews Dialog */}
      <ProductReviewsDialog
        open={reviewsDialogOpen}
        setOpen={setReviewsDialogOpen}
        product={product}
        review={review}
        productId={product?.id}
      />
    </main>
  );
}
