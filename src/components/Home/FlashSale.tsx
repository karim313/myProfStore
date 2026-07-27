import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiZap } from 'react-icons/fi'
import { ArrowRight } from 'lucide-react'
import { getPrimaryImage } from '../../lib/productMedia'


// ─── Component ────────────────────────────────────────────────────────────────
export default function FlashSale({highestDiscountProducts}: {highestDiscountProducts: any[]}) {
  const navigate = useNavigate()
  const [countdowns, setCountdowns] = useState<Record<number, { h: number; m: number; s: number }>>({})

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const newCountdowns: Record<number, { h: number; m: number; s: number }> = {}

      highestDiscountProducts.forEach(pro => {
        if (pro.offerEndDate) {
          const endDate = new Date(pro.offerEndDate).getTime()
          const distance = endDate - now

          if (distance > 0) {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)
            newCountdowns[pro.id] = { h: hours, m: minutes, s: seconds }
          } else {
            newCountdowns[pro.id] = { h: 0, m: 0, s: 0 }
          }
        }
      })

      setCountdowns(newCountdowns)
    }, 1000)

    return () => clearInterval(timer)
  }, [highestDiscountProducts])

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
        </div>

        {/* ── Products Grid ── */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {highestDiscountProducts.map(pro => {
            const discount = pro.discountPercentage || Math.round((1 - pro.finalPrice / pro.originalPrice) * 100)
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
                    src={getPrimaryImage(pro)}
                    alt={pro.name}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                </picture>

                {/* Info */}
                <div className='flex flex-col items-end p-4 gap-1'>
                  <span className='text-gray-400 text-xs'>{pro.category}</span>
                  <h5 className='font-semibold text-[#00342B] text-right w-full text-sm leading-snug line-clamp-1'>
                    {pro.name}
                  </h5>
                  <div className='flex justify-between items-center w-full mt-2'>
                    <div className='flex flex-col items-start'>
                      <span className='font-extrabold text-[#00342B] text-base'>
                        ${pro.finalPrice.toLocaleString()}
                      </span>
                      <span className='text-gray-400 text-xs line-through'>
                        ${pro.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {/* Individual Countdown */}
                  {pro.offerEndDate && countdowns[pro.id] && (
                    <div className='flex items-center gap-1 mt-2 w-full justify-end'>
                      <span className='text-gray-400 text-xs'>ينتهي:</span>
                      <div className='flex items-center gap-1'>
                        <span className='bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded'>
                          {String(countdowns[pro.id].h).padStart(2, '0')}س
                        </span>
                        <span className='bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded'>
                          {String(countdowns[pro.id].m).padStart(2, '0')}د
                        </span>
                        <span className='bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded'>
                          {String(countdowns[pro.id].s).padStart(2, '0')}ث
                        </span>
                      </div>
                    </div>
                  )}
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
