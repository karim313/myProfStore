import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { products } from '../../data/products'

// ─── Derived Data ─────────────────────────────────────────────────────────────
// One product per unique category — used as cover card
const coverCategories = products.filter(
  (product, index, array) =>
    index === array.findIndex(item => item.category === product.category)
)

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategorySlider() {
  const navigate = useNavigate()
  const sliderRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Manual scroll helper
  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    })
  }

  // Progress bar update
  const handleScroll = () => {
    if (!sliderRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
    const total = scrollWidth - clientWidth
    if (total > 0) setScrollProgress((Math.abs(scrollLeft) / total) * 100)
  }

  // Autoplay every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      const isAtEnd = Math.abs(scrollLeft) + clientWidth >= scrollWidth - 50
      if (isAtEnd) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        sliderRef.current.scrollBy({ left: -380, behavior: 'smooth' })
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      className='browseWithCategory bg-main-color py-16'
      dir='rtl'
      aria-label='تسوق حسب الفئة'
    >
      {/* Header */}
      <div className='title flex justify-between items-center max-w-7xl w-[95%] mx-auto px-6'>
        <button
          onClick={() => navigate('/category')}
          className='cursor-pointer hover:underline transition-all duration-300 ease-in-out text-sm text-gray-600'
        >
          عرض الكل
        </button>
        <h2 className='font-bold text-[#00342B] text-xl'>
          <span className='border-b-2 border-[#00342B]'>تسوق</span> حسب الفئة
        </h2>
      </div>

      {/* Slider wrapper */}
      <div className='categories max-w-7xl w-[95%] mx-auto relative px-4 md:px-12 mt-2'>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className='absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 hover:bg-[#00342B] text-[#00342B] hover:text-white p-2 md:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95'
          aria-label='السابق'
        >
          <FiChevronRight className='text-lg md:text-xl' />
        </button>

        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className='absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 hover:bg-[#00342B] text-[#00342B] hover:text-white p-2 md:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95'
          aria-label='التالي'
        >
          <FiChevronLeft className='text-lg md:text-xl' />
        </button>

        {/* Cards track */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className='container flex overflow-x-auto no-scrollbar w-full gap-10 my-10 snap-x snap-mandatory scroll-smooth pb-4'
          dir='rtl'
        >
          {coverCategories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate('/category')}
              className='card hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer w-[280px] md:w-[340px] shrink-0 snap-start relative'
            >
              <picture className='w-full h-[100%]'>
                <img
                  src={cat.imageCover}
                  alt={cat.category}
                  className='w-full h-[100%] object-cover rounded-xl'
                />
              </picture>
              <span className='text-center text-lg font-semibold absolute bottom-2 right-2 bg-gray-900/40 px-4 py-2 rounded-lg text-gray-200'>
                {cat.category}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className='w-[100px] h-[3px] bg-gray-200 mx-auto mt-4 rounded-full overflow-hidden'>
          <div
            className='h-full bg-[#00342B] transition-all duration-300 ease-out'
            style={{ width: `${Math.min(100, Math.max(15, scrollProgress))}%` }}
          />
        </div>

      </div>
    </section>
  )
}
