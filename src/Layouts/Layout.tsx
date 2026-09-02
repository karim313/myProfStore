import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../utils/motion'
import CustomCursor from '../components/animations/CustomCursor'

const pageVariants = {
  initial: { opacity: 0, scale: 0.975, y: 18, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.975,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
}

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export default function Layout() {
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const variants = prefersReducedMotion ? reducedVariants : pageVariants;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <CustomCursor />
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow pt-28 md:pt-40">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
