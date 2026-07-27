import { useEffect, useState } from 'react'
import './Home.css'

import HeroSlider        from '../../components/Home/HeroSlider'
import WhyUs             from '../../components/Home/WhyUs'
import CategorySlider    from '../../components/Home/CategorySlider'
import TopRated          from '../../components/Home/TopRated'
import FeaturedProducts  from '../../components/FeaturedProducts'
import StatsBar          from '../../components/Home/StatsBar'
import FlashSale         from '../../components/Home/FlashSale'
import NewsletterSection from '../../components/Home/NewsletterSection'
import { useNavigate }   from 'react-router-dom'
import { getProducts }   from '../../api/axios'
import type { Product }  from '@/interface'

export default function Home() {
  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [highestDiscountProducts, setHighestDiscountProducts] = useState<Product[]>([])

  const getProductsApi = async () => {
    try {
      const res = await getProducts();
      const products: Product[] = Array.isArray(res?.products)
        ? res.products
        : Array.isArray(res)
        ? (res as unknown as Product[])
        : [];

      setAllProducts(products);
      setFeaturedProducts(products.slice(0, 4));
      setHighestDiscountProducts(
        products.filter((product) => (product.discountPercentage ?? 0) > 0).slice(0, 4)
      );
    } catch (error) {
      console.error('Failed to load products on Home page:', error);
    }
  };

  useEffect(() => {
    getProductsApi();
  }, []);

  return (
    <>
      {/* 1. Hero Slider — Apple / Zara inspired */}
      <HeroSlider />

      {/* 2. Why Us — 3 trust feature cards */}
      <WhyUs />

      {/* 3. Category Slider — browse by category */}
      <CategorySlider allProducts={allProducts} />

      {/* 4. Top Rated — highest-rated products grid */}
      <TopRated />

      {/* 5. Featured Products — bento grid */}
      <FeaturedProducts
        featuredProducts={featuredProducts}
        onViewAll={() => navigate('/category')}
      />

      {/* 6. Stats Bar — social proof numbers */}
      <StatsBar />

      {/* 7. Flash Sale — countdown + discounted products */}
      <FlashSale highestDiscountProducts={highestDiscountProducts} />

      {/* 8. Newsletter — email subscription */}
      <NewsletterSection />
    </>
  )
}
