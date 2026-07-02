import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  CheckCircle
} from 'lucide-react'
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn
} from 'react-icons/fa'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  return (
    <footer className="w-full bg-slate-900 text-slate-300 pt-16 mt-auto border-t border-slate-800">
      
      {/* 1. SHOP TRUST/FEATURES BANNER */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Feature 1 */}
          <div className="flex items-start space-x-4 group">
            <div className="p-3 bg-slate-800 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Free Shipping</h4>
              <p className="text-xs text-slate-400 mt-1">On all orders over $50.00 worldwide.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start space-x-4 group">
            <div className="p-3 bg-slate-800 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Secure Payment</h4>
              <p className="text-xs text-slate-400 mt-1">100% protected SSL online checkout.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start space-x-4 group">
            <div className="p-3 bg-slate-800 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">30-Day Returns</h4>
              <p className="text-xs text-slate-400 mt-1">Hassle-free exchanges & full refunds.</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start space-x-4 group">
            <div className="p-3 bg-slate-800 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">24/7 Support</h4>
              <p className="text-xs text-slate-400 mt-1">Dedicated customer service helpdesk.</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. NEWSLETTER SUBSCRIPTION BANNER */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-slate-900 to-indigo-950/40 p-8 sm:p-10 rounded-2xl border border-slate-800">
          
          <div className="max-w-md text-center lg:text-left">
            <span className="text-[11px] font-bold tracking-wider text-indigo-400 uppercase">Subscribe to our newsletter</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">Get 20% Off Your First Purchase</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Stay in the loop! Receive updates on new arrivals, weekly sales, coupons, and exclusive member announcements.
            </p>
          </div>

          <div className="w-full max-w-md">
            {subscribed ? (
              <div className="flex items-center space-x-2.5 bg-indigo-950/30 border border-indigo-500/30 text-indigo-400 p-4 rounded-xl text-xs font-semibold">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>Thank you! You have successfully subscribed to our newsletter. Check your inbox for your 20% discount code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-950 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-all placeholder-slate-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* 3. MAIN FOOTER NAVIGATION LINKS */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8 sm:gap-10">
          
          {/* Brand Col (Spans 2 columns) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="font-black text-white text-base">S</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                MyStore<span className="text-indigo-500">.</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your premium destination for high-quality electronics, modern apparel, activewear, and stylish home essentials. We deliver curated convenience and reliable quality direct to your doorstep.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {[
                { icon: <FaFacebookF className="w-4 h-4" />, url: '#facebook' },
                { icon: <FaTwitter className="w-4 h-4" />, url: '#twitter' },
                { icon: <FaInstagram className="w-4 h-4" />, url: '#instagram' },
                { icon: <FaYoutube className="w-4 h-4" />, url: '#youtube' },
                { icon: <FaLinkedinIn className="w-4 h-4" />, url: '#linkedin' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200"
                  aria-label="Social Link"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links / Shop Category */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Shop & Categories</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/category" className="hover:text-indigo-400 transition-colors">Electronics & Gadgets</Link></li>
              <li><Link to="/category" className="hover:text-indigo-400 transition-colors">Fashion & Clothing</Link></li>
              <li><Link to="/category" className="hover:text-indigo-400 transition-colors">Home Decor & Living</Link></li>
              <li><Link to="/category" className="hover:text-indigo-400 transition-colors">Beauty & Personal Care</Link></li>
              <li><Link to="/category" className="hover:text-indigo-400 transition-colors">Sports & Outdoors</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Customer Care</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#help" className="hover:text-indigo-400 transition-colors">Help Center / FAQs</a></li>
              <li><a href="#track" className="hover:text-indigo-400 transition-colors">Track Your Order</a></li>
              <li><a href="#returns" className="hover:text-indigo-400 transition-colors">Returns & Refunds</a></li>
              <li><a href="#shipping" className="hover:text-indigo-400 transition-colors">Shipping Policy</a></li>
              <li><a href="#support" className="hover:text-indigo-400 transition-colors">Customer Support</a></li>
            </ul>
          </div>

          {/* About Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Our Company</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#about" className="hover:text-indigo-400 transition-colors">About MyStore</a></li>
              <li><a href="#careers" className="hover:text-indigo-400 transition-colors">Careers / Hiring</a></li>
              <li><a href="#stores" className="hover:text-indigo-400 transition-colors">Store Locations</a></li>
              <li><a href="#blog" className="hover:text-indigo-400 transition-colors">Latest News & Blog</a></li>
              <li><a href="#affiliate" className="hover:text-indigo-400 transition-colors">Affiliate Program</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Get In Touch</h4>
            <ul className="space-y-3.5 text-xs font-medium">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-tight">123 E-Commerce St, Suite 500, New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <span className="text-slate-400 font-bold">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <span className="text-slate-400">support@mystore.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 4. COPYRIGHT & PAYMENT METRICS (Bottom Bar) */}
      <div className="w-full bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-center md:text-left text-xs text-slate-500 font-medium">
            <span>&copy; {new Date().getFullYear()} MyStore Inc. All Rights Reserved.</span>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1 text-[11px] text-slate-600">
              <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <span>&bull;</span>
              <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <span>&bull;</span>
              <a href="#sitemap" className="hover:text-slate-400 transition-colors">Sitemap</a>
            </div>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center space-x-2.5">
            {['Visa', 'Mastercard', 'PayPal', 'ApplePay', 'GooglePay', 'Amex'].map((pmt) => (
              <span
                key={pmt}
                className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider bg-slate-900 border border-slate-800 text-slate-400 rounded-md select-none uppercase hover:border-slate-700 hover:text-slate-300 transition-colors cursor-default"
              >
                {pmt}
              </span>
            ))}
          </div>

        </div>
      </div>

    </footer>
  )
}
