/**
 * Merge this into your project's tailwind.config.ts (theme.extend).
 * These are the only additions the loader components below rely on —
 * everything else in the components is stock Tailwind utilities.
 */
export const loaderThemeExtensions = {
  colors: {
    brand: {
      primary: '#00342B', // deep emerald — core brand color
      accent: '#D4AF37',  // subtle gold — used sparingly, for accents only
    },
  },
  keyframes: {
    'spin-slow': {
      to: { transform: 'rotate(360deg)' },
    },
    'spin-reverse-slow': {
      from: { transform: 'rotate(360deg)' },
      to: { transform: 'rotate(0deg)' },
    },
    'pulse-glow': {
      '0%, 100%': { opacity: '0.35', transform: 'scale(0.92)' },
      '50%': { opacity: '0.65', transform: 'scale(1.06)' },
    },
    'fade-in': {
      '0%': { opacity: '0', transform: 'scale(0.96)' },
      '100%': { opacity: '1', transform: 'scale(1)' },
    },
    'dot-pulse': {
      '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.35' },
      '40%': { transform: 'scale(1)', opacity: '1' },
    },
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
  },
  animation: {
    'spin-slow': 'spin-slow 2.6s linear infinite',
    'spin-reverse-slow': 'spin-reverse-slow 3.4s linear infinite',
    'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
    'fade-in': 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    'dot-pulse': 'dot-pulse 1.4s ease-in-out infinite',
    shimmer: 'shimmer 1.8s ease-in-out infinite',
  },
};

// tailwind.config.ts
// import { loaderThemeExtensions } from './tailwind.config.additions';
//
// export default {
//   theme: {
//     extend: {
//       ...loaderThemeExtensions,
//     },
//   },
// };
