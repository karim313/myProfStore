import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getProducts, addToWishlist, removeFromWishlist, getWishlist } from '../../api/axios';
import { useReviewedProducts } from '@/Context/ReviewedProductsContext';
import ProductMediaGallery from './ProductMediaGallery';
import ProductReviewsDialog from '../../components/Dialog/ProductReviewsDialog';
import { getPrimaryImage } from '../../lib/productMedia';
import { Heart } from 'lucide-react';
import { handleAddToCart } from '@/helper/addToCart';
import { motion } from 'framer-motion';
import { gsap } from '../../utils/gsap';

export default function SpecificProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState<boolean>(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);

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

    // Load wishlist from API
    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        setWishlistItems(res || []);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };
    fetchWishlist();
  }, [id]);

  const toggleWishlist = async (productId: number) => {
    const isInWishlist = wishlistItems.some((item: any) => item.id === productId);

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        setWishlistItems(wishlistItems.filter((item: any) => item.id !== productId));
      } else {
        await addToWishlist(productId);
        // Refresh wishlist after adding
        const res = await getWishlist();
        setWishlistItems(res || []);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  async function addProToCart(product: any) {
    setLoadingId(product.id);
    try {
      await handleAddToCart({ productId: product.id, quantity: 1 });
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
      console.log(product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoadingId(null);
    }
  }

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    }
  }

  return (
    <main className="min-h-screen bg-main-color py-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Media Section (Gallery & Fullscreen Video/Images) */}
          <motion.div className="w-full" variants={itemVariants}>
            <ProductMediaGallery product={product} />
          </motion.div>

          {/* Product Details Section */}
          <motion.div 
            className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm"
            variants={itemVariants}
          >
            <motion.div 
              className="flex flex-wrap items-center justify-between gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
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
            </motion.div>

            <motion.h1 
              className="text-3xl font-extrabold text-[#00342B] leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product?.name}
            </motion.h1>

            {/* Ratings Bar */}
            <motion.div 
              className="flex items-center gap-3 border-y border-gray-100 py-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
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
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-sm font-bold text-gray-700 mb-1">وصف المنتج</h3>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{product?.description}</p>
            </motion.div>

            {/* Pricing Section */}
            <motion.div 
              className="flex items-baseline gap-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#00342B]">${product?.finalPrice}</span>
                {product?.originalPrice && product?.originalPrice > product?.finalPrice && (
                  <span className="text-gray-400 line-through text-lg">${product?.originalPrice}</span>
                )}
              </div>
              {product?.discountPercentage && product.discountPercentage > 0 && (
                <motion.span 
                  className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                >
                  خصم {product.discountPercentage}%
                </motion.span>
              )}
            </motion.div>

            {/* Add to Cart CTA */}
            <motion.div 
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                type="button"
                onClick={() => addProToCart(product)}
                disabled={loadingId === product?.id}
                className="w-full bg-[#00342B] hover:bg-[#014237] text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-emerald-950/30 cursor-pointer flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0, 52, 43, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                {loadingId === product?.id ? 'جاري الإضافة...' : addedId === product?.id ? 'تمت الإضافة!' : 'أضف إلى السلة'}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-[#00342B] mb-6">منتجات ذات صلة</h2>
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm group relative"
                  variants={itemVariants}
                  onMouseMove={(e) => {
                    if (window.matchMedia('(max-width: 768px)').matches) return;
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                    gsap.to(el, {
                      duration: 0.3, ease: 'power2.out',
                      rotateY: dx * 6, rotateX: -dy * 4, y: -6, scale: 1.02,
                      transformPerspective: 700,
                      boxShadow: `${-dx * 10}px ${dy * 8 + 12}px 30px rgba(0,0,0,0.15)`,
                    });
                    const img = el.querySelector('img');
                    if (img) gsap.to(img, { duration: 0.3, ease: 'power2.out', scale: 1.08 });
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    gsap.to(el, {
                      duration: 0.55, ease: 'elastic.out(1, 0.75)',
                      rotateX: 0, rotateY: 0, y: 0, scale: 1,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                    });
                    const img = el.querySelector('img');
                    if (img) gsap.to(img, { duration: 0.5, ease: 'elastic.out(1, 0.75)', scale: 1 });
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <a href={`/product/${relatedProduct.id}`} className="block">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                      <motion.img
                        src={getPrimaryImage(relatedProduct)}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
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
                  {/* Wishlist Icon */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(relatedProduct.id);
                    }}
                    className="absolute top-6 right-6 bg-white/90 hover:bg-white p-2 rounded-full shadow-md cursor-pointer z-10"
                    title="Add to Wishlist"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      size={16}
                      className={`transition-colors ${wishlistItems.some((item: any) => item.id === relatedProduct.id) ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'}`}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
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
