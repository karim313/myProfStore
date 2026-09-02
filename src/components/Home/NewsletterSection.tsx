import { useState } from 'react'
import { FiMail } from 'react-icons/fi'
import { motion } from 'framer-motion'

type Variants = Record<string, any>

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any } },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <motion.section
      className="w-full py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f0faf6 0%, #e6f7ef 100%)' }}
      aria-label="النشرة البريدية"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
    >
      {/* Background decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 text-center relative z-10" dir="rtl">

        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
        >
          <FiMail className="text-sm" />
          نشرتنا البريدية
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-extrabold text-[#00342B] mb-4 leading-snug"
        >
          احصل على أحدث العروض
          <span className="text-emerald-600"> قبل الجميع</span>
        </motion.h2>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-gray-500 text-sm mb-8 leading-relaxed">
          اشترك في نشرتنا البريدية وكن أول من يعلم بالعروض الحصرية والمنتجات الجديدة.
          <br />
          لا بريد مزعج — فقط أفضل الصفقات.
        </motion.p>

        {/* Success state */}
        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex items-center justify-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-6 py-4 font-semibold"
          >
            <span className="text-xl">🎉</span>
            شكرًا! تم تسجيلك بنجاح.
          </motion.div>
        ) : (
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني..."
              required
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm outline-none focus:border-[#00342B] focus:ring-2 focus:ring-[#00342B]/10 transition-all duration-200 text-right"
            />
            <motion.button
              type="submit"
              className="bg-[#00342B] hover:bg-[#004d3d] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-[#00342B]/20 cursor-pointer whitespace-nowrap"
              whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(0,52,43,0.35)' }}
              whileTap={{ scale: 0.97 }}
            >
              اشترك الآن
            </motion.button>
          </motion.form>
        )}

        <motion.p variants={itemVariants} className="text-gray-400 text-xs mt-4">
          لن نشارك بريدك مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت.
        </motion.p>

      </div>
    </motion.section>
  )
}
