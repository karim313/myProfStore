export function flyToCart(event: React.MouseEvent | MouseEvent, imageUrl: string) {
  // Find cart icon element in DOM
  const cartIcon = document.querySelector('[aria-label="Shopping Cart"]');
  if (!cartIcon) return;

  const cartRect = cartIcon.getBoundingClientRect();
  const targetX = cartRect.left + cartRect.width / 2;
  const targetY = cartRect.top + cartRect.height / 2;

  // Find source element (the button clicked)
  const button = event.currentTarget as HTMLElement;
  const btnRect = button.getBoundingClientRect();
  const startX = btnRect.left + btnRect.width / 2;
  const startY = btnRect.top + btnRect.height / 2;

  // Create flying element
  const flyingImg = document.createElement('img');
  flyingImg.src = imageUrl;
  flyingImg.style.position = 'fixed';
  flyingImg.style.left = `${startX}px`;
  flyingImg.style.top = `${startY}px`;
  flyingImg.style.width = '60px';
  flyingImg.style.height = '60px';
  flyingImg.style.objectFit = 'cover';
  flyingImg.style.borderRadius = '50%';
  flyingImg.style.transform = 'translate(-50%, -50%) scale(1)';
  flyingImg.style.zIndex = '9999';
  flyingImg.style.transition = 'all 0.8s cubic-bezier(0.2, 1, 0.2, 1)';
  flyingImg.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
  flyingImg.style.pointerEvents = 'none';
  
  document.body.appendChild(flyingImg);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyingImg.style.left = `${targetX}px`;
      flyingImg.style.top = `${targetY}px`;
      flyingImg.style.transform = 'translate(-50%, -50%) scale(0.2)';
      flyingImg.style.opacity = '0.3';
    });
  });

  // Remove element after animation finishes
  setTimeout(() => {
    flyingImg.remove();
    // Add a little pop effect to the cart icon
    cartIcon.classList.add('scale-125');
    setTimeout(() => {
      cartIcon.classList.remove('scale-125');
    }, 200);
  }, 800);
}
