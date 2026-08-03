import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MiniConfettiProps {
  x: number;
  y: number;
  onComplete: () => void;
}

const PARTICLES = Array.from({ length: 6 });

export function MiniConfetti({ x, y, onComplete }: MiniConfettiProps) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(false);
      onComplete();
    }, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {PARTICLES.map((_, i) => {
        const angle = (i * 360) / PARTICLES.length;
        const radian = (angle * Math.PI) / 180;
        const distance = 40 + Math.random() * 20;

        return (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos(radian) * distance,
              y: Math.sin(radian) * distance,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.6,
              ease: [0.2, 1, 0.3, 1], // easeOutCubic
            }}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: i % 2 === 0 ? '#10B981' : '#00342B', // Emerald and Brand Dark
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
            }}
          />
        );
      })}
    </div>
  );
}
