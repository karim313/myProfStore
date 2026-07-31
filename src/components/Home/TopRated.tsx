import { Link, useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { FiShoppingCart, FiCheck, FiLoader } from 'react-icons/fi'
import { ArrowRight } from 'lucide-react'
import { useReviewedProducts } from '../../Context/ReviewedProductsContext'
import { getPrimaryImage } from '../../lib/productMedia'
import type { Product } from '@/interface'
import { useState } from 'react'
import { handleAddToCart } from '@/helper/addToCart'
import { flyToCart } from '@/helper/flyToCart'

// ─── Component ────────────────────────────────────────────────────────────────
export default function TopRated() {
  const { reviewedProducts, loading } = useReviewedProducts();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);

  const topProducts = reviewedProducts.slice(0, 4);

  async function addProToCart(e: React.MouseEvent, pro: Product) {
    e.stopPropagation();
    setLoadingId(pro.id);
    try {
      await handleAddToCart({ productId: pro.id, quantity: 1 });
      setAddedId(pro.id);
      flyToCart(e, getPrimaryImage(pro));
      setTimeout(() => setAddedId(null), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section
      className='highest-rated-products max-w-7xl w-[95%] mx-auto px-6 text-center flex flex-col gap-10 py-16'
      dir='rtl'
      aria-label='الأعلى تقييمًا'
    >
      {/* Header */}
      <div>
        <h2 className='text-3xl font-bold text-[#00342B]'>الأعلى تقييمًا</h2>
        <p className='text-gray-500 mt-2 text-sm'>منتجات اختارها عملاؤنا بثقة</p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-[#00342B] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {topProducts.map(pro => (
            <div
              key={pro.id}
              onClick={() => navigate(`/product/${pro.id}`)}
              className='card rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 bg-white'
            >
              {/* Image */}
              <picture className='picMostRated image w-full h-[220px] relative overflow-hidden addToCart'>
                <img
                  src={getPrimaryImage(pro)}
                  alt={pro.name}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
                  }}
                />
              </picture>

              {/* Info */}
              <div className='content flex flex-col items-end p-4 gap-1'>
                <span className='categoryName text-gray-400 text-xs'>{pro.category}</span>
                <h5 className='font-semibold text-[#00342B] text-right w-full text-sm leading-snug'>
                  {pro.name}
                </h5>
                <div className='flex justify-between items-center w-full mt-1'>
                  <span className='font-bold text-[#00342B] text-sm'>
                    {pro.finalPrice?.toLocaleString() ?? pro.originalPrice?.toLocaleString() ?? 0} د.ع
                  </span>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      <span className='text-gray-500 text-xs'>{(pro.averageRating ?? 0).toFixed(1)}</span>
                      <FaStar className='text-yellow-400 text-xs' />
                    </div>
                    <button
                      onClick={(e) => addProToCart(e, pro)}
                      disabled={loadingId === pro.id}
                      aria-label='add to cart'
                      className={'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 shadow-sm cursor-pointer ' + (addedId === pro.id ? 'bg-emerald-500 text-white scale-110' : 'bg-[#00342B] text-white hover:bg-emerald-600 hover:scale-105') + (loadingId === pro.id ? ' opacity-70 cursor-not-allowed' : '')}
                    >
                      {loadingId === pro.id
                        ? <FiLoader size={13} className='animate-spin' />
                        : addedId === pro.id
                        ? <FiCheck size={13} />
                        : <FiShoppingCart size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All */}
      <Link to='/category'
        className='flex items-center gap-2 text-[#00342B] border-2 border-[#00342B]/30 px-6 py-2.5 hover:bg-[#00342B] hover:text-white transition-all duration-300 ease-in-out w-fit text-sm font-medium cursor-pointer rounded-xl mx-auto'
      >
        <span>عرض الكل</span>
        <ArrowRight size={15} />
      </Link>
    </section>
  )
}
