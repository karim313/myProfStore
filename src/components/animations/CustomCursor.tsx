/**
 * CustomCursor — premium dot + ring cursor for desktop.
 * Disabled on touch devices and reduced-motion users.
 */
import { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on pointer: fine (mouse) devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: 'none',
      });
    };

    // Lerp ring to follow mouse with lag
    let rafId: number;
    const loop = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      gsap.set(ring, { x: ringX, y: ringY });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove);

    // Scale dot/ring on interactive elements
    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label';
    const onEnterInteractive = () => {
      gsap.to(dot, { scale: 3, duration: 0.25, ease: 'power2.out' });
      gsap.to(ring, { scale: 1.6, borderColor: 'rgba(0,52,43,0.7)', duration: 0.25 });
    };
    const onLeaveInteractive = () => {
      gsap.to(dot, { scale: 1, duration: 0.25, ease: 'power2.out' });
      gsap.to(ring, { scale: 1, borderColor: 'rgba(0,52,43,0.35)', duration: 0.25 });
    };

    document.querySelectorAll(interactiveSelector).forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor hidden md:block" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-ring hidden md:block" aria-hidden="true" />
    </>
  );
}
