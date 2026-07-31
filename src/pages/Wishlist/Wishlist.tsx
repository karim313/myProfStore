import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { getPrimaryImage } from '../../lib/productMedia';
import { getWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../../api/axios';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        setWishlistItems(res || []);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: number) => {
    try {
      await apiRemoveFromWishlist(productId);
      const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
      setWishlistItems(updatedWishlist);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const clearWishlist = () => {
    // Clear all items one by one
    wishlistItems.forEach(item => {
      apiRemoveFromWishlist(item.id).catch(error => {
        console.error('Failed to remove item:', error);
      });
    });
    setWishlistItems([]);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
            <span className="bg-[#00342B] text-white text-sm px-3 py-1 rounded-full">
              {wishlistItems.length} items
            </span>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 border-4 border-[#00342B] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading wishlist...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && wishlistItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Heart size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon</p>
            <button
              onClick={() => window.location.href = '/category'}
              className="bg-[#00342B] hover:bg-[#014237] text-white px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        )}

        {/* Wishlist Grid */}
        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={getPrimaryImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} className="text-red-500 hover:text-red-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-[#00342B]">${item.finalPrice}</span>
                    {item.originalPrice && item.originalPrice > item.finalPrice && (
                      <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => window.location.href = `/product/${item.id}`}
                    className="w-full bg-[#00342B] hover:bg-[#014237] text-white text-sm py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag size={16} />
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
