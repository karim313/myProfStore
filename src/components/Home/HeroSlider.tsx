/**
 * HeroSlider — Premium RTL Hero Slider
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * مبني بـ Framer Motion (موجودة في المشروع)
 * مستوحى من Apple / Zara / IKEA
 *
 * الميزات:
 * - Autoplay كل 6 ثواني
 * - Pause on hover
 * - Smooth fade + slide transitions
 * - Navigation arrows
 * - Pagination dots
 * - Keyboard navigation (← →)
 * - Touch / swipe support
 * - Fully Responsive (Desktop / Tablet / Mobile)
 * - RTL Layout
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── Slide Data ───────────────────────────────────────────────────────────────
// غيّر الصور هنا لو حبيت تضيف صور تانية
const slides = [
  {
    id: 1,
    badge: '✦ مجموعة 2025',
    headline: ['أحدث صيحات', 'الموضة الفاخرة'],
    description: 'قطع حصرية مصممة لمن يقدّرون الندرة ويبحثون عن تفاصيل لا تجدها في أي مكان آخر.',
    primaryCta: { label: 'تسوق الآن', path: '/products' },
    secondaryCta: { label: 'استكشف المجموعة', path: '/category' },
    image: '/hero_banner.png',
    accentColor: '#00342B',
    lightColor: '#e6f7ef',
    tag: 'أزياء',
  },
  {
    id: 2,
    badge: '⚡ عرض حصري',
    headline: ['إلكترونيات بأسعار', 'لا تُصدَّق'],
    description: 'أحدث الأجهزة التقنية من أبرز الماركات العالمية بخصومات تصل إلى 40% لوقت محدود.',
    primaryCta: { label: 'احجز الآن', path: '/products' },
    secondaryCta: { label: 'شاهد العروض', path: '/category' },
    image: '/hero_banner_alt.png',
    accentColor: '#1a3a5c',
    lightColor: '#e8f0f9',
    tag: 'إلكترونيات',
  },
  {
    id: 3,
    badge: '🏠 منزل أنيق',
    headline: ['أثاث راقٍ يعكس', 'ذوقك المميز'],
    description: 'اختر من تشكيلتنا الواسعة من الأثاث والديكور المنزلي المصمم بأيدي أمهر الحرفيين.',
    primaryCta: { label: 'تصفح المنزل', path: '/products' },
    secondaryCta: { label: 'الإلهام والأفكار', path: '/category' },
    image: '/hero_banner_alt2.png',
    accentColor: '#5c3a1a',
    lightColor: '#f9f0e8',
    tag: 'المنزل',
  },
]

// ─── Animation Variants ───────────────────────────────────────────────────────
const imageVariants = {
  enter: { opacity: 0, scale: 1.06, x: -40 },
  center: {
    opacity: 1, scale: 1, x: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, scale: 0.97, x: 40,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const textContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}

const textItemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.35 } },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroSlider() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [isPaused, setIsPaused] = useState(false)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const total = slides.length

  // ── Navigation helpers ──────────────────────────────────────────────────────
  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + total) % total)
  }, [total])

  // ── Autoplay ────────────────────────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    autoplayRef.current = setInterval(() => {
      if (!isPaused) goNext()
    }, 6000)
  }, [goNext, isPaused])

  useEffect(() => {
    if (!isPaused) startAutoplay()
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }
  }, [isPaused, current, startAutoplay])

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  goNext()  // RTL: left = forward
      if (e.key === 'ArrowRight') goPrev()  // RTL: right = backward
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  // ── Touch / Swipe support ────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev()
    }
  }

  const slide = slides[current]

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ minHeight: 'clamp(520px, 82vh, 800px)', background: slide.lightColor, transition: 'background 0.9s ease' }}
      dir="rtl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="عرض تقديمي للمنتجات المميزة"
    >

      {/* ── Decorative blurred blob behind image ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`blob-${current}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.35, scale: 1, transition: { duration: 1.2 } }}
          exit={{ opacity: 0 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none hidden lg:block"
          style={{ background: `radial-gradient(circle, ${slide.accentColor}30 0%, transparent 70%)` }}
        />
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center" style={{ minHeight: 'inherit' }}>
        <div className="w-full flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-4 py-12 lg:py-0">

          {/* ════════════════════════════════════
              LEFT (in RTL = image side)
              ════════════════════════════════════ */}
          <div className="w-full lg:w-[48%] flex justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${current}`}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative w-full max-w-[480px]"
              >
                {/* Floating glow ring */}
                <div
                  className="absolute inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
                  style={{ background: slide.accentColor }}
                />

                {/* Product image — float animation via CSS class */}
                <div className="hero-float-img relative z-10">
                  <img
                    src={slide.image}
                    alt={slide.headline.join(' ')}
                    className="w-full h-[340px] md:h-[420px] lg:h-[500px] object-cover rounded-3xl shadow-2xl"
                    draggable={false}
                  />

                  {/* Category tag pill on image */}
                  <div
                    className="absolute top-5 left-5 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm shadow-lg"
                    style={{ background: `${slide.accentColor}cc` }}
                  >
                    {slide.tag}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ════════════════════════════════════
              RIGHT (in RTL = text side)
              ════════════════════════════════════ */}
          <div className="w-full lg:w-[52%] flex flex-col items-center lg:items-start text-center lg:text-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${current}`}
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center lg:items-start gap-0"
              >
                {/* 1. Badge */}
                <motion.span
                  variants={textItemVariants}
                  className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border mb-6 tracking-wide"
                  style={{
                    color: slide.accentColor,
                    borderColor: `${slide.accentColor}30`,
                    background: `${slide.accentColor}10`,
                  }}
                >
                  {slide.badge}
                </motion.span>

                {/* 2. Headline */}
                <motion.h1
                  variants={textItemVariants}
                  className="font-extrabold leading-[1.15] mb-6 text-gray-900"
                  style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
                >
                  {slide.headline[0]}
                  <br />
                  <span style={{ color: slide.accentColor }}>{slide.headline[1]}</span>
                </motion.h1>

                {/* 3. Description */}
                <motion.p
                  variants={textItemVariants}
                  className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-md"
                >
                  {slide.description}
                </motion.p>

                {/* 4. CTAs */}
                <motion.div
                  variants={textItemVariants}
                  className="flex flex-row gap-3 flex-wrap justify-center lg:justify-start"
                >
                  {/* Primary */}
                  <button
                    onClick={() => navigate(slide.primaryCta.path)}
                    className="group flex items-center gap-2 text-white px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
                    style={{
                      background: slide.accentColor,
                      boxShadow: `0 8px 28px ${slide.accentColor}40`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 12px 36px ${slide.accentColor}55`)}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 8px 28px ${slide.accentColor}40`)}
                  >
                    {slide.primaryCta.label}
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>

                  {/* Secondary */}
                  <button
                    onClick={() => navigate(slide.secondaryCta.path)}
                    className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-7 py-3.5 rounded-2xl font-medium text-sm border transition-all duration-300 hover:-translate-y-1 hover:bg-white cursor-pointer"
                    style={{
                      color: slide.accentColor,
                      borderColor: `${slide.accentColor}25`,
                    }}
                  >
                    {slide.secondaryCta.label}
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ── Navigation Arrows ── */}
      <button
        onClick={goPrev}
        aria-label="الشريحة السابقة"
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-md flex items-center justify-center text-gray-600 hover:bg-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>

      <button
        onClick={goNext}
        aria-label="الشريحة التالية"
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-md flex items-center justify-center text-gray-600 hover:bg-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>

      {/* ── Pagination Dots ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`انتقل للشريحة ${i + 1}`}
            className="transition-all duration-500 rounded-full cursor-pointer"
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              background: i === current ? slide.accentColor : `${slide.accentColor}40`,
            }}
          />
        ))}
      </div>

      {/* ── Progress Bar (autoplay indicator) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-100 z-20">
        <motion.div
          key={`progress-${current}`}
          className="h-full"
          style={{ background: slide.accentColor }}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? undefined : '100%' }}
          transition={{ duration: 6, ease: 'linear' }}
        />
      </div>

    </section>
  )
}
