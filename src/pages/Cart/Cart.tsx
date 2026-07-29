import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Loader2,
  PackageOpen,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { getCart, updateCartItem, removeFromCart, clearCart, createOrder } from '../../api/axios';
import './Cart.css';

// ──────────────── Types ────────────────
interface CartProduct {
  id: number;
  name: string;
  mainImage: string | null;
  finalPrice: number;
  originalPrice: number;
  discountPercentage: number | null;
  category: string;
  stockQuantity: number;
}

interface CartItem {
  id: number;
  quantity: number;
  product: CartProduct;
}

interface CartData {
  items: CartItem[];
  totalPrice?: number;
}

// ──────────────── Toast ────────────────
type ToastType = 'success' | 'error' | 'info';
interface ToastState { message: string; type: ToastType; visible: boolean }

function useToast() {
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });
  const show = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3200);
  }, []);
  return { toast, show };
}

// ──────────────── Helpers ────────────────
const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function Cart() {
  const navigate = useNavigate();
  const { toast, show } = useToast();

  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [clearingCart, setClearingCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // ── Fetch cart ──
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCartData(data);
    } catch {
      show('Failed to load your cart. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [show]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const items: CartItem[] = cartData?.items ?? [];

  // ── Computed totals ──
  const subtotal = items.reduce((acc, i) => acc + i.product.finalPrice * i.quantity, 0);
  const savings   = items.reduce((acc, i) => {
    const disc = i.product.discountPercentage ?? 0;
    return acc + (i.product.originalPrice - i.product.finalPrice) * i.quantity;
  }, 0);
  const shipping  = subtotal > 50 ? 0 : 5.99;
  const couponDiscount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - couponDiscount;

  // ── Update qty ──
  const handleQtyChange = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(itemId);
    try {
      await updateCartItem(itemId, { quantity: newQty });
      setCartData(prev => {
        if (!prev) return prev;
        return { ...prev, items: prev.items.map(i => i.id === itemId ? { ...i, quantity: newQty } : i) };
      });
    } catch {
      show('Could not update quantity.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Remove item ──
  const handleRemove = async (itemId: number) => {
    setRemovingId(itemId);
    try {
      await removeFromCart(itemId);
      setCartData(prev => {
        if (!prev) return prev;
        return { ...prev, items: prev.items.filter(i => i.id !== itemId) };
      });
      show('Item removed from cart.', 'info');
    } catch {
      show('Could not remove item.', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  // ── Clear cart ──
  const handleClearCart = async () => {
    setClearingCart(true);
    try {
      await clearCart();
      setCartData({ items: [] });
      show('Cart cleared successfully.', 'info');
    } catch {
      show('Could not clear the cart.', 'error');
    } finally {
      setClearingCart(false);
    }
  };

  // ── Place order ──
  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) { show('Please enter a shipping address.', 'error'); return; }
    setPlacingOrder(true);
    try {
      await createOrder({
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress,
      });
      setOrderSuccess(true);
      setCartData({ items: [] });
      setTimeout(() => {
        setShowOrderModal(false);
        setOrderSuccess(false);
        navigate('/');
      }, 2800);
    } catch {
      show('Could not place your order. Please try again.', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  // ── Coupon ──
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'MYSTORE20') {
      setCouponApplied(true);
      show('Coupon applied! 10% discount unlocked 🎉', 'success');
    } else {
      show('Invalid coupon code.', 'error');
    }
  };

  // ────────────────────────── RENDER ──────────────────────────
  return (
    <div className="cart-page">
      {/* ── Toast ── */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            key="toast"
            className={`cart-toast cart-toast--${toast.type}`}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            {toast.type === 'success' && <CheckCircle2 size={17} />}
            {toast.type === 'error'   && <AlertCircle   size={17} />}
            {toast.type === 'info'    && <ShoppingBag   size={17} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Order Modal ── */}
      <AnimatePresence>
        {showOrderModal && (
          <motion.div
            className="cart-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !placingOrder && !orderSuccess && setShowOrderModal(false)}
          >
            <motion.div
              className="cart-modal"
              initial={{ opacity: 0, scale: 0.88, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 40 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              {orderSuccess ? (
                <div className="cart-modal__success">
                  <motion.div
                    className="cart-modal__success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <CheckCircle2 size={52} />
                  </motion.div>
                  <h2>Order Placed!</h2>
                  <p>Your order has been confirmed. You'll receive a confirmation shortly.</p>
                  <div className="cart-modal__success-bar">
                    <motion.div
                      className="cart-modal__success-bar-fill"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.6, ease: 'linear' }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="cart-modal__header">
                    <h2><MapPin size={20} /> Shipping Details</h2>
                    <button className="cart-modal__close" onClick={() => setShowOrderModal(false)}>
                      <X size={18} />
                    </button>
                  </div>
                  <div className="cart-modal__body">
                    <label>Shipping Address</label>
                    <textarea
                      className="cart-modal__textarea"
                      placeholder="123 Main St, City, Country…"
                      rows={3}
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                    />
                    <div className="cart-modal__summary">
                      <span>Items ({items.length})</span><span>{fmt(subtotal)}</span>
                      <span>Shipping</span><span>{shipping === 0 ? 'Free' : fmt(shipping)}</span>
                      {couponApplied && <><span>Coupon (10%)</span><span>-{fmt(couponDiscount)}</span></>}
                      <span className="total">Total</span><span className="total">{fmt(total)}</span>
                    </div>
                  </div>
                  <div className="cart-modal__footer">
                    <button
                      className="cart-btn cart-btn--outline"
                      onClick={() => setShowOrderModal(false)}
                      disabled={placingOrder}
                    >Cancel</button>
                    <button
                      className="cart-btn cart-btn--primary"
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                    >
                      {placingOrder
                        ? <><Loader2 size={16} className="spin" /> Placing Order…</>
                        : <><CheckCircle2 size={16} /> Confirm Order</>
                      }
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="cart-container">
        {/* ── Page Header ── */}
        <motion.div
          className="cart-header"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="cart-title">
              <ShoppingCart size={28} strokeWidth={2} />
              Your Cart
            </h1>
            <nav className="cart-breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={13} />
              <span>Shopping Cart</span>
            </nav>
          </div>
          {items.length > 0 && (
            <button
              className="cart-btn cart-btn--ghost cart-btn--sm"
              onClick={handleClearCart}
              disabled={clearingCart}
            >
              {clearingCart
                ? <Loader2 size={14} className="spin" />
                : <Trash2 size={14} />}
              Clear All
            </button>
          )}
        </motion.div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="cart-loading">
            <motion.div
              className="cart-loading__spinner"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Loader2 size={40} />
            </motion.div>
            <p>Loading your cart…</p>
          </div>
        ) : items.length === 0 ? (
          /* ── Empty State ── */
          <motion.div
            className="cart-empty"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
          >
            <div className="cart-empty__icon">
              <PackageOpen size={72} strokeWidth={1.2} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet. Explore our store and find something you'll love!</p>
            <Link to="/category" className="cart-btn cart-btn--primary cart-btn--lg">
              <ShoppingBag size={18} />
              Start Shopping
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          /* ── Cart Content ── */
          <div className="cart-content">
            {/* Left: Items */}
            <div className="cart-items-col">
              <div className="cart-items-header">
                <span>Product</span>
                <span>Price</span>
                <span>Qty</span>
                <span>Total</span>
                <span></span>
              </div>

              <AnimatePresence initial={false}>
                {items.map((item, idx) => {
                  const isUpdating = updatingId === item.id;
                  const isRemoving = removingId === item.id;
                  const itemTotal  = item.product.finalPrice * item.quantity;

                  return (
                    <motion.div
                      key={item.id}
                      className="cart-item"
                      layout
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: isRemoving ? 0.4 : 1, x: 0 }}
                      exit={{ opacity: 0, x: 80, scale: 0.92 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                    >
                      {/* Image */}
                      <Link to={`/product/${item.product.id}`} className="cart-item__image-wrap">
                        {item.product.mainImage ? (
                          <img src={item.product.mainImage} alt={item.product.name} className="cart-item__image" />
                        ) : (
                          <div className="cart-item__image-placeholder">
                            <ShoppingBag size={28} />
                          </div>
                        )}
                        {item.product.discountPercentage && (
                          <span className="cart-item__badge">-{item.product.discountPercentage}%</span>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="cart-item__info">
                        <Link to={`/product/${item.product.id}`} className="cart-item__name">
                          {item.product.name}
                        </Link>
                        <span className="cart-item__category">{item.product.category}</span>
                        {item.product.stockQuantity <= 5 && (
                          <span className="cart-item__low-stock">
                            Only {item.product.stockQuantity} left!
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="cart-item__price-col">
                        <span className="cart-item__price">{fmt(item.product.finalPrice)}</span>
                        {item.product.discountPercentage && (
                          <span className="cart-item__original">{fmt(item.product.originalPrice)}</span>
                        )}
                      </div>

                      {/* Qty stepper */}
                      <div className="cart-item__qty">
                        <button
                          className="cart-qty-btn"
                          onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                        ><Minus size={13} /></button>
                        <span className="cart-qty-value">
                          {isUpdating ? <Loader2 size={14} className="spin" /> : item.quantity}
                        </span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQuantity || isUpdating}
                        ><Plus size={13} /></button>
                      </div>

                      {/* Item Total */}
                      <div className="cart-item__total">{fmt(itemTotal)}</div>

                      {/* Remove */}
                      <button
                        className="cart-item__remove"
                        onClick={() => handleRemove(item.id)}
                        disabled={isRemoving}
                        aria-label="Remove item"
                      >
                        {isRemoving ? <Loader2 size={15} className="spin" /> : <X size={15} />}
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* ── Promo Badges ── */}
              <motion.div
                className="cart-perks"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="cart-perk"><Truck size={16} /><span>Free shipping over $50</span></div>
                <div className="cart-perk"><RotateCcw size={16} /><span>30-day returns</span></div>
                <div className="cart-perk"><Shield size={16} /><span>Secure checkout</span></div>
              </motion.div>
            </div>

            {/* Right: Summary */}
            <motion.aside
              className="cart-summary"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="cart-summary__card">
                <h2 className="cart-summary__title">Order Summary</h2>

                {/* Coupon */}
                <div className="cart-coupon">
                  <Tag size={15} />
                  <input
                    type="text"
                    className="cart-coupon__input"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <button
                    className={`cart-btn cart-btn--coupon ${couponApplied ? 'cart-btn--applied' : ''}`}
                    onClick={applyCoupon}
                    disabled={couponApplied || !couponCode.trim()}
                  >
                    {couponApplied ? <><CheckCircle2 size={13} /> Applied</> : 'Apply'}
                  </button>
                </div>

                {/* Breakdown */}
                <div className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="cart-summary__row cart-summary__row--savings">
                      <span>💸 You Save</span>
                      <span>-{fmt(savings)}</span>
                    </div>
                  )}
                  <div className="cart-summary__row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green' : ''}>
                      {shipping === 0 ? '🎉 Free' : fmt(shipping)}
                    </span>
                  </div>
                  {couponApplied && (
                    <div className="cart-summary__row cart-summary__row--coupon">
                      <span>Coupon (10%)</span>
                      <span>-{fmt(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="cart-summary__divider" />
                  <div className="cart-summary__row cart-summary__row--total">
                    <span>Total</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="cart-btn cart-btn--primary cart-btn--checkout"
                  onClick={() => setShowOrderModal(true)}
                >
                  Checkout <ArrowRight size={17} />
                </button>

                <Link to="/category" className="cart-btn cart-btn--ghost cart-btn--continue">
                  <ShoppingBag size={15} /> Continue Shopping
                </Link>

                {/* Trust badges */}
                <div className="cart-summary__trust">
                  <Shield size={13} /> SSL Secured &nbsp;·&nbsp;
                  <RotateCcw size={13} /> Easy Returns &nbsp;·&nbsp;
                  <Truck size={13} /> Fast Delivery
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </div>
    </div>
  );
}
