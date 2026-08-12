export function flyToCart(event: React.MouseEvent | MouseEvent, imageUrl: string) {
  // Always target the top-right navbar cart icon by id
  const cartBtn = document.getElementById('navbar-cart-btn');
  const cartRect = cartBtn?.getBoundingClientRect();

  const targetX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 56;
  const targetY = cartRect ? cartRect.top + cartRect.height / 2 : 36;

  // Source element (the button clicked)
  const button = event.currentTarget as HTMLElement;
  const btnRect = button.getBoundingClientRect();
  const startX = btnRect.left + btnRect.width / 2;
  const startY = btnRect.top + btnRect.height / 2;

  // Create flying element
  const flyingImg = document.createElement('img');
  flyingImg.src = imageUrl;
  flyingImg.style.cssText = `
    position:fixed;
    left:${startX}px;
    top:${startY}px;
    width:60px;
    height:60px;
    object-fit:cover;
    border-radius:50%;
    transform:translate(-50%,-50%) scale(1);
    z-index:9999;
    transition:left 0.75s cubic-bezier(0.25,1,0.5,1), top 0.75s cubic-bezier(0.25,1,0.5,1), transform 0.75s ease, opacity 0.75s ease;
    box-shadow:0 8px 24px rgba(0,0,0,0.25);
    pointer-events:none;
  `;

  document.body.appendChild(flyingImg);

  // Trigger animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyingImg.style.left = `${targetX}px`;
      flyingImg.style.top = `${targetY}px`;
      flyingImg.style.transform = 'translate(-50%,-50%) scale(0.15)';
      flyingImg.style.opacity = '0';
    });
  });

  setTimeout(() => {
    flyingImg.remove();
    if (cartBtn) {
      cartBtn.style.transition = 'transform 0.15s ease';
      cartBtn.style.transform = 'scale(1.3)';
      setTimeout(() => { cartBtn.style.transform = 'scale(1)'; }, 200);
    }
  }, 780);
}
