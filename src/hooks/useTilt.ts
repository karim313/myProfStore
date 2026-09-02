/**
 * useTilt — cursor-based 3D card tilt hook using GSAP
 * Premium product card hover effect: rotateX/Y, lift, shadow.
 */
import { useRef, useCallback } from 'react';
import { gsap } from '../utils/gsap';

interface TiltOptions {
  maxRotateX?: number;
  maxRotateY?: number;
  maxLift?: number;
  perspective?: number;
  speed?: number;
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const {
    maxRotateX = 6,
    maxRotateY = 8,
    maxLift = 12,
    perspective = 1000,
    speed = 0.4,
  } = options;

  const ref = useRef<T>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    const rotY = dx * maxRotateY;
    const rotX = -dy * maxRotateX;

    gsap.to(el, {
      duration: speed,
      ease: 'power2.out',
      rotateX: rotX,
      rotateY: rotY,
      y: -maxLift,
      transformPerspective: perspective,
      transformOrigin: 'center center',
      boxShadow: `
        ${-rotY * 1.5}px ${rotX * 1.5 + maxLift * 2}px 40px rgba(0,0,0,0.15),
        0 ${maxLift}px 60px rgba(0,52,43,0.08)
      `,
    });
  }, [maxRotateX, maxRotateY, maxLift, perspective, speed]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      duration: 0.6,
      ease: 'elastic.out(1, 0.75)',
      rotateX: 0,
      rotateY: 0,
      y: 0,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
