import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiZap, FiShoppingCart, FiCheck, FiLoader } from 'react-icons/fi'
import { ArrowRight } from 'lucide-react'
import { getPrimaryImage } from '../../lib/productMedia'
import { useCart } from '../../features/hooks/useCart'
import { motion } from 'framer-motion'
import { gsap } from '../../utils/gsap'

// ── 3D Tilt Flash Card ────────────────────────────────────────────────────────
function FlashCard({
  pro, discount, loadingId, addedId, onAddToCart, onNavigate,
}: {
  pro: any; discount: number;
  loadingId: number | null; addedId: number | null;
  onAddToCart: (id: number, e: React.MouseEvent) => void;
  onNavigate: (id: number) => void;
  countdown?: { h: number; m: number; s: number };
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia('(max-width: 768px)').matches) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    gsap.to(el, {
      duration: 0.3, ease: 'power2.out',
      rotateY: dx * 6, rotateX: -dy * 4,
      y: -8, scale: 1.02,
      transformPerspective: 800,
      boxShadow: `${-dx * 10}px ${dy * 10 + 15}px 35px rgba(0,0,0,0.2)`,
    });
    const img = el.querySelector('img');
    if (img) gsap.to(img, { duration: 0.3, ease: 'power2.out', scale: 1.1, x: dx * 8, y: dy * 6 });
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      duration: 0.6, ease: 'elastic.out(1, 0.75)',
      rotateX: 0, rotateY: 0, scale: 1, y: 0,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    });
    const img = el.querySelector('img');
    if (img) gsap.to(img, { duration: 0.5, ease: 'elastic.out(1, 0.75)', scale: 1, x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className="card-3d group relative rounded-2xl overflow-hidden flex flex-col cursor-pointer bg-white border border-gray-100"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      onClick={() => onNavigate(pro.id)}
    >
      {/* Discount badge */}
      <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
        -{discount}%
      </div>

      {/* Image */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <img
          src={getPrimaryImage(pro)}
          alt={pro.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="flex flex-col items-end p-4 gap-1">
        <span className="text-gray-400 text-xs">{pro.category}</span>
        <h5 className="font-semibold text-[#00342B] text-right w-full text-sm leading-snug line-clamp-1">
          {pro.name}
        </h5>
        <div className="flex justify-between items-center w-full mt-2">
          <div className="flex flex-col items-start">
            <span className="font-extrabold text-[#00342B] text-base">
              ${pro.finalPrice.toLocaleString()}
            </span>
            <span className="text-gray-400 text-xs line-through">
              ${pro.originalPrice.toLocaleString()}
            </span>
          </div>
          <motion.button
            onClick={(e) => { e.stopPropagation(); onAddToCart(pro.id, e); }}
            disabled={loadingId === pro.id}
            aria-label="add to cart"
            className={
              'flex items-center justify-center w-9 h-9 rounded-full shadow-sm cursor-pointer ' +
              (addedId === pro.id ? 'bg-emerald-500 text-white' : 'bg-[#00342B] text-white hover:bg-emerald-600') +
              (loadingId === pro.id ? ' opacity-70 cursor-not-allowed' : '')
            }
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            {loadingId === pro.id
              ? <FiLoader size={15} className="animate-spin" />
              : addedId === pro.id
              ? <FiCheck size={15} />
              : <FiShoppingCart size={15} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FlashSale({ highestDiscountProducts }: { highestDiscountProducts: any[] }) {
  const navigate = useNavigate()
  const { handleAddToCart, loadingId, addedId } = useCart()
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
            newCountdowns[pro.id] = {
              h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              s: Math.floor((distance % (1000 * 60)) / 1000),
            }
          } else {
            newCountdowns[pro.id] = { h: 0, m: 0, s: 0 }
          }
        }
      })
      setCountdowns(newCountdowns)
    }, 1000)
    return () => clearInterval(timer)
  }, [highestDiscountProducts])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.94 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
  }

  return (
    <motion.section
      className="flash-sale-section w-full py-16 relative overflow-hidden"
      dir="rtl"
      aria-label="تخفيضات اليوم"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #00342B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1a3a5c 0%, transparent 40%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
          variants={itemVariants}
        >
          <div>
            <motion.div
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                animate={{ rotate: [0, -15, 15, -8, 8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5 }}
              >
                <FiZap className="text-red-500 text-xl" />
              </motion.div>
              <span className="text-red-500 text-sm font-bold uppercase tracking-wider">عرض محدود</span>
              {/* Pulsing live dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            </motion.div>
            <h2 className="text-3xl font-extrabold text-[#00342B]">تخفيضات اليوم</h2>
          </div>
        </motion.div>

        {/* ── Products Grid ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          variants={containerVariants}
        >
          {highestDiscountProducts.map((pro) => {
            const discount = pro.discountPercentage || Math.round((1 - pro.finalPrice / pro.originalPrice) * 100)
            return (
              <motion.div key={pro.id} variants={itemVariants}>
                <FlashCard
                  pro={pro}
                  discount={discount}
                  loadingId={loadingId}
                  addedId={addedId}
                  onAddToCart={handleAddToCart}
                  onNavigate={(id) => navigate(`/product/${id}`)}
                  countdown={countdowns[pro.id]}
                />
                {/* Countdown below card */}
                {pro.offerEndDate && countdowns[pro.id] && (
                  <div className="flex items-center gap-1 mt-2 w-full justify-end">
                    <span className="text-gray-400 text-xs">ينتهي:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { v: countdowns[pro.id].h, l: 'س' },
                        { v: countdowns[pro.id].m, l: 'د' },
                        { v: countdowns[pro.id].s, l: 'ث' },
                      ].map(({ v, l }) => (
                        <motion.span
                          key={l}
                          className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded stat-number"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          {String(v).padStart(2, '0')}{l}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div className="text-center mt-10" variants={itemVariants}>
          <motion.button
            onClick={() => navigate('/category')}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-red-500/30 cursor-pointer"
            whileHover={{ y: -3, boxShadow: '0 25px 50px rgba(239, 68, 68, 0.4)' }}
            whileTap={{ scale: 0.97 }}
          >
            عرض كل العروض
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  )
}
