import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FlyingProductProps {
  imageUrl: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onComplete: () => void;
}

export function FlyingProduct({
  imageUrl,
  startX,
  startY,
  endX,
  endY,
  onComplete,
}: FlyingProductProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  /*
   * Calculate the distance.
   */
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  /*
   * Control point.
   *
   * This creates a nice arc.
   *
   * The product goes:
   *
   * Start
   *    ↗
   *      ↗
   *        → Cart
   */

  const controlX = startX + deltaX * 0.55;

  const controlY =
    Math.min(startY, endY) - 120;

  return createPortal(
    <motion.div
      initial={{
        position: "fixed",
        left: startX,
        top: startY,
        x: "-50%",
        y: "-50%",
        scale: 1,
        opacity: 1,
      }}
      animate={{
        left: endX,
        top: endY,
        x: "-50%",
        y: "-50%",
        scale: 0.18,
        opacity: 0,
      }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={onComplete}
      style={{
        width: 60,
        height: 60,
        pointerEvents: "none",
        zIndex: 999999,
        position: "fixed",
      }}
    >
      <motion.div
        initial={{
          x: 0,
          y: 0,
        }}
        animate={{
          x: [
            0,
            (controlX - startX) * 0.5,
            deltaX,
          ],
          y: [
            0,
            controlY - startY,
            deltaY,
          ],
        }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          width: 60,
          height: 60,
        }}
      >
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "50%",
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.25)",
            display: "block",
          }}
        />
      </motion.div>
    </motion.div>,
    document.body
  );
}