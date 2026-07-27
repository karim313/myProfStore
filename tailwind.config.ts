/** @type {import('tailwindcss').Config} */
import { loaderThemeExtensions } from './src/components/Loader/tailwind.config.additions';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      ...loaderThemeExtensions,
      fontFamily: {
        ibm: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      colors: {
        primary: '#0F766E', // Emerald
        background: '#FFFFFF',
        light: '#F8FAFC',
        gray: '#64748B',
      },
    },
  },
  plugins: [],
};