import { useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useReviewedProducts } from '../../Context/ReviewedProductsContext'
import { getPrimaryImage } from '../../lib/productMedia'
import { AddToCartButton } from '../Cart/AddToCartButton'
import { gsap } from '../../utils/gsap'

// ── 3D Tilt card wrapper ──────────────────────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia('(max-width: 768px)').matches) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    gsap.to(el, {
      duration: 0.35,
      ease: 'power2.out',
      rotateY: dx * 8,
      rotateX: -dy * 6,
      y: -10,
      scale: 1.02,
      transformPerspective: 900,
      boxShadow: `${-dx * 12}px ${dy * 12 + 20}px 40px rgba(0,52,43,0.18)`,
    });
    // Magnetic image effect
    const img = el.querySelector('img');
    if (img) {
      gsap.to(img, {
        duration: 0.35,
        ease: 'power2.out',
        x: dx * 10,
        y: dy * 8,
      });
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      duration: 0.6,
      ease: 'elastic.out(1, 0.75)',
      rotateX: 0, rotateY: 0,
      y: 0, scale: 1,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    });
    const img = el.querySelector('img');
    if (img) {
      gsap.to(img, { duration: 0.5, ease: 'elastic.out(1, 0.75)', x: 0, y: 0 });
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`card-3d ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any } },
}

export default function TopRated() {
  const { reviewedProducts, loading } = useReviewedProducts();
  const navigate = useNavigate();
  const topProducts = reviewedProducts.slice(0, 4);

  return (
    <motion.section
      className='highest-rated-products max-w-7xl w-[95%] mx-auto px-6 text-center flex flex-col gap-10 py-16'
      dir='rtl'
      aria-label='الأعلى تقييمًا'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className='text-3xl font-bold text-[#00342B]'>الأعلى تقييمًا</h2>
        <p className='text-gray-500 mt-2 text-sm'>منتجات اختارها عملاؤنا بثقة</p>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-[#00342B] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <motion.div
          className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
          variants={containerVariants}
        >
          {topProducts.map(pro => (
            <motion.div key={pro.id} variants={cardVariants}>
              <TiltCard className='rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer bg-white h-full'>
                {/* Image */}
                <div
                  className='picMostRated image w-full h-[220px] relative overflow-hidden'
                  onClick={() => navigate(`/product/${pro.id}`)}
                >
                  <img
                    src={getPrimaryImage(pro)}
                    alt={pro.name}
                    className='w-full h-full object-cover transition-transform duration-500'
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/300?text=No+Image';
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div
                  className='content flex flex-col items-end p-4 gap-1'
                  onClick={() => navigate(`/product/${pro.id}`)}
                >
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
                      <AddToCartButton
                        productId={pro.id}
                        imageUrl={getPrimaryImage(pro)}
                      />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* View All */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Link
          to='/category'
          className='inline-flex items-center gap-2 text-[#00342B] border-2 border-[#00342B]/30 px-6 py-2.5 hover:bg-[#00342B] hover:text-white transition-all duration-300 ease-in-out text-sm font-medium cursor-pointer rounded-xl'
        >
          <span>عرض الكل</span>
          <ArrowRight size={15} />
        </Link>
      </motion.div>
    </motion.section>
  )
}
