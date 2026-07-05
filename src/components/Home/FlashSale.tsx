import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiZap } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { ArrowRight } from 'lucide-react'
import { products } from '../../data/products'

// ─── Derived Data ─────────────────────────────────────────────────────────────
// Sort by highest discount percentage, take top 4
const saleProducts = [...products]
  .filter(p => p.originalPrice > p.price)
  .sort(
    (a, b) =>
      (b.originalPrice - b.price) / b.originalPrice -
      (a.originalPrice - a.price) / a.originalPrice
  )
  .slice(0, 4)

// ─── Component ────────────────────────────────────────────────────────────────
export default function FlashSale() {
  const navigate = useNavigate()

  // Countdown — starts at 2h 59m 59s
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 59, s: 59 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 }
        clearInterval(timer)
        return { h: 0, m: 0, s: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      className='flash-sale-section w-full py-16 bg-white'
      dir='rtl'
      aria-label='تخفيضات اليوم'
    >
      <div className='max-w-7xl mx-auto px-6'>

        {/* ── Section Header ── */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10'>

          {/* Title */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <FiZap className='text-red-500 text-xl' />
              <span className='text-red-500 text-sm font-bold uppercase tracking-wider'>عرض محدود</span>
            </div>
            <h2 className='text-3xl font-extrabold text-[#00342B]'>تخفيضات اليوم</h2>
          </div>

          {/* Live countdown */}
          <div className='flex items-center gap-3'>
            <span className='text-gray-500 text-sm'>ينتهي خلال:</span>
            {[timeLeft.h, timeLeft.m, timeLeft.s].map((unit, i) => (
              <div key={i} className='flex flex-col items-center'>
                <div className='bg-[#00342B] text-white font-mono font-bold text-xl w-14 h-14 rounded-xl flex items-center justify-center shadow-md'>
                  {String(unit).padStart(2, '0')}
                </div>
                <span className='text-gray-400 text-xs mt-1'>{['س', 'د', 'ث'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Products Grid ── */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {saleProducts.map(pro => {
            const discount = Math.round((1 - pro.price / pro.originalPrice) * 100)
            return (
              <div
                key={pro.id}
                onClick={() => navigate('/products')}
                className='card group relative rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 bg-white border border-gray-100'
              >
                {/* Discount badge */}
                <div className='absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow'>
                  -{discount}%
                </div>

                {/* Image */}
                <picture className='image w-full h-[200px] relative overflow-hidden addToCart'>
                  <img
                    src={pro.imageCover}
                    alt={pro.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                </picture>

                {/* Info */}
                <div className='flex flex-col items-end p-4 gap-1'>
                  <span className='text-gray-400 text-xs'>{pro.category}</span>
                  <h5 className='font-semibold text-[#00342B] text-right w-full text-sm leading-snug line-clamp-1'>
                    {pro.title}
                  </h5>
                  <div className='flex justify-between items-center w-full mt-2'>
                    <div className='flex flex-col items-start'>
                      <span className='font-extrabold text-[#00342B] text-base'>
                        {pro.price.toLocaleString()} د.ع
                      </span>
                      <span className='text-gray-400 text-xs line-through'>
                        {pro.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='text-gray-500 text-xs'>{pro.rating}</span>
                      <FaStar className='text-yellow-400 text-xs' />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── CTA ── */}
        <div className='text-center mt-10'>
          <button
            onClick={() => navigate('/products')}
            className='inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-red-500/30 cursor-pointer'
          >
            عرض كل العروض
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  )
}
