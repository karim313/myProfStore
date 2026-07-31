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
  PackageOpen,
  X,
  CheckCircle2,
  MapPin,
  LogIn,
} from 'lucide-react';
import './Cart.css';



export default function Cart() {
  return (
    <div className="cart-page">
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
          <button className="cart-btn cart-btn--ghost cart-btn--sm">
            <Trash2 size={14} />
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
            <div className="cart-item">
              {/* Image */}
              <Link to="/product/1" className="cart-item__image-wrap">
                <img src="https://via.placeholder.com/120" alt="Product" className="cart-item__image" />
                <span className="cart-item__badge">-20%</span>
              </Link>

              {/* Info */}
              <div className="cart-item__info">
                <Link to="/product/1" className="cart-item__name">
                  Product Name Here
                </Link>
                <span className="cart-item__category">Category Name</span>
                <span className="cart-item__low-stock">
                  Only 3 left!
                </span>
              </div>

              {/* Price */}
              <div className="cart-item__price-col">
                <span className="cart-item__price">$99.99</span>
                <span className="cart-item__original">$129.99</span>
              </div>

              {/* Qty stepper */}
              <div className="cart-item__qty">
                <button className="cart-qty-btn"><Minus size={13} /></button>
                <span className="cart-qty-value">1</span>
                <button className="cart-qty-btn"><Plus size={13} /></button>
              </div>

              {/* Item Total */}
              <div className="cart-item__total">$99.99</div>

              {/* Remove */}
              <button className="cart-item__remove" aria-label="Remove item">
                <X size={15} />
              </button>
            </div>

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

              {/* Breakdown */}
              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <span>Subtotal (1 item)</span>
                  <span>$99.99</span>
                </div>
                <div className="cart-summary__row cart-summary__row--savings">
                  <span>💸 You Save</span>
                  <span>-$30.00</span>
                </div>
                <div className="cart-summary__row">
                  <span>Shipping</span>
                  <span className="text-green">
                    🎉 Free
                  </span>
                </div>
                <div className="cart-summary__divider" />
                <div className="cart-summary__row cart-summary__row--total">
                  <span>Total</span>
                  <span>$99.99</span>
                </div>
              </div>

              {/* CTA */}
              <button className="cart-btn cart-btn--primary cart-btn--checkout">
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
      </div>
    </div>
  );
}
