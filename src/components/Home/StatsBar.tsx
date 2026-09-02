import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../../utils/gsap'
import { ScrollTrigger } from '../../utils/gsap'

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { numericValue: 10000, prefix: '+', suffix: '', formatted: '10,000', label: 'عميل سعيد' },
  { numericValue: 40,    prefix: '',  suffix: '+', formatted: '40',    label: 'منتج متاح' },
  { numericValue: 4.9,   prefix: '',  suffix: '★', formatted: '4.9',   label: 'متوسط التقييم', isFloat: true },
  { numericValue: 24,    prefix: '',  suffix: '/7', formatted: '24',   label: 'دعم على مدار الساعة' },
]

// ── Animated number counter ───────────────────────────────────────────────────
function AnimatedStat({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const obj = { value: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(obj, {
          value: stat.numericValue,
          duration: 1.8,
          delay: index * 0.1,
          ease: 'power2.out',
          onUpdate: () => {
            if (!el) return;
            const v = stat.isFloat
              ? obj.value.toFixed(1)
              : Math.round(obj.value).toLocaleString();
            el.textContent = `${stat.prefix}${v}`;
          },
        });
      },
    });

    return () => trigger.kill();
  }, [stat, index]);

  return (
    <span ref={numRef} className="stat-number">
      {stat.prefix}0
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function StatsBar() {
  return (
    <motion.section
      className="w-full py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #00342B 0%, #005c47 50%, #00342B 100%)' }}
      aria-label="إحصائيات المتجر"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Moving light effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% -20%, rgba(255,255,255,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center" dir="rtl">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-4xl font-extrabold text-white tracking-tight">
                <AnimatedStat stat={stat} index={index} />
                <span className="text-emerald-300">{stat.suffix}</span>
              </span>
              <span className="text-emerald-100/80 text-sm font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
