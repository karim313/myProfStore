import React from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: '+10,000', suffix: '',   label: 'عميل سعيد' },
  { value: '40',      suffix: '+',  label: 'منتج متاح' },
  { value: '4.9',     suffix: '★',  label: 'متوسط التقييم' },
  { value: '24',      suffix: '/7', label: 'دعم على مدار الساعة' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function StatsBar() {
  return (
    <section
      className='w-full py-16'
      style={{
        background: 'linear-gradient(135deg, #00342B 0%, #005c47 50%, #00342B 100%)',
      }}
      aria-label='إحصائيات المتجر'
    >
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 text-center' dir='rtl'>
          {stats.map(({ value, suffix, label }) => (
            <div key={label} className='flex flex-col items-center gap-1'>
              <span className='text-4xl font-extrabold text-white tracking-tight'>
                {value}
                <span className='text-emerald-300'>{suffix}</span>
              </span>
              <span className='text-emerald-100/80 text-sm font-medium'>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
