import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  X,
  MapPin,
  CreditCard,
} from 'lucide-react';
import './Cart.css';
import { clearCart, getCart, getProductById, removeFromCart, updateCartItem, createOrder, paymentsGateway } from '@/api/axios';
import { useEffect, useState } from 'react';
import type { Product } from '@/interface';
import ShippingAddressMap from '@/components/ShippingAddressMap/ShippingAddressMap';
import type { LocationResult } from '@/components/ShippingAddressMap/ShippingAddressMap';
import { useToast, ToastContainer } from '@/components/Toast/Toast';

function getCartItemId(item: any): number | null {
  const candidates = [
    item?.id,
    item?.cartItemId,
    item?.cartItem?.id,
    item?.cartItem?.cartItemId,
    item?.item?.id,
    item?.item?.cartItemId,
  ];

  const matched = candidates.find((value) => typeof value === 'number' && Number.isFinite(value));
  return matched != null ? Number(matched) : null;
}

function getCartItemProductId(item: any): number | null {
  const candidates = [
    item?.productId,
    item?.product?.id,
    item?.product?.productId,
    item?.item?.productId,
    item?.item?.product?.id,
  ];

  const matched = candidates.find((value) => typeof value === 'number' && Number.isFinite(value));
  return matched != null ? Number(matched) : null;
}

function getCartItemQuantity(item: any): number {
  return Number(item?.quantity ?? item?.qty ?? item?.cartItem?.quantity ?? 1) || 1;
}

function getCartItemsPayload(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cartItems)) return data.cartItems;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.cartItems)) return data.data.cartItems;
  return [];
}

export default function Cart() {
  const [cart, setCart] = useState<{
    id: number;
    productId: number;
    quantity: number;
    product: Product;
  }[]>([])
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [shippingLocation, setShippingLocation] = useState<LocationResult | null>(null);
  const { toasts, toast, remove } = useToast();

  async function getCartProducts() {
    try {
      const res = await getCart()
      console.log('Cart GET response:', res);
      const cartItemsPayload = getCartItemsPayload(res);
      console.log('Cart items payload:', cartItemsPayload);
      const fullCart = await Promise.all(
        cartItemsPayload.map(async (item: any) => {
          const cartItemId = getCartItemId(item);
          const productId = getCartItemProductId(item);

          if (!cartItemId || !productId) return null;

          const product = await getProductById(productId);

          return {
            id: cartItemId,
            productId,
            quantity: getCartItemQuantity(item),
            product
          };
        })
      );
      setCart(fullCart.filter(Boolean) as typeof cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  }

  useEffect(() => {
    getCartProducts()
  }, [])

    // Update quantity
  async function handleUpdateQty(cartItemId: number, quantity: number) {
    if (!cartItemId || quantity < 1) return;

    setUpdatingItemId(cartItemId);
    try {
      const response = await updateCartItem(cartItemId, { quantity });
      const updatedQuantity = response?.cartItem?.quantity ?? quantity;
      const updatedCartItemId = getCartItemId(response?.cartItem ?? {});

      setCart(prev => prev.map(item =>
        item.id === cartItemId
          ? { ...item, id: updatedCartItemId ?? item.id, quantity: updatedQuantity }
          : item
      ));
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast('Failed to update quantity', 'error', 'Please try again.');
    } finally {
      setUpdatingItemId(null);
    }
  }

  // Remove item
  async function handleRemoveItem(cartItemId: number, productId?: number) {
    try {
      await removeFromCart(productId ?? cartItemId);
      setCart(prev => prev.filter(item => item.id !== cartItemId));
      toast('Item removed', 'info');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast('Could not remove item', 'error', 'Please try again.');
    }
  }

  // Clear cart
  async function handleClearCart() {
    try {
      await clearCart();
      setCart([]);
      toast('Cart cleared', 'warning', 'All items have been removed.');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast('Could not clear cart', 'error', 'Please try again.');
    }
  }

  // Checkout
  async function handleCheckout() {
    if (cart.length === 0) return;
    if (!shippingLocation) { setShowMap(true); return; }
    setIsCheckingOut(true);
    try {
      const orderData = {
        items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
        shippingAddress: shippingLocation.address
      };
      const orderResponse = await createOrder(orderData);
      
      // Capture the orderId from response
      const orderId = orderResponse?.orderId || orderResponse?.id || orderResponse?.data?.orderId || orderResponse?.data?.id;

      if (orderId) {
        try {
          const paymentRes = await paymentsGateway(Number(orderId));
          const redirectUrl = paymentRes?.redirectUrl || paymentRes?.paymentUrl || paymentRes?.url || (typeof paymentRes === 'string' ? paymentRes : null);

          if (redirectUrl) {
            toast('Order placed! Redirecting to payment gateway...', 'success', 'Please complete your payment.');
            setCart([]);
            setShippingLocation(null);
            window.location.href = redirectUrl;
            return;
          }
        } catch (payError) {
          console.error('Failed to get Paymob checkout URL:', payError);
          // Fallback to regular order success if payment redirect generation fails
        }
      }

      toast('Order placed! 🎉', 'success', 'Your order has been submitted successfully.');
      setCart([]);
      setShippingLocation(null);
    } catch (error) {
      console.error('Checkout failed:', error);
      toast('Order failed', 'error', 'Something went wrong. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  }

  // Calculate order summary
  const orderSummary = {
    subtotal: cart.reduce((sum, item) => sum + ((item.product.finalPrice || 0) * item.quantity), 0),
    originalTotal: cart.reduce((sum, item) => sum + ((item.product.originalPrice || item.product.finalPrice || 0) * item.quantity), 0),
    savings: 0,
    shipping: 0,
    total: 0
  };

  orderSummary.savings = orderSummary.originalTotal - orderSummary.subtotal;
  orderSummary.shipping = orderSummary.subtotal > 50 ? 0 : 10; // Free shipping over $50
  orderSummary.total = orderSummary.subtotal + orderSummary.shipping;



  return (
    <div className="cart-page">
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Shipping Map Modal */}
      {showMap && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl bg-white">
            <ShippingAddressMap
              onLocationChange={(loc) => setShippingLocation(loc)}
            />
            <div className="flex gap-3 p-4 border-t border-gray-100 bg-white">
              <button
                className="flex-1 cart-btn cart-btn--ghost"
                onClick={() => setShowMap(false)}
              >
                إلغاء
              </button>
              <button
                className="flex-1 cart-btn cart-btn--primary"
                disabled={!shippingLocation}
                onClick={() => { setShowMap(false); handleCheckout(); }}
              >
                تأكيد العنوان والطلب <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="cart-container">
        {/* Page Header */}
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
          <button
            className="cart-btn cart-btn--ghost cart-btn--sm  hover:text-red-500"
            onClick={handleClearCart}
          >
            <Trash2 size={14} className=' hover:text-red-500' />
            Clear All
          </button>
        </motion.div>

        {/* Cart Content */}
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

            {/* Cart Item - Example */}
            {
              cart.map((item, index) => (
                <div className="cart-item" key={item.id ?? `${item.productId}-${index}`}>
              {/* Image */}
              <Link to={`/product/${item.product.id}`} className="cart-item__image-wrap">
                <img src={item.product.mainImage || 'https://placehold.co/120?text=Product'} alt={item.product.name} className="cart-item__image" />
                <span className="cart-item__badge">{item.product.discountPercentage}%</span>
              </Link>

              {/* Info */}
              <div className="cart-item__info">
                <Link to={`/product/${item.product.id}`} className="cart-item__name">
                  {item.product.name}
                </Link>
                <span className="cart-item__category">{item.product.category}</span>
                <span className="cart-item__low-stock">
                  Only {item.product.stockQuantity} left!
                </span>
              </div>

              {/* Price */}
              <div className="cart-item__price-col">
                <span className="cart-item__price">${item.product.finalPrice}</span>
                {
                  item.product.originalPrice != item.product.finalPrice ? (
                    <span className="cart-item__original">${item.product.originalPrice}</span>
                  ) : (
                    null
                  )
                }
              </div>

              {/* Qty stepper */}
              <div className="cart-item__qty">
                <button
                  className="cart-qty-btn"
                  disabled={updatingItemId === item.id || item.quantity <= 1}
                  onClick={() => {
                    if (item.quantity > 1) {
                      handleUpdateQty(item.id, item.quantity - 1);
                    }
                  }}
                >
                  <Minus size={13} />
                </button>
                <span className="cart-qty-value">{item.quantity}</span>
                <button
                  className="cart-qty-btn"
                  disabled={updatingItemId === item.id}
                  onClick={() => {
                    handleUpdateQty(item.id, item.quantity + 1);
                  }}
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Item Total */}
              <div className="cart-item__total">${(item.product.finalPrice * item.quantity).toFixed(2)}</div>

              {/* Remove */}
              <button
                className="cart-item__remove"
                aria-label="Remove item"
                onClick={() => handleRemoveItem(item.id, item.productId)}
              >
                <X size={15} />
              </button>
            </div>
              ))
            }
            

            {/* Promo Badges */}
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
                />
                <button className="cart-btn cart-btn--coupon">
                  Apply
                </button>
              </div>

              {/* Shipping Address Summary */}
              {shippingLocation && (
                <div className="p-3.5 mb-1 bg-[#f0f7f4] border border-[#d1fae5] rounded-xl text-xs flex flex-col gap-1.5 animate-fadeIn">
                  <span className="font-bold text-[#00342B] flex items-center gap-1">
                    <MapPin size={14} className="text-[#059669] shrink-0" /> Delivery Address
                  </span>
                  <span className="text-[#4b5563] line-clamp-2" title={shippingLocation.address}>
                    {shippingLocation.address}
                  </span>
                  <button 
                    onClick={() => setShowMap(true)} 
                    className="text-[#00342B] hover:text-[#004d3e] font-bold text-left underline w-fit cursor-pointer"
                  >
                    Change Address
                  </button>
                </div>
              )}

              {/* Breakdown */}
              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                {orderSummary.savings > 0 && (
                  <div className="cart-summary__row cart-summary__row--savings">
                    <span>💸 You Save</span>
                    <span>-${orderSummary.savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-summary__row">
                  <span>Shipping</span>
                  <span className={orderSummary.shipping === 0 ? 'text-green' : ''}>
                    {orderSummary.shipping === 0 ? '🎉 Free' : `$${orderSummary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="cart-summary__divider" />
                <div className="cart-summary__row cart-summary__row--total">
                  <span>Total</span>
                  <span>${orderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA */}
              <button 
                className="cart-btn cart-btn--primary cart-btn--checkout"
                onClick={handleCheckout}
                disabled={isCheckingOut || cart.length === 0}
              >
                {isCheckingOut ? (
                  'Processing...'
                ) : shippingLocation ? (
                  <>
                    Pay Now <CreditCard size={17} />
                  </>
                ) : (
                  <>
                    Checkout <ArrowRight size={17} />
                  </>
                )}
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
      </div>
    </div>
  );
}
