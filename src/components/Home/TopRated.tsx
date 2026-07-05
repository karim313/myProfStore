import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { ArrowRight } from 'lucide-react'
import { products } from '../../data/products'

// ─── Derived Data ─────────────────────────────────────────────────────────────
const topRated = products.filter(p => p.rating >= 4.5).slice(0, 4)

// ─── Component ────────────────────────────────────────────────────────────────
export default function TopRated() {
  const navigate = useNavigate()

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

      {/* Products Grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {topRated.map(pro => (
          <div
            key={pro.id}
            onClick={() => navigate('/products')}
            className='card rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 bg-white'
          >
            {/* Image */}
            <picture className='picMostRated image w-full h-[220px] relative overflow-hidden addToCart'>
              <img
                src={pro.imageCover}
                alt={pro.title}
                className='w-full h-full object-cover'
              />
            </picture>

            {/* Info */}
            <div className='content flex flex-col items-end p-4 gap-1'>
              <span className='categoryName text-gray-400 text-xs'>{pro.category}</span>
              <h5 className='font-semibold text-[#00342B] text-right w-full text-sm leading-snug'>
                {pro.title}
              </h5>
              <div className='flex justify-between items-center w-full mt-1'>
                <span className='font-bold text-[#00342B] text-sm'>
                  {pro.price.toLocaleString()} د.ع
                </span>
                <div className='flex items-center gap-1'>
                  <span className='text-gray-500 text-xs'>{pro.rating}</span>
                  <FaStar className='text-yellow-400 text-xs' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <button
        onClick={() => navigate('/products')}
        className='flex items-center gap-2 text-[#00342B] border-2 border-[#00342B]/30 px-6 py-2.5 hover:bg-[#00342B] hover:text-white transition-all duration-300 ease-in-out w-fit text-sm font-medium cursor-pointer rounded-xl mx-auto'
      >
        <span>عرض الكل</span>
        <ArrowRight size={15} />
      </button>
    </section>
  )
}
