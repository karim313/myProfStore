interface Product { id: number; name: string; stockQuantity?: number; category?: string }
interface Props { products: Product[]; threshold?: number }

export default function StockAlertWidget({ products, threshold = 20 }: Props) {
  const lowStock = products
    .filter(p => (p.stockQuantity ?? 0) <= threshold)
    .sort((a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0))
    .slice(0, 6)

  if (!lowStock.length) return (
    <div className="flex flex-col items-center justify-center h-48 text-emerald-600">
      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <p className="text-sm font-medium">All products are well stocked</p>
    </div>
  )

  return (
    <div className="space-y-1.5">
      {lowStock.map(product => {
        const stock = product.stockQuantity ?? 0
        const isCritical = stock <= 5
        return (
          <div key={product.id}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
              <p className="text-xs text-gray-400">{product.category ?? '—'}</p>
            </div>
            <span className={`ml-3 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
              isCritical
                ? 'bg-red-100 text-red-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {stock} left
            </span>
          </div>
        )
      })}
    </div>
  )
}
