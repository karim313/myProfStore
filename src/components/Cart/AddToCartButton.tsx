import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useAddToCart } from '../../hooks/cart/useAddToCart';
import { getElementCenter } from '../../utils/cart-animation/getElementCenter';
import { FlyingProduct } from './Animation/FlyingProduct';
import { MiniConfetti } from './Animation/MiniConfetti';

interface AddToCartButtonProps {
  productId: number;
  imageUrl: string;
}

export function AddToCartButton({ productId, imageUrl }: AddToCartButtonProps) {
  const { status, addToCart } = useAddToCart();
  const [flyingParams, setFlyingParams] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const [cartCenter, setCartCenter] = useState<{ x: number; y: number } | null>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (status === 'loading' || status === 'success') return;

    const buttonElement = e.currentTarget;
    const startPos = getElementCenter(buttonElement);

    const success = await addToCart(productId);

    if (success && startPos) {
      const cartButton = document.querySelector('[data-cart-target="true"]') as HTMLElement;
      // Get the actual cart icon inside the button
      const cartIcon = cartButton?.querySelector('svg') as unknown as HTMLElement;
      const endPos = getElementCenter(cartIcon);

      if (endPos) {
        setCartCenter(endPos);
        setFlyingParams({
          startX: startPos.x,
          startY: startPos.y,
          endX: endPos.x,
          endY: endPos.y,
        });
      }
    }
  };

  const handleFlyingComplete = () => {
    setFlyingParams(null);
    setShowConfetti(true);
    // Dispatch event for Navbar to bounce
    window.dispatchEvent(new Event('cartAnimationTrigger'));
  };

  // Button variants
  const buttonVariants = {
    idle: { scale: 1, backgroundColor: '#00342B' },
    hover: { scale: 1.05, backgroundColor: '#014237' },
    tap: { scale: 0.95, boxShadow: 'inset 0px 3px 5px rgba(0,0,0,0.2)' },
    loading: { scale: 0.98, backgroundColor: '#00342B', opacity: 0.8 },
    success: { scale: 1.1, backgroundColor: '#10B981', boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' },
    error: { scale: [1, 0.9, 1.1, 0.95, 1], backgroundColor: '#EF4444', transition: { duration: 0.4 } },
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={status === 'loading'}
        aria-label="Add to cart"
        className="flex items-center justify-center w-8 h-8 rounded-full text-white shadow-sm cursor-pointer relative overflow-hidden"
        variants={buttonVariants}
        initial="idle"
        whileHover={status === 'idle' ? 'hover' : undefined}
        whileTap={status === 'idle' ? 'tap' : undefined}
        animate={status}
      >
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <FiShoppingCart size={13} />
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
          )}

          {status === 'success' && (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <FiCheck size={14} strokeWidth={3} />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FiShoppingCart size={13} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {flyingParams && (
        <FlyingProduct
          imageUrl={imageUrl}
          startX={flyingParams.startX}
          startY={flyingParams.startY}
          endX={flyingParams.endX}
          endY={flyingParams.endY}
          onComplete={handleFlyingComplete}
        />
      )}

      {showConfetti && cartCenter && (
        <MiniConfetti
          x={cartCenter.x}
          y={cartCenter.y}
          onComplete={() => setShowConfetti(false)}
        />
      )}
    </>
  );
}
