import { useState, useEffect } from 'react';

export function useCartAnimation() {
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    const handleAnimationTrigger = () => {
      setIsBouncing(true);
      // Remove bounce class after animation completes
      setTimeout(() => {
        setIsBouncing(false);
      }, 500); // the bounce animation duration
    };

    window.addEventListener('cartAnimationTrigger', handleAnimationTrigger);

    return () => {
      window.removeEventListener('cartAnimationTrigger', handleAnimationTrigger);
    };
  }, []);

  return { isBouncing };
}
