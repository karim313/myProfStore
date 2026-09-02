/**
 * useMagneticHover — magnetic button effect using GSAP
 * Elements slightly follow the cursor when hovered.
 */
import { useRef, useCallback } from 'react';
import { gsap } from '../utils/gsap';

interface MagneticOptions {
  strength?: number;
  speed?: number;
}

export function useMagneticHover<T extends HTMLElement>(options: MagneticOptions = {}) {
  const { strength = 0.3, speed = 0.3 } = options;
  const ref = useRef<T>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;

    gsap.to(el, {
      duration: speed,
      ease: 'power2.out',
      x: dx,
      y: dy,
    });
  }, [strength, speed]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      duration: 0.5,
      ease: 'elastic.out(1, 0.6)',
      x: 0,
      y: 0,
    });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
