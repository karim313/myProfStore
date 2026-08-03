import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { calculateBezierPath } from '../../../utils/cart-animation/calculateBezierPath';

interface FlyingProductProps {
  imageUrl: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onComplete: () => void;
}

export function FlyingProduct({
  imageUrl,
  startX,
  startY,
  endX,
  endY,
  onComplete,
}: FlyingProductProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const path = calculateBezierPath(startX, startY, endX, endY);

  return createPortal(
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        // Center the image on the path point
        x: '-50%',
        y: '-50%',
      }}
      initial={{ offsetDistance: '0%', scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
      animate={{
        offsetDistance: '100%',
        scale: 0.25,
        opacity: 0.4,
        rotate: 15,
        filter: 'blur(2px)',
      }}
      transition={{
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1], // Custom smooth ease
      }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        style={{
          offsetPath: `path('${path}')`,
          width: '60px',
          height: '60px',
        }}
      >
        <img
          src={imageUrl}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          }}
        />
      </motion.div>
    </motion.div>,
    document.body
  );
}
