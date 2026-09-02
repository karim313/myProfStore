import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getProducts, logout as logoutApi } from '../api/axios'
import { useAuth } from '../features/context/tokenContext'
import { useCart } from '../Context/CartContext'
import { useWishlist } from '../Context/WishlistContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Globe,
  HelpCircle,
  Phone,
  GitCompare,
  ChevronRight,
  LogOut,
  Settings,
  ClipboardList,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Tag
} from 'lucide-react'
import { useCartAnimation } from '../hooks/cart/useCartAnimation'
import type { Product } from '../interface'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

// Mock Data
const PROMO_MESSAGES = [
  '⚡ Free worldwide shipping on orders over $50!',
  '🏷️ Use code MYSTORE20 to get 20% discount on electronics!',
  '🔄 30-day hassle-free return policy & exchange guarantee',
]

const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Fashion & Apparel',
  'Home & Living',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Books & Stationery',
]

const POPULAR_SEARCHES = [
  'Wireless Earbuds',
  'Running Shoes',
  'Smart Watch',
  'Leather Wallet',
  'Ergonomic Chair',
]




export default function Navbar() {
  const navigate = useNavigate();

  // Navigation states
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [showCategoryBarDropdown, setShowCategoryBarDropdown] = useState(false)
 const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
const [isSearching, setIsSearching] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const { cartItems, cartCount, updateQuantity: ctxUpdateQty, removeFromCart: ctxRemoveFromCart } = useCart();
  const { wishlistCount } = useWishlist();
  // Language & Currency Dropdowns
  const [langOpen, setLangOpen] = useState(false)
  const [currOpen, setCurrOpen] = useState(false)
  const [lang, setLang] = useState('English')
  const [currency, setCurrency] = useState('USD')


 const navItems = [
    { label: "Home", to: "/", protected: false },
    { label: "Categories", to: "/category", protected: false },
    { label: "Dashboard", to: "/dashboard", protected: true },
    { label: "Cart", to: "/cart", protected: true },
    { label: "Deals", to: "/deals", protected: false },
    { label: "Orders", to: "/orders", protected: true },
  ];

  const handleProtectedNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    _to: string,
    protectedRoute: boolean
  ) => {
    if (protectedRoute && !isAuthenticated) {
      e.preventDefault();
      navigate("/login");
    }
  };



  // User Dropdown
  const [accountOpen, setAccountOpen] = useState(false)

  // Cart Drawer
  const [cartOpen, setCartOpen] = useState(false)
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null)
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)

  // Promo message carousel index
  const [promoIndex, setPromoIndex] = useState(0)

  // Ref hooks for click outside handling
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const currRef = useRef<HTMLDivElement>(null)
  const categorySelectorRef = useRef<HTMLDivElement>(null)

  // Carousel timer
  const { isBouncing } = useCartAnimation()

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % PROMO_MESSAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])


  // Close modals on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false)
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false)
      }
      if (
        langRef.current &&
        !langRef.current.contains(event.target as Node)
      ) {
        setLangOpen(false)
      }
      if (
        currRef.current &&
        !currRef.current.contains(event.target as Node)
      ) {
        setCurrOpen(false)
      }
      if (
        categorySelectorRef.current &&
        !categorySelectorRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cart operations (via CartContext)
  const updateQty = async (id: number, delta: number) => {
    const targetItem = cartItems.find((item) => item.id === id)
    if (!targetItem) return

    const nextQty = Math.max(1, targetItem.quantity + delta)
    setUpdatingItemId(id)

    try {
      await ctxUpdateQty(id, nextQty)
    } catch (error) {
      console.error('Failed to update cart quantity', error)
    } finally {
      setUpdatingItemId(null)
    }
  }

  const removeItem = async (id: number) => {
    const targetItem = cartItems.find((item) => item.id === id)
    if (!targetItem) return

    try {
      await ctxRemoveFromCart(id, targetItem.productId)
    } catch (error) {
      console.error('Failed to remove cart item', error)
    }
  }

  const cartTotal = cartItems.reduce((acc, item) => acc + Number(item.product.finalPrice ?? 0) * item.quantity, 0)
  const totalItemCount = cartCount
  const subtotal = cartTotal
  const savings = cartItems.reduce(
    (acc, item) => acc + (Number(item.product.originalPrice ?? 0) - Number(item.product.finalPrice ?? 0)) * item.quantity,
    0
  )
  const shipping = 'FREE';
  // Search with debounce
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    let cancelled = false;
    const delay = query ? 350 : 0;

    const timer = setTimeout(async () => {
      if (!query) {
        if (!cancelled) {
          setSearchSuggestions([]);
          setIsSearching(false);
        }
        return;
      }

      try {
        if (!cancelled) setIsSearching(true);

        const response = await getProducts();
        const products = response.products || [];

        const filteredProducts = products
          .filter((product) => {
            const name = product.name?.toLowerCase() || '';
            const category = product.category?.toLowerCase() || '';
            const description = product.description?.toLowerCase() || '';

            const matchesSearch =
              name.includes(query) ||
              category.includes(query) ||
              description.includes(query);

            const matchesCategory =
              selectedCategory === 'All Categories' ||
              category === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
          })
          .slice(0, 5);

        if (!cancelled) setSearchSuggestions(filteredProducts);
      } catch (error) {
        console.error('Search failed:', error);
        if (!cancelled) setSearchSuggestions([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCategory]);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white border-b border-gray-100 shadow-xs">

      {/* 1. TOP ANNOUNCEMENT & UTILITIES BAR */}
      <div className="w-full bg-brand text-green-100 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-brand-light">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">

          {/* Promo Slider */}
          <div className="flex items-center space-x-2 overflow-hidden h-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={promoIndex}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-1.5 font-medium text-slate-100 text-[11px] sm:text-xs"
              >
                <Tag className="w-3.5 h-3.5 text-brand/70 shrink-0" />
                <span>{PROMO_MESSAGES[promoIndex]}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick Links & Selectors */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#track" className="hover:text-white transition-colors">Track Order</a>
            <a href="#support" className="flex items-center space-x-1 hover:text-white transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help Center</span>
            </a>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); }}
                className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer py-0.5"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-1.5 w-32 bg-white text-slate-800 rounded-md shadow-lg border border-slate-100 py-1 z-50"
                  >
                    {['English', 'Español', 'العربية'].map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors"
                      >
                        {l}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currency Selector */}
            <div className="relative" ref={currRef}>
              <button
                onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); }}
                className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer py-0.5"
              >
                <span className="font-semibold text-slate-400">$</span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              <AnimatePresence>
                {currOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-1.5 w-24 bg-white text-slate-800 rounded-md shadow-lg border border-slate-100 py-1 z-50"
                  >
                    {['USD', 'EUR', 'GBP'].map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setCurrOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="w-full bg-white px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4 md:gap-8">

          {/* Logo & Mobile Menu Burger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setMenuOpen(true); setCartOpen(false); setAccountOpen(false); }}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-50 md:hidden border border-gray-100 cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center space-x-2.5 shrink-0 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand rounded-xl flex items-center justify-center shadow-md shadow-brand/20 group-hover:bg-brand-light transition-colors">
                <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-brand-light bg-clip-text">
                MyStore<span className="text-brand">.</span>
              </span>
            </Link>
          </div>

          {/* Search bar container with dropdown selector & suggestions (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-xl relative" ref={searchContainerRef}>
            <div className="flex w-full items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/20 rounded-xl overflow-hidden transition-all duration-200">

              {/* Category Select Inside Search Bar */}
              <div className="relative border-r border-slate-200 shrink-0" ref={categorySelectorRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="flex items-center space-x-1 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <span className="truncate max-w-[110px]">{selectedCategory}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-100 py-1.5 z-50"
                    >
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => { setSelectedCategory(cat); setIsCategoryDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input field */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search over 50,000+ premium products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const query = searchQuery.trim()
                      if (!query) {
                        navigate('/category')
                      } else {
                        const categoryParam = selectedCategory !== 'All Categories' ? `&category=${encodeURIComponent(selectedCategory)}` : ''
                        navigate(`/category?search=${encodeURIComponent(query)}${categoryParam}`)
                      }
                      setSearchFocused(false)
                    }
                  }}
                  className="w-full px-4 py-2.5 text-sm text-slate-900 bg-transparent placeholder-slate-400 border-0 focus:ring-0 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Icon Button */}
              <button
                type="button"
                onClick={() => {
                  const query = searchQuery.trim()
                  if (!query) {
                    navigate('/category')
                  } else {
                    const categoryParam = selectedCategory !== 'All Categories' ? `&category=${encodeURIComponent(selectedCategory)}` : ''
                    navigate(`/category?search=${encodeURIComponent(query)}${categoryParam}`)
                  }
                  setSearchFocused(false)
                }}
                className="bg-brand hover:bg-brand-light transition-colors p-3 text-white rounded-r-xl cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Premium Autocomplete & suggested products flyout */}
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 p-4"
                >
                  {/* Popular Searches */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Popular Searches</h4>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {POPULAR_SEARCHES.map((query) => (
                        <button
                          key={query}
                          onClick={() => { setSearchQuery(query); setSearchFocused(false); }}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-brand bg-slate-50 hover:bg-brand/10 border border-slate-100 hover:border-brand/20 rounded-lg transition-colors cursor-pointer"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Products */}
                  <div className="border-t border-slate-100 pt-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
  {searchQuery.trim() ? 'Search Results' : 'Suggested Products'}
</h4>
                    <div className="space-y-2.5">
                      {isSearching ? (
  <div className="space-y-3">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="flex items-center gap-3 p-2 animate-pulse"
      >
        <div className="w-10 h-10 rounded-md bg-slate-200" />

        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-3/4 rounded bg-slate-200" />
          <div className="h-2 w-1/3 rounded bg-slate-100" />
        </div>

        <div className="h-3 w-12 rounded bg-slate-200" />
      </div>
    ))}
  </div>
) : searchSuggestions.length > 0 ? (
  <div className="space-y-2.5">
    {searchSuggestions.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          setSearchFocused(false);
          setSearchQuery('');
          navigate(`/product/${item.id}`);
        }}
        className="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors group text-left"
      >
        <img
          src={
            item.mainImage ||
            item.images?.find((img) => img.isMain)?.imageUrl ||
            item.images?.[0]?.imageUrl ||
            '/placeholder-product.png'
          }
          alt={item.name}
          className="w-10 h-10 object-cover rounded-md border border-slate-100"
        />

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-brand transition-colors">
            {item.name}
          </p>

          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            {item.category}
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-slate-900">
            ${Number(item.finalPrice ?? item.originalPrice).toFixed(2)}
          </span>

          {item.discountPercentage && item.discountPercentage > 0 && (
            <p className="text-[10px] text-slate-400 line-through">
              ${Number(item.originalPrice).toFixed(2)}
            </p>
          )}
        </div>
      </button>
    ))}
  </div>
) : (
  <div className="py-6 text-center">
    <Search className="w-6 h-6 mx-auto text-slate-300 mb-2" />

    <p className="text-xs font-semibold text-slate-500">
      No products found
    </p>

    <p className="text-[10px] text-slate-400 mt-1">
      Try another search
    </p>
  </div>
)}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 mt-3 pt-2 text-center">
                    <a
                      href="#search"
                      className="inline-flex items-center text-xs font-semibold text-brand hover:text-brand transition-colors"
                    >
                      <span>View all search results</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User actions: compare, wishlist, cart, account */}
          <div className="flex items-center space-x-1.5 sm:space-x-3.5">

            {/* Compare (Hidden on mobile) */}
            <button
              className="hidden lg:flex items-center justify-center p-2 text-slate-700 hover:text-brand hover:bg-brand/10 rounded-xl transition-colors cursor-pointer relative"
              aria-label="Compare products"
            >
              <GitCompare className="w-5.5 h-5.5" />
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-slate-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                0
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={isAuthenticated ? () => navigate('/wishlist'):() => navigate('/login')}
              className="flex items-center justify-center p-2 text-slate-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer relative group"
              aria-label="Wishlist"
            >
              <Heart className="w-5.5 h-5.5 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button with mini total */}
            <button
              id="navbar-cart-btn"
              onClick={isAuthenticated ? () => {setCartOpen(!cartOpen); setAccountOpen(false); setMenuOpen(false); }:() => navigate('/login')}
              className="flex items-center space-x-2.5 p-2 md:pl-2.5 md:pr-3.5 text-slate-700 hover:text-brand hover:bg-brand/10 rounded-xl transition-all duration-200 cursor-pointer relative"
              aria-label="Shopping Cart"
              data-cart-target="true"
            >
              <motion.div
                className="relative"
                animate={isBouncing ? {
                  scale: [1, 1.2, 0.9, 1.1, 1],
                  rotate: [0, -10, 10, -5, 0]
                } : {}}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <ShoppingCart className="w-5.5 h-5.5" />
                {totalItemCount > 0 && (
                  <motion.span
                    animate={isBouncing ? {
                      scale: [0.8, 1.35, 1],
                      boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0)", "0 0 0 10px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0)"]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] h-5 bg-brand text-white text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  >
                    {totalItemCount}
                  </motion.span>
                )}
              </motion.div>
              <div className="hidden sm:flex flex-col text-left text-xs">
                <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Cart ({totalItemCount})</span>
                <span className="font-bold text-slate-800 mt-0.5">${cartTotal.toFixed(2)}</span>
              </div>
            </button>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-6 w-px bg-slate-200"></div>

            {/* User Account Menu */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => { setAccountOpen(!accountOpen); setCartOpen(false); setMenuOpen(false); }}
                className="flex items-center space-x-2 p-1.5 sm:p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                aria-label="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold overflow-hidden shadow-xs">
                  <img
                    src="/default-avatar.svg"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <User className="w-4 h-4 absolute" />
                </div>
                <div className="hidden lg:flex flex-col text-left text-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                    {isAuthenticated ? 'مرحبا بك' : 'مرحبا'}
                  </span>
                  <span className="font-bold text-slate-800 flex items-center mt-0.5">
                    {isAuthenticated ? 'حسابي' : 'تسجيل دخول'} <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 overflow-hidden"
                  >
                    {/* User Info Header */}
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900">MyStore Customer</p>
                          <p className="text-xs text-slate-400 truncate">Logged in</p>
                        </div>

                        <div className="p-1">
                          <Link
                            to="/orders"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand/10 hover:text-brand rounded-lg transition-colors"
                          >
                            <ClipboardList className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand/10 hover:text-brand rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>My Profile</span>
                          </Link>
                        </div>

                        <div className="border-t border-slate-100 mt-1.5 pt-1.5 px-1">
                          <button
                            onClick={async () => {
                              try {
                                await logoutApi();
                              } catch (error) {
                                console.error('Logout API failed:', error);
                              }
                              logout();
                              setAccountOpen(false);
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-1">
                        <Link
                          to="/login"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand/10 hover:text-brand rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Login</span>
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand/10 hover:text-brand rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Create Account</span>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      {/* 3. CATEGORIES & MAIN LINKS BAR (Hidden on mobile) */}
      <div className="hidden md:block w-full border-t border-gray-100 bg-slate-50 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">

          <div className="flex items-center space-x-8">

            {/* All Categories Dropdown Trigger */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowCategoryBarDropdown(true)}
                onMouseLeave={() => setShowCategoryBarDropdown(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Menu className="w-4 h-4" />
                <span>Shop By Category</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {showCategoryBarDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setShowCategoryBarDropdown(true)}
                    onMouseLeave={() => setShowCategoryBarDropdown(false)}
                    className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50"
                  >
                    {CATEGORIES.slice(1).map((category) => (
                      <a
                        key={category}
                        href={`#category-${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                        className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand font-medium transition-colors"
                      >
                        <span>{category}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav Links */}
           <nav className="flex items-center space-x-6">
      {navItems.map(({ label, to, protected: isProtected }) => (
        <NavLink
          key={to}
          to={to}
          end
          onClick={(e) =>
            handleProtectedNavigation(e, to, isProtected)
          }
          className={({ isActive }) =>
            `text-xs font-bold transition-colors py-1 ${
              isActive
                ? "text-brand border-b-2 border-brand"
                : "text-slate-600 hover:text-brand"
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
          </div>

          {/* Delivery banner & Hotline */}
          <div className="flex items-center space-x-6 text-xs text-slate-500 font-semibold">
            <span className="flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-emerald-500" />
              <span>Track your Order</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>Hotline: <span className="text-slate-800 font-bold">+1 (800) 123-4567</span></span>
            </span>
          </div>

        </div>
      </div>

      {/* 4. CART SLIDE-OVER DRAWER (Mini Cart) */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer backdrop-blur-xs"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-brand" />
                  <span className="font-extrabold text-slate-900 text-base">Your Shopping Cart</span>
                  <span className="px-2 py-0.5 bg-brand/15 text-brand text-xs font-bold rounded-full">
                    {totalItemCount}
                  </span>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content / List of Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-lg">Your cart is empty</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto">
                        Looks like you haven't added anything to your cart yet. Let's start shopping!
                      </p>
                    </div>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="px-5 py-2 bg-brand hover:bg-brand-light text-white text-xs font-bold rounded-lg transition-colors shadow-md cursor-pointer"
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors relative group">
                      <Link to={`/product/${item.product.id}`} className="shrink-0">
                        <img
                          src={item.product.mainImage || 'https://placehold.co/120?text=Product'}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <Link to={`/product/${item.product.id}`} className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight hover:text-brand transition-colors">
                            {item.product.name}
                          </Link>
                          {item.product.category && (
                            <span className="inline-block text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md mt-1">
                              {item.product.category}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-extrabold text-slate-900">
                              ${Number(item.product.finalPrice ?? 0).toFixed(2)}
                            </span>
                            {Number(item.product.originalPrice ?? 0) > Number(item.product.finalPrice ?? 0) && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ${Number(item.product.originalPrice ?? 0).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Quantity control */}
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={updatingItemId === item.id || item.quantity <= 1}
                              className="p-1 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              disabled={updatingItemId === item.id}
                              className="p-1 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 text-[11px] font-semibold text-slate-500">
                          Item total: ${(Number(item.product.finalPrice ?? 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer (Subtotal & Actions) */}
              {cartItems.length > 0 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-4">

                  {/* Shipping Guarantee Ticker */}
                  <div className="flex items-center space-x-2 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
                    <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Congrats! You qualify for Free Shipping.</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>Saving</span>
                      <span className="text-emerald-600">-${savings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>Shipping</span>
                      <span className="text-emerald-600">{shipping}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200/60 pt-2.5 mt-2">
                      <span>Grand Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to="/cart"
                      onClick={() => setCartOpen(false)}
                      className="w-full text-center py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-xs"
                    >
                      View Full Cart
                    </Link>
                    <button
                      onClick={() => setCheckoutModalOpen(true)}
                      className="w-full py-2.5 bg-brand hover:bg-brand-light text-white text-xs font-bold rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Proceed to checkout?</DialogTitle>
            <DialogDescription>
              You&apos;ll be redirected to the full cart flow to complete your order.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setCheckoutModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => { setCheckoutModalOpen(false); setCartOpen(false); navigate('/cart'); }}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. MOBILE DRAWER SIDE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer backdrop-blur-xs"
            />

            {/* Side Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full sm:max-w-sm bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setMenuOpen(false)}>
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-md">
                    <ShoppingBag className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="text-lg font-extrabold tracking-tight text-slate-900">
                    MyStore<span className="text-brand">.</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex w-full items-center bg-white border border-slate-200 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 rounded-lg overflow-hidden transition-all duration-200">
                  <input
                    type="text"
                    placeholder="Search premium products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-950 bg-transparent placeholder-slate-400 border-0 focus:ring-0 focus:outline-none"
                  />
                  <button
                    className="p-2 text-slate-400 hover:text-brand"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs/Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Main Navigation</h4>
                  <nav className="flex flex-col space-y-1">
                    {[
                      { label: 'Home', to: '/' },
                      { label: 'Categories', to: '/category' },
                      { label: 'Cart', to: '/cart' },
                      { label: 'Deals', to: '/deals' },
                      { label: 'My Orders', to: '/orders' },
                      { label: 'New Arrivals', to: '/new-arrivals' },
                    ].map(({ label, to }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-lg transition-colors ${isActive
                            ? 'bg-brand/10 text-brand'
                            : 'text-slate-700 hover:bg-slate-50'
                          }`
                        }
                      >
                        <span>{label}</span>
                        <ChevronRight className="w-4 h-4 opacity-55" />
                      </NavLink>
                    ))}
                  </nav>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Top Categories</h4>
                  <div className="flex flex-col space-y-1">
                    {CATEGORIES.slice(1, 6).map((category) => (
                      <a
                        key={category}
                        href={`#category-${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <span>{category}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Language & Currency</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Lang:</span>
                      <span className="font-bold text-slate-700">{lang}</span>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Curr:</span>
                      <span className="font-bold text-slate-700">{currency}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Profile Info on Footer of Drawer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="User Profile"
                    className="w-10 h-10 object-cover rounded-full border border-brand/20"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Alex Rodriguez</p>
                    <p className="text-[10px] text-slate-400">alex.rodriguez@example.com</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full mt-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  )
}
