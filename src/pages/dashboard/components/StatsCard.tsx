import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '../../../utils/gsap';
import { ScrollTrigger } from '../../../utils/gsap';

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  index?: number;
}

export default function StatsCard({ label, value, icon, color, index = 0 }: StatsCardProps) {
  const numRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animated number counter
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const obj = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration: 1.6,
          delay: index * 0.1,
          ease: 'power2.out',
          onUpdate: () => {
            if (el) el.textContent = Math.round(obj.val).toLocaleString();
          },
        });
      },
    });
    return () => trigger.kill();
  }, [value, index]);

  // 3D tilt on hover
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    gsap.to(el, {
      duration: 0.3, ease: 'power2.out',
      rotateY: dx * 5, rotateX: -dy * 4,
      y: -4, scale: 1.01,
      transformPerspective: 600,
      boxShadow: `${-dx * 8}px ${dy * 6 + 8}px 24px rgba(0,0,0,0.12)`,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, {
      duration: 0.55, ease: 'elastic.out(1, 0.75)',
      rotateX: 0, rotateY: 0, y: 0, scale: 1,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-3d"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p ref={numRef} className="text-3xl font-bold text-gray-800 stat-number">0</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
