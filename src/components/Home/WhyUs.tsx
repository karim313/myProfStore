import React from 'react'
import { FiTruck, FiShield, FiHeadphones } from 'react-icons/fi'

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: FiTruck,
    title: 'شحن مجاني وسريع',
    desc: 'توصيل لأي مكان خلال 24 ساعة',
  },
  {
    icon: FiShield,
    title: 'دفع آمن 100%',
    desc: 'جميع المعاملات مشفرة وآمنة',
  },
  {
    icon: FiHeadphones,
    title: 'دعم 24/7',
    desc: 'فريق دعم متاح على مدار الساعة',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function WhyUs() {
  return (
    <section
      className='mx-auto flex justify-center items-center flex-col gap-10 py-16'
      dir='rtl'
      aria-label='لماذا نحن'
    >
      <h2 className='text-3xl font-bold text-[#00342B]'>لماذا نحن؟</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 max-w-7xl w-[95%] mx-auto gap-6'>
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className='flex flex-row w-full items-center gap-4 p-8 rounded-2xl shadow-md bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out'
          >
            <div className='bg-emerald-50 p-3 rounded-2xl flex-shrink-0'>
              <Icon className='text-3xl text-emerald-600' />
            </div>
            <div className='flex flex-col'>
              <h3 className='text-base font-semibold text-[#00342B]'>{title}</h3>
              <p className='text-sm text-gray-500 mt-0.5'>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
