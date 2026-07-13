import React, { useEffect, useState } from 'react'
import heroImag from '../../assets/hero.png'
import { getCategories, getProducts } from '../../api/axios'
import { useReviewedProducts } from "../../Context/ReviewedProductsContext";
import ProductReviewsDialog from '../../components/Dialog/ProductReviewsDialog';

export default function Category() {
  const { reviewedProducts, loading } = useReviewedProducts();

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortType, setSortType] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // getAllProducts
  const getAllProducts = async () => {
    try {
      const res = await getProducts();
      setAllProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  // getAllCategories
  const getAllCategories = async () => {
    try {
      const res = await getCategories();
      let cats = res.data;
      if (cats && typeof cats === 'object' && !Array.isArray(cats)) {
        cats = cats.data || cats.categories || cats.result || cats.items || [];
      }
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  // ترجع الـ Review الخاص بالمنتج
  const getProductReview = (productId: number) => {
    return reviewedProducts.find(
      (item: any) => item.id === productId
    );
  };

  console.log(categories);
  console.log(Array.isArray(categories));

  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === "all") return true;
    console.log("Filtering:", product);
    return product.categoryId === parseInt(selectedCategory) || product.category === categories.find(c => c.id.toString() === selectedCategory)?.name;
  }).sort((a, b) => {
    switch (sortType) {
      case "price-low":
        return a.finalPrice - b.finalPrice;
      case "price-high":
        return b.finalPrice - a.finalPrice;
      case "rating":
        const ratingA = getProductReview(a.id)?.averageRating || 0;
        const ratingB = getProductReview(b.id)?.averageRating || 0;
        return ratingB - ratingA;
      case "newest":
        return b.id - a.id;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return <>
    <main className=' my-5 bg-main-color '>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col-reverse lg:flex-row gap-8 items-start">
        <div className="displayProducts flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {
            filteredProducts.map((product, index) => {
              const review = getProductReview(product.id);

              return (
                <div key={index} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">

                  {/* Image */}
                  <div className="relative overflow-hidden">

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-60 md:h-64 lg:h-72 object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>

                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="text-basetext-sm text-gray-500 mt-2 leading-6 line-clamp-2 font-bold text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {product.description.split(" ").slice(0, 5).join(" ")}...
                    </p>

                    <div className="flex items-center justify-between mt-3">

                      {review ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">⭐</span>
                            <span>{review.averageRating}</span>
                            <span className="text-gray-500">
                              ({review.reviewsCount})
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setOpen(true);
                            }}
                            className="text-sm text-[#00342B] hover:underline cursor-pointer"
                          >
                            عرض التقييمات
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpen(true);
                          }}
                          className="text-sm text-[#00342B] hover:underline cursor-pointer"
                        >
                          كن أول من يقيم
                        </button>
                      )}

                    </div>

                    <div className="flex items-center justify-between mt-4 gap-2">
                      <span className="text-xl font-bold text-[#00342B]">
                        ${product.finalPrice}
                      </span>
                      <button className="bg-[#00342B] cursor-pointer hover:bg-[#014237] text-white text-sm px-4 py-2 rounded-xl transition duration-300 whitespace-nowrap">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          }
          <ProductReviewsDialog
            open={open}
            setOpen={setOpen}
            product={selectedProduct}
            review={selectedProduct ? getProductReview(selectedProduct.id) : null}
            productId={selectedProduct?.id}
          
          />

        </div>
        <div className="layoutCategories w-full lg:w-[300px] lg:sticky lg:top-24 self-start bg-white rounded-2xl border border-gray-100 shadow-lg p-6">

          {/* Title */}
          <div className="border-b border-gray-200 pb-4 mb-5">
            <h4 className="text-xl font-bold text-[#00342B] text-right">
              الأقسام
            </h4>
            <p className="text-sm text-gray-500 text-right mt-1">
              اختر القسم الذي تريد تصفحه
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-3">

            {/* All */}
            <label
              htmlFor="all"
              className="flex items-center justify-between cursor-pointer rounded-xl px-3 py-3 hover:bg-[#F5F8F7] transition"
            >
              <span className="font-medium text-gray-700">الكل</span>
              <input
                type="radio"
                name="category"
                id="all"
                value="all"
                checked={selectedCategory === "all"}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="accent-[#00342B] w-4 h-4"
              />
            </label>

            {categories.map((category: any) => (
              <label
                key={category.id}
                htmlFor={category.id.toString()}
                className="flex items-center justify-between cursor-pointer rounded-xl px-3 py-3 hover:bg-[#F5F8F7] transition"
              >
                <span className="text-gray-700 font-medium">
                  {category.name}
                </span>

                <input
                  type="radio"
                  name="category"
                  id={category.id.toString()}
                  value={category.id.toString()}
                  checked={selectedCategory === category.id.toString()}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="accent-[#00342B] w-4 h-4"
                />
              </label>
            ))}

          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          <div className="mt-6">
            <h4 className="text-lg font-bold text-[#00342B] text-right mb-3">
              ترتيب حسب
            </h4>

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-right bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00342B] cursor-pointer"
            >
              <option value="">اختر الترتيب</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="newest">الأحدث</option>
              <option value="name">الاسم (أ - ي)</option>
            </select>
          </div>

        </div>
      </section>
    </main>
  </>
}
