import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiZap, FiClock } from 'react-icons/fi'
import { ArrowRight, Calendar, Percent, Tag } from 'lucide-react'
import { getProducts } from '@/api/axios'
import { AddToCartButton } from '@/components/Cart/AddToCartButton'
import { getPrimaryImage } from '@/lib/productMedia'
import type { Product } from '@/interface'
import './Deal.css'

interface ProductWithOffer extends Product {
  discountPercentage: number
  endDate: string
}

export default function Deal() {
  const navigate = useNavigate()
  const [productsWithOffers, setProductsWithOffers] = useState<ProductWithOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [countdowns, setCountdowns] = useState<Record<number, { h: number; m: number; s: number }>>({})
  const [filter, setFilter] = useState<'all' | 'ending-soon' | 'highest-discount'>('all')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const newCountdowns: Record<number, { h: number; m: number; s: number }> = {}

      productsWithOffers.forEach(product => {
        if (product.endDate) {
          const endDate = new Date(product.endDate).getTime()
          const distance = endDate - now

          if (distance > 0) {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)
            newCountdowns[product.id] = { h: hours, m: minutes, s: seconds }
          } else {
            newCountdowns[product.id] = { h: 0, m: 0, s: 0 }
          }
        }
      })

      setCountdowns(newCountdowns)
    }, 1000)

    return () => clearInterval(timer)
  }, [productsWithOffers])

  const fetchData = async () => {
    try {
      setLoading(true)
      const productsRes = await getProducts()

      const productsData: Product[] = Array.isArray(productsRes?.products)
        ? productsRes.products
        : Array.isArray(productsRes)
        ? (productsRes as unknown as Product[])
        : []

      // Filter products that have offers (originalPrice > finalPrice)
      const productsWithDiscount = productsData
        .filter((product: Product) => {
          const originalPrice = Number(product.originalPrice ?? 0)
          const finalPrice = Number(product.finalPrice ?? 0)
          return originalPrice > finalPrice && finalPrice > 0
        })
        .map((product: Product) => {
          const originalPrice = Number(product.originalPrice ?? 0)
          const finalPrice = Number(product.finalPrice ?? 0)
          const discountPercentage = Math.round(((originalPrice - finalPrice) / originalPrice) * 100)

          // Use offerEndDate if available, otherwise set default 7 days from now
          const endDate = product.offerEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

          return {
            ...product,
            discountPercentage,
            endDate
          } as ProductWithOffer
        })

      setProductsWithOffers(productsWithDiscount)
    } catch (error) {
      console.error('Failed to fetch deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredProducts = () => {
    let filtered = [...productsWithOffers]

    if (filter === 'ending-soon') {
      filtered = filtered.filter(product => {
        const endDate = new Date(product.endDate).getTime()
        const now = new Date().getTime()
        const distance = endDate - now
        return distance > 0 && distance < 24 * 60 * 60 * 1000 // Less than 24 hours
      })
    } else if (filter === 'highest-discount') {
      filtered = filtered.sort((a, b) => b.discountPercentage - a.discountPercentage)
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()

  if (loading) {
    return (
      <div className="deal-loading">
        <div className="spinner"></div>
        <p>Loading deals...</p>
      </div>
    )
  }

  return (
    <div className="deal-page">
      {/* Hero Section */}
      <section className="deal-hero">
        <div className="deal-hero__content">
          <div className="deal-hero__badge">
            <FiZap />
            <span>Limited Time Offers</span>
          </div>
          <h1 className="deal-hero__title">Hot Deals & Discounts</h1>
          <p className="deal-hero__subtitle">
            Don't miss out on our exclusive offers. Grab your favorite products at unbeatable prices before time runs out!
          </p>
          <div className="deal-hero__stats">
            <div className="deal-hero__stat">
              <span className="deal-hero__stat-number">{productsWithOffers.length}</span>
              <span className="deal-hero__stat-label">Active Deals</span>
            </div>
            <div className="deal-hero__stat">
              <span className="deal-hero__stat-number">
                {Math.max(...productsWithOffers.map(p => p.discountPercentage))}%
              </span>
              <span className="deal-hero__stat-label">Max Discount</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="deal-filter-bar">
        <div className="deal-filter-bar__options">
          <button
            className={`deal-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Deals
          </button>
          <button
            className={`deal-filter-btn ${filter === 'ending-soon' ? 'active' : ''}`}
            onClick={() => setFilter('ending-soon')}
          >
            <FiClock />
            Ending Soon
          </button>
          <button
            className={`deal-filter-btn ${filter === 'highest-discount' ? 'active' : ''}`}
            onClick={() => setFilter('highest-discount')}
          >
            <Percent />
            Highest Discount
          </button>
        </div>
        <div className="deal-filter-bar__count">
          {filteredProducts.length} deals found
        </div>
      </div>

      {/* Deals Grid */}
      {filteredProducts.length > 0 ? (
        <div className="deal-grid">
          {filteredProducts.map((product) => {
            const countdown = countdowns[product.id] || { h: 0, m: 0, s: 0 }
            const isEndingSoon = countdown.h < 24 && countdown.h >= 0

            return (
              <div
                key={product.id}
                className={`deal-card ${isEndingSoon ? 'deal-card--urgent' : ''}`}
                onClick={() => navigate(`/product/${product.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/product/${product.id}`)
                  }
                }}
              >
                {/* Urgent Badge */}
                {isEndingSoon && (
                  <div className="deal-card__urgent-badge">
                    <FiClock />
                    <span>Ending Soon</span>
                  </div>
                )}

                {/* Discount Badge */}
                <div className="deal-card__discount">
                  -{product.discountPercentage}%
                </div>

                {/* Image */}
                <div
                  className="deal-card__image"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={getPrimaryImage(product as any) || 'https://placehold.co/300?text=Product'}
                    alt={product.name}
                  />
                </div>

                {/* Content */}
                <div className="deal-card__content">
                  <span className="deal-card__category">{product.category}</span>
                  <h3 className="deal-card__name">{product.name}</h3>

                  {/* Price */}
                  <div className={`flex justify-end gap-2 mt-2`}>
                    {product.originalPrice > product.finalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {product.originalPrice.toLocaleString()} د.ع
                      </span>
                    )}
                    <span className="text-emerald-400 font-bold text-sm">
                      {product.finalPrice.toLocaleString()} د.ع
                    </span>
                  </div>

                  {/* Countdown */}
                  <div className="deal-card__countdown">
                    <FiClock />
                    <div className="deal-card__countdown-timer">
                      <span className="deal-card__countdown-value">
                        {String(countdown.h).padStart(2, '0')}
                      </span>
                      <span className="deal-card__countdown-label">h</span>
                      <span className="deal-card__countdown-separator">:</span>
                      <span className="deal-card__countdown-value">
                        {String(countdown.m).padStart(2, '0')}
                      </span>
                      <span className="deal-card__countdown-label">m</span>
                      <span className="deal-card__countdown-separator">:</span>
                      <span className="deal-card__countdown-value">
                        {String(countdown.s).padStart(2, '0')}
                      </span>
                      <span className="deal-card__countdown-label">s</span>
                    </div>
                  </div>

                  {/* Valid Date */}
                  <div className="deal-card__validity">
                    <Calendar size={14} />
                    <span>Valid until: {new Date(product.endDate).toLocaleDateString()}</span>
                  </div>

                  {/* Add to Cart */}
                  <div className="deal-card__action">
                    <AddToCartButton
                      productId={product.id}
                      imageUrl={getPrimaryImage(product as any)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="deal-empty">
          <Tag size={48} />
          <h2>No Deals Available</h2>
          <p>Check back later for new exciting offers!</p>
          <button onClick={() => navigate('/category')} className="deal-empty__btn">
            Browse Products
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
