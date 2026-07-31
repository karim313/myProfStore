import type { Product } from '../data/products'
import { FiShoppingCart, FiCheck, FiLoader } from 'react-icons/fi'
import { getPrimaryImage } from '../lib/productMedia'
import { useCart } from '../features/hooks/useCart'

// ── Badge ──────────────────────────────────────────────────────────────────
interface BadgeProps {
  children?: string
  className?: string
}
function Badge({ children, className = '' }: BadgeProps) {
  if (!children) return null
  return (
    <span
      className={`absolute top-3 right-3 lg:top-4 lg:right-4 bg-[#00342B] text-white text-[10px] lg:text-xs px-2.5 py-1 rounded-full ${className}`}
    >
      {children}
    </span>
  )
}

// ── ProductCard ────────────────────────────────────────────────────────────
type CardSize = 'small' | 'large' | 'tall'

interface ProductCardProps {
  product: Product
  onSelect?: (p: Product) => void
  size?: CardSize
  onAddToCart?: (id: number, e: React.MouseEvent) => void
  loadingId?: number | null
  addedId?: number | null
}

function ProductCard({ product, onSelect, size = 'small', onAddToCart, loadingId, addedId }: ProductCardProps) {
  const isLarge = size === 'large' || size === 'tall'

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(product);
        }
      }}
      onClick={() => onSelect?.(product)}
      aria-label={`${product.name} — ${product.finalPrice.toLocaleString()} د.ع`}
      className="relative rounded-2xl overflow-hidden group w-full h-full text-right
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
                 focus-visible:ring-offset-2 focus-visible:ring-offset-[#00342B] cursor-pointer"
    >
      <img
        src={getPrimaryImage(product)}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition duration-500 group-hover:scale-105 group-focus-visible:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

      <Badge>{product.offerEndDate ?? undefined}</Badge>

      {/* Add to Cart button — revealed on hover */}
      {onAddToCart && (
        <div className="absolute top-3 left-3 lg:top-4 lg:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onAddToCart(product.id, e); }}
            disabled={loadingId === product.id}
            aria-label="أضف إلى السلة"
            className={'flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-all duration-200 ' + (addedId === product.id ? 'bg-emerald-500 text-white scale-110' : 'bg-white/90 text-[#00342B] hover:bg-emerald-500 hover:text-white hover:scale-105') + (loadingId === product.id ? ' opacity-70 cursor-not-allowed' : ' cursor-pointer')}
          >
            {loadingId === product.id
              ? <FiLoader size={15} className="animate-spin" />
              : addedId === product.id
              ? <FiCheck size={15} />
              : <FiShoppingCart size={15} />}
          </button>
        </div>
      )}

      <div className={`absolute bottom-3 right-3 lg:bottom-5 lg:right-5 text-right ${isLarge ? 'lg:bottom-6' : ''}`}>
        <p className={`text-gray-300 ${isLarge ? 'text-sm' : 'text-xs'}`}>{product.category}</p>
        <h3
          className={
            size === 'tall'
              ? 'text-white text-2xl lg:text-3xl font-bold mt-2 line-clamp-2'
              : size === 'large'
              ? 'text-white text-xl lg:text-2xl font-bold mt-1 line-clamp-2'
              : 'text-white font-bold text-sm mt-1 line-clamp-2'
          }
        >
          {product.name}
        </h3>
        <div className={`flex justify-end gap-2 ${isLarge ? 'mt-2 lg:mt-3' : 'mt-1'}`}>
          {product.originalPrice > product.finalPrice && (
            <span className={`text-gray-400 line-through ${isLarge ? '' : 'text-xs'}`}>
              {product.originalPrice.toLocaleString()} د.ع
            </span>
          )}
          <span className={`text-emerald-400 font-bold ${size === 'tall' ? 'text-xl' : isLarge ? '' : 'text-sm'}`}>
            {product.finalPrice.toLocaleString()} د.ع
          </span>
        </div>

        {size === 'tall' && (
          <span
            className="inline-block mt-4 lg:mt-5 bg-white/10 backdrop-blur-md border border-white/30
                       text-white px-5 py-2 rounded-xl transition group-hover:bg-white/20
                       group-focus-visible:bg-white/20"
          >
            تسوق الآن
          </span>
        )}
      </div>
    </div>
  )
}

// ── FeaturedProducts ───────────────────────────────────────────────────────
interface FeaturedProductsProps {
  featuredProducts?: Product[]
  onViewAll?: () => void
  onSelectProduct?: (p: Product) => void
}

export default function FeaturedProducts({
  featuredProducts = [],
  onViewAll,
  onSelectProduct,
}: FeaturedProductsProps) {
  if (!featuredProducts.length) return null
  const { handleAddToCart, loadingId, addedId } = useCart()

  const [hero, second, third, tall] = featuredProducts
  const smallCards = [second, third].filter(Boolean) as Product[]

  return (
    <section className="product-featured bg-main-color w-full py-16">
      <div className="w-[95%] md:w-[90%] lg:w-[80%] mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onViewAll}
            className="cursor-pointer hover:underline transition-all duration-300 ease-in-out
                       text-sm text-gray-500 focus:outline-none focus-visible:ring-2
                       focus-visible:ring-emerald-500 rounded"
          >
            عرض الكل
          </button>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[#00342B]">
              <span className="border-b-2 border-[#00342B]">وصل حديثاً</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">اكتشف أحدث المنتجات التي وصلت لمتجرنا</p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Left Side */}
          <div className="flex flex-col gap-4">
            {hero && (
              <div className="h-[280px] lg:h-[380px] w-full">
                <ProductCard product={hero} onSelect={onSelectProduct} size="large" onAddToCart={handleAddToCart} loadingId={loadingId} addedId={addedId} />
              </div>
            )}
            {smallCards.length > 0 && (
              <div className={`grid gap-4 ${smallCards.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {smallCards.map((p) => (
                  <div key={p.id} className="h-[200px] lg:h-[220px] w-full">
                    <ProductCard product={p} onSelect={onSelectProduct} size="small" onAddToCart={handleAddToCart} loadingId={loadingId} addedId={addedId} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Tall Card */}
          {tall && (
            <div className="h-[380px] lg:h-full min-h-[616px] w-full">
              <ProductCard product={tall} onSelect={onSelectProduct} size="tall" onAddToCart={handleAddToCart} loadingId={loadingId} addedId={addedId} />
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
