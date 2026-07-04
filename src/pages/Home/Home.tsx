import React, { useState, useRef, useEffect } from 'react'
import heroImage from "../../../public/hero_banner.png";
import heroImage2 from "../../../public/hero_banner_alt.png";
import heroImage3 from "../../../public/hero_banner_alt2.png";
import "./Home.css"
import { FiTruck, FiShield, FiHeadphones, FiChevronLeft, FiChevronRight, FiHeart, FiEye, FiShoppingCart } from "react-icons/fi";
import { products } from '../../data/products';
import type { Product } from '../../data/products';
import Category from '../Categories/Category';
import { FaStar } from 'react-icons/fa';


export default function Home() {

  const [product, setproduct] = useState<Product[]>(products)
  const [activeTab, setActiveTab] = useState<string>('الكل')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [prodHigestRated, setprodHigestRated] = useState<Product[]>(products.filter((product) => product.rating >= 4.5))
  // console.log(product);

  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      // In RTL layout, left/right direction scroll amounts might be reversed.
      // -320 scroll is left-wards, +320 is right-wards.
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        const progress = (Math.abs(scrollLeft) / totalScrollable) * 100;
        setScrollProgress(progress);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        const cardStep = 380;
        const isAtEnd = Math.abs(scrollLeft) + clientWidth >= scrollWidth - 50;

        if (isAtEnd) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: -cardStep, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const coverCategories = products.filter(
    (product, index, array) =>
      index === array.findIndex(
        item => item.category === product.category
      )
  );

  const filteredProducts = activeTab === 'الكل'
    ? products
    : products.filter(p => p.category === activeTab);
  // console.log(coverCategories);


  return <>
    <main className='w-full py-10 lg:py-16 bg-main-color'>
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 pt-10 w-[90%] md:w-[80%] mx-auto py-16">

        {/* LEFT: 3-Card Stacked Gallery */}
        <div className="w-full lg:w-[50%] flex justify-center items-center">
          <picture className='relative hero-gallery-container block cursor-pointer'>
            <img src={heroImage} alt="hero image" className='heroImage  w-[60%] h-[100%] object-cover shadow-2xl mt-3 rounded-2xl' />
            <img src={heroImage2} alt="hero image" className='heroImage2 w-[60%] h-[100%] object-cover shadow-2xl mt-3 rounded-2xl' />
            <img src={heroImage3} alt="hero image" className='heroImage3 w-[60%] h-[100%] object-cover shadow-2xl mt-3 rounded-2xl' />
          </picture>
        </div>

        {/* RIGHT: Hero Text Content */}
        <div className="heroSection w-full lg:w-[50%] flex justify-center flex-col gap-3">
          <div className="content flex flex-col gap-5 items-end">
            <span className='border roued-full bg-[#00342B] p-2 rounded-2xl w-fit text-center text-gray-200  text-xs'>مجموعة 2024 الحصرية</span>
            <h1 className='font-bold text-3xl sm:text-4xl lg:text-5xl text-[#00342B] text-right'>اكتشف أحدث صيحات الموضة</h1>
            <p className='text-gray-600 text-right w-full lg:w-[80%] text-sm sm:text-base'>قطع حصرية مصممة خصيصاً لمن يقدرون الندرة ويبحثون عن تفاصيل لا يشبهها شيء.</p>
            <div className="btns flex gap-2">
              <button className='bg-[#00342B] text-gray-200 px-3 py-2 hover:bg-[#011b16] duration-300 ease-in-out  w-fit text-center cursor-pointer'>اكتشف المزيد</button>
              <button className='text-black border border-gray-300 px-3 py-2 hover:bg-gray-300 transition-colors duration-300 ease-in-out w-fit text-center cursor-pointer rounded'>تسوق الآن</button>
            </div>
          </div>
        </div>

      </div>
    </main>
    <section className='why-us  mx-auto flex justify-center items-center flex-col gap-10 py-16'>
      <h2 className='text-3xl font-bold text-[#00342B]'>لماذا نحن؟</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 w-[95%] md:w-[90%] lg:w-[80%] gap-10'>
        <div className='flex flex-row w-full  items-center hover:shadow-lg transition-all duration-300 ease-in-out gap-3  p-8 rounded-2xl shadow-md'>
          <div className='bg-[#00342B] p-2 rounded-2xl w-fit text-center text-gray-200  text-xs'>
            <FiTruck className="text-4xl text-emerald-600" />
          </div>
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold'>شحن سريع</h3>
            <p className='text-sm text-gray-600'>شحن سريع وموثوق</p>
          </div>
        </div>
        <div className='flex flex-row  items-center gap-3 hover transition-all duration-300 ease-in-out p-8 rounded-2xl shadow-md'>
          <div className='bg-[#00342B] p-2 rounded-2xl w-fit text-center text-gray-200  text-xs'>
            <FiShield className="text-4xl text-emerald-600" />
          </div>
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold'>دعم فني</h3>
            <p className='text-sm text-gray-600'>دعم فني على مدار الساعة</p>
          </div>
        </div>
        <div className='flex flex-row  items-center gap-3 hover transition-all duration-300 ease-in-out p-8 rounded-2xl shadow-md'>
          <div className='bg-[#00342B] p-2 rounded-2xl w-fit text-center text-gray-200  text-xs'>
            <FiHeadphones className="text-4xl text-emerald-600" />
          </div>
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold'>ضمان الجودة</h3>
            <p>ضمان الجودة على جميع المنتجات</p>
          </div>
        </div>
      </div>
    </section>
    <section className='browseWithCategory bg-main-color py-16'>
      <div className="title flex  justify-between items-center w-[95%] md:w-[90%] lg:w-[80%] mx-auto">
        <button className='cursor-pointer hover:underline transition-all duration-300 ease-in-out'>عرض الكل</button>
        <h2 className='font-bold text-[#00342B]'><span className='border-b-2'>تسوق</span> حسب الفئة</h2>
      </div>
      <div className="categories w-[95%] md:w-[90%] lg:w-[80%] mx-auto relative px-4 md:px-12">
        {/* Navigation Buttons (Visible on both mobile & desktop, styled responsively) */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 hover:bg-[#00342B] text-[#00342B] hover:text-white p-2 md:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95"
          aria-label="Scroll right"
        >
          <FiChevronRight className="text-lg md:text-xl" />
        </button>

        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 hover:bg-[#00342B] text-[#00342B] hover:text-white p-2 md:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95"
          aria-label="Scroll left"
        >
          <FiChevronLeft className="text-lg md:text-xl" />
        </button>

        {/* Categories overflow container */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="container flex overflow-x-auto no-scrollbar w-full gap-10 my-10 snap-x snap-mandatory scroll-smooth pb-4"
          dir="rtl"
        >
          {
            coverCategories.map((Category) => (
              <div key={Category.id} className="card hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer w-[280px] md:w-[340px] shrink-0 snap-start relative">
                <picture className='w-full h-[100%]'>
                  <img src={Category.imageCover} alt={Category.category} className='w-full h-[100%] object-cover rounded-xl' />
                </picture>
                <span className='text-center text-lg font-semibold absolute bottom-2 right-2 bg-gray-900/40 px-4 py-2 rounded-lg text-gray-200'> {Category.category}</span>
              </div>
            ))
          }
        </div>

        {/* Visual Progress Bar (Professional Scroll Indicator) */}
        <div className="w-[100px] h-[3px] bg-gray-200 mx-auto mt-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00342B] transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(15, scrollProgress))}%` }}
          />
        </div>
      </div>

    </section>
    <section className='highest-rated-products w-full lg:w-[90%] mx-auto text-center flex flex-col gap-10 py-16 '>
      <h3 className='text-3xl font-bold text-[#00342B]'>الاعلي تقييما</h3>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
       {
        prodHigestRated.slice(0,4).map((pro)=>(
           <div key={pro.id} className="card rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-2" >
          <picture className="picMostRated image w-full h-[80%] relative overflow-hidden addToCart">
            <img src={pro.imageCover} alt={pro.title} className='w-full h-full object-cover' />
          </picture>
          <div className="content flex flex-col items-end mx-3 mt-4 p-3">
            <span className="categoryName text-gray-500">{pro.category}</span>
            <h5 className="font-semibold text-[#00342B] text-right w-full">{pro.title}</h5>
            <div className="flex justify-between items-center w-full">
              <span className='font-semibold text-[#00342B]'>{pro.price} د.ع</span>
              <div className="flex  items-center gap-1">
                <span className='text-gray-500'>{pro.rating}</span>
                <FaStar className="text-yellow-500" />
              </div>
            </div>
          </div>

        </div>
        ))
       }
      </div>

    </section>


  </>
}
