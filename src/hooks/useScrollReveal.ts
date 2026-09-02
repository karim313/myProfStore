/**
 * useScrollReveal — GSAP ScrollTrigger reveal on scroll.
 * Attach to a container. Children with data-reveal are animated in.
 */
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../utils/gsap';

interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  selector?: string;
}

export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const {
    y = 40,
    duration = 0.8,
    stagger = 0.12,
    ease = 'power3.out',
    selector = '[data-reveal]',
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>(selector);
    if (!targets.length) return;

    gsap.set(targets, { opacity: 0, y });

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [y, duration, stagger, ease, selector]);

  return ref;
}
