/**
 * Home.tsx — الصفحة الرئيسية
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━
 * كل قسم معزول في كمبوننت خاص بيه داخل src/components/Home/
 * الترتيب هنا هو الترتيب المرئي على الصفحة.
 *
 * src/components/Home/
 * ├── HeroSlider.tsx        — الـ Hero الرئيسي (Framer Motion)
 * ├── WhyUs.tsx             — لماذا نحن؟ (3 cards)
 * ├── CategorySlider.tsx    — تسوق حسب الفئة (autoplay slider)
 * ├── TopRated.tsx          — الأعلى تقييمًا (grid 4 products)
 * ├── StatsBar.tsx          — أرقام وإحصائيات (social proof)
 * ├── FlashSale.tsx         — تخفيضات اليوم (countdown + grid)
 * └── NewsletterSection.tsx — اشترك في النشرة البريدية
 *
 * src/components/
 * └── FeaturedProducts.tsx  — المنتجات المميزة (bento grid)
 */

import React, { useEffect, useState } from 'react'
import './Home.css'

import HeroSlider        from '../../components/Home/HeroSlider'
import WhyUs             from '../../components/Home/WhyUs'
import CategorySlider    from '../../components/Home/CategorySlider'
import TopRated          from '../../components/Home/TopRated'
import FeaturedProducts  from '../../components/FeaturedProducts'
import StatsBar          from '../../components/Home/StatsBar'
import FlashSale         from '../../components/Home/FlashSale'
import NewsletterSection from '../../components/Home/NewsletterSection'
import { getFeatured }   from '../../data/products'
import { useNavigate }   from 'react-router-dom'
import { getProducts } from '../../api/axios'

export default function Home() {
  const navigate       = useNavigate()
  const featuredProducts = getFeatured()
  const [allProducts, setAllProducts] = useState([])
const getProductsApi = async () => {
  const res = await getProducts();
  setAllProducts(res.data.products);
  console.log(allProducts);
  
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
      <TopRated  />

      {/* 5. Featured Products — bento grid */}
      <FeaturedProducts
        featuredProducts={featuredProducts}
        onViewAll={() => navigate('/category')}
      />

      {/* 6. Stats Bar — social proof numbers */}
      <StatsBar />

      {/* 7. Flash Sale — countdown + discounted products */}
      <FlashSale />

      {/* 8. Newsletter — email subscription */}
      <NewsletterSection />
    </>
  )
}
