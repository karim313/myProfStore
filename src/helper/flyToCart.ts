import React from "react";

export function flyToCart(
  event: React.MouseEvent | MouseEvent,
  imageUrl: string
) {
  // ============================================
  // 1. Get the actual navbar cart button
  // ============================================

  const cartBtn = document.getElementById("navbar-cart-btn");

  if (!cartBtn) {
    console.warn("❌ navbar-cart-btn was not found");
    return;
  }

  // ============================================
  // 2. Get source element
  // ============================================

  const sourceElement = event.currentTarget as HTMLElement;

  if (!sourceElement) {
    console.warn("❌ Source element was not found");
    return;
  }

  // ============================================
  // 3. Get exact positions
  // ============================================

  const sourceRect = sourceElement.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();

  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;

  const targetX = cartRect.left + cartRect.width / 2;
  const targetY = cartRect.top + cartRect.height / 2;

  // ============================================
  // DEBUG
  // ============================================

  console.log("🛒 Fly To Cart", {
    screen: {
      width: window.innerWidth,
      height: window.innerHeight,
    },

    start: {
      x: startX,
      y: startY,
    },

    target: {
      x: targetX,
      y: targetY,
    },

    distance: {
      x: targetX - startX,
      y: targetY - startY,
    },
  });

  // ============================================
  // 4. Create flying image
  // ============================================

  const flyingImg = document.createElement("img");

  flyingImg.src = imageUrl;
  flyingImg.alt = "";

  // ============================================
  // IMPORTANT:
  // We DO NOT animate left/top.
  // The element stays at startX/startY.
  // We only animate transform.
  // ============================================

  flyingImg.style.position = "fixed";

  flyingImg.style.left = `${startX}px`;
  flyingImg.style.top = `${startY}px`;

  flyingImg.style.width = "64px";
  flyingImg.style.height = "64px";

  flyingImg.style.objectFit = "cover";
  flyingImg.style.borderRadius = "50%";

  flyingImg.style.transform =
    "translate(-50%, -50%) translate3d(0px, 0px, 0px) scale(1)";

  flyingImg.style.zIndex = "999999";

  flyingImg.style.pointerEvents = "none";

  flyingImg.style.userSelect = "none";

  flyingImg.style.boxShadow =
    "0 10px 30px rgba(0, 0, 0, 0.25)";

  flyingImg.style.willChange =
    "transform, opacity";

  // Prevent image dragging
  flyingImg.draggable = false;

  // ============================================
  // 5. Add to DOM
  // ============================================

  document.body.appendChild(flyingImg);

  // ============================================
  // 6. Animation values
  // ============================================

  const deltaX = targetX - startX;
  const deltaY = targetY - startY;

  const duration = 800;

  const startTime = performance.now();

  // ============================================
  // 7. Animation
  // ============================================

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;

    const rawProgress = elapsed / duration;

    const progress = Math.min(
      Math.max(rawProgress, 0),
      1
    );

    // Smooth ease out
    const ease =
      1 - Math.pow(1 - progress, 3);

    // ==========================================
    // Arc movement
    // ==========================================

    const arc =
      Math.sin(progress * Math.PI) * -100;

    // ==========================================
    // Position
    // ==========================================

    const x = deltaX * ease;

    const y =
      deltaY * ease + arc;

    // ==========================================
    // Scale
    // ==========================================

    const scale =
      1 - progress * 0.82;

    // ==========================================
    // Opacity
    // ==========================================

    const opacity =
      progress > 0.72
        ? 1 -
          (progress - 0.72) / 0.28
        : 1;

    // ==========================================
    // Apply transform
    // ==========================================

    flyingImg.style.transform = `
      translate(-50%, -50%)
      translate3d(${x}px, ${y}px, 0)
      scale(${scale})
    `;

    flyingImg.style.opacity =
      String(opacity);

    // ==========================================
    // Continue animation
    // ==========================================

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    // ==========================================
    // 8. Remove image
    // ==========================================

    flyingImg.remove();

    // ==========================================
    // 9. Bounce cart button
    // ==========================================

    cartBtn.animate(
      [
        {
          transform: "scale(1)",
        },
        {
          transform: "scale(1.2)",
        },
        {
          transform: "scale(0.92)",
        },
        {
          transform: "scale(1.08)",
        },
        {
          transform: "scale(1)",
        },
      ],
      {
        duration: 400,
        easing: "ease-out",
      }
    );

    // ==========================================
    // 10. Pulse cart badge
    // ==========================================

    const badge =
      cartBtn.querySelector(
        "span"
      ) as HTMLElement | null;

    if (badge) {
      badge.animate(
        [
          {
            transform: "scale(1)",
          },
          {
            transform: "scale(1.35)",
          },
          {
            transform: "scale(1)",
          },
        ],
        {
          duration: 350,
          easing: "ease-out",
        }
      );
    }
  }

  // ============================================
  // 11. Start animation
  // ============================================

  requestAnimationFrame(animate);
}