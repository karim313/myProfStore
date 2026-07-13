import React, { useState } from 'react'
import { FiMail } from 'react-icons/fi'

// ─── Component ────────────────────────────────────────────────────────────────
export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <section
      className='w-full py-20'
      style={{ background: 'linear-gradient(135deg, #f0faf6 0%, #e6f7ef 100%)' }}
      aria-label='النشرة البريدية'
    >
      <div className='max-w-2xl mx-auto px-6 text-center' dir='rtl'>

        {/* Badge */}
        <div className='inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6'>
          <FiMail className='text-sm' />
          نشرتنا البريدية
        </div>

        {/* Heading */}
        <h2 className='text-3xl font-extrabold text-[#00342B] mb-4 leading-snug'>
          احصل على أحدث العروض
          <span className='text-emerald-600'> قبل الجميع</span>
        </h2>

        {/* Description */}
        <p className='text-gray-500 text-sm mb-8 leading-relaxed'>
          اشترك في نشرتنا البريدية وكن أول من يعلم بالعروض الحصرية والمنتجات الجديدة.
          <br />
          لا بريد مزعج — فقط أفضل الصفقات.
        </p>

        {/* Success state */}
        {subscribed ? (
          <div className='flex items-center justify-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-6 py-4 font-semibold'>
            <span className='text-xl'>🎉</span>
            شكرًا! تم تسجيلك بنجاح.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'
          >
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='أدخل بريدك الإلكتروني...'
              required
              className='flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm outline-none focus:border-[#00342B] focus:ring-2 focus:ring-[#00342B]/10 transition-all duration-200 text-right'
            />
            <button
              type='submit'
              className='bg-[#00342B] hover:bg-[#004d3d] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#00342B]/20 cursor-pointer whitespace-nowrap'
            >
              اشترك الآن
            </button>
          </form>
        )}

        <p className='text-gray-400 text-xs mt-4'>
          لن نشارك بريدك مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت.
        </p>

      </div>
    </section>
  )
}
