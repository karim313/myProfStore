import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has prefers-reduced-motion enabled
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Safe animation variants that respect reduced motion preferences
 * Pass your regular variants and get back variants that disable motion when needed
 */
export function createSafeVariants<T extends Record<string, any>>(
  variants: T,
  reducedMotion: boolean
): T {
  if (!reducedMotion) return variants;

  // Create a version that skips animations
  const safeVariants = {} as T;
  
  for (const key in variants) {
    if (typeof variants[key] === 'object' && variants[key] !== null) {
      safeVariants[key] = {
        ...variants[key],
        transition: { duration: 0 }
      };
    } else {
      safeVariants[key] = variants[key];
    }
  }

  return safeVariants;
}

/**
 * Get safe transition props that respect reduced motion
 */
export function getSafeTransition(reducedMotion: boolean) {
  return reducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" };
}