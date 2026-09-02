import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { gsap } from '../../utils/gsap'

// ── 3D Category Card ──────────────────────────────────────────────────────────
function CategoryCard({ cat, index, onClick }: { cat: any; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    const glow = glowRef.current;
    if (!el || window.matchMedia('(max-width: 768px)').matches) return;

    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    gsap.to(el, {
      duration: 0.35, ease: 'power2.out',
      rotateY: dx * 6, rotateX: -dy * 5,
      scale: 1.04, y: -8,
      transformPerspective: 800,
    });

    // Move glow to cursor position within card
    if (glow) {
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      gsap.to(glow, {
        duration: 0.3,
        x: localX - 80,
        y: localY - 80,
        opacity: 1,
      });
    }

    const img = el.querySelector('img');
    if (img) gsap.to(img, { duration: 0.35, ease: 'power2.out', scale: 1.12 });
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    const glow = glowRef.current;
    if (!el) return;
    gsap.to(el, {
      duration: 0.6, ease: 'elastic.out(1, 0.75)',
      rotateX: 0, rotateY: 0, scale: 1, y: 0,
    });
    if (glow) gsap.to(glow, { duration: 0.3, opacity: 0 });
    const img = el.querySelector('img');
    if (img) gsap.to(img, { duration: 0.5, ease: 'elastic.out(1, 0.75)', scale: 1 });
  }, []);

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className="card-3d cursor-pointer w-[280px] md:w-[340px] shrink-0 snap-start relative rounded-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Cursor glow effect */}
      <div
        ref={glowRef}
        className="absolute w-40 h-40 rounded-full pointer-events-none z-10 opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
        }}
      />

      <img
        src={cat.mainImage || ''}
        alt={cat.category}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <span className="absolute bottom-3 right-3 text-center text-base font-bold text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
        {cat.category}
      </span>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategorySlider({ allProducts }: { allProducts: any[] }) {
  const coverCategories = allProducts.filter(
    (product, index, array) =>
      index === array.findIndex(item => item.category === product.category)
  )
  const navigate = useNavigate()
  const sliderRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (!sliderRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
    const total = scrollWidth - clientWidth
    if (total > 0) setScrollProgress((Math.abs(scrollLeft) / total) * 100)
  }

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
    <motion.section
      className="browseWithCategory bg-main-color py-16"
      dir="rtl"
      aria-label="تسوق حسب الفئة"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="title flex justify-between items-center max-w-7xl w-[95%] mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.button
          onClick={() => navigate('/category')}
          className="cursor-pointer hover:underline transition-all duration-300 ease-in-out text-sm text-gray-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          عرض الكل
        </motion.button>
        <h2 className="font-bold text-[#00342B] text-xl">
          <span className="border-b-2 border-[#00342B]">تسوق</span> حسب الفئة
        </h2>
      </motion.div>

      {/* Slider wrapper */}
      <div className="categories max-w-7xl w-[95%] mx-auto relative px-4 md:px-12 mt-2">

        {/* Right arrow */}
        <motion.button
          onClick={() => scroll('right')}
          className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 hover:bg-[#00342B] text-[#00342B] hover:text-white p-2 md:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center"
          aria-label="السابق"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiChevronRight className="text-lg md:text-xl" />
        </motion.button>

        {/* Left arrow */}
        <motion.button
          onClick={() => scroll('left')}
          className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 hover:bg-[#00342B] text-[#00342B] hover:text-white p-2 md:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center"
          aria-label="التالي"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiChevronLeft className="text-lg md:text-xl" />
        </motion.button>

        {/* Cards track */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="container flex overflow-x-auto no-scrollbar w-full gap-10 my-10 snap-x snap-mandatory scroll-smooth pb-4"
          dir="rtl"
        >
          {coverCategories.map((cat, index) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              index={index}
              onClick={() => navigate('/category')}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-[100px] h-[3px] bg-gray-200 mx-auto mt-4 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#00342B]"
            animate={{ width: `${Math.min(100, Math.max(15, scrollProgress))}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

      </div>
    </motion.section>
  )
}
