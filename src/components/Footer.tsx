import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail, Phone, MapPin, ArrowLeft,
  Truck, ShieldCheck, RotateCcw, Headphones, CheckCircle
} from 'lucide-react'
import {
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn
} from 'react-icons/fa'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  return (
    <footer className="w-full bg-[#00221C] text-gray-300 pt-16 mt-auto border-t border-[#00342B] " dir="rtl">

      {/* 1. TRUST FEATURES BANNER */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#00342B]/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="flex items-start gap-4 group">
            <div className="p-3 bg-[#00342B] text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-100 tracking-wide">شحن سريع</h4>
              <p className="text-xs text-gray-400 mt-1">توصيل سريع وموثوق لكافة المحافظات.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="p-3 bg-[#00342B] text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-100 tracking-wide">دفع آمن 100%</h4>
              <p className="text-xs text-gray-400 mt-1">حماية كاملة لبياناتك ودفع آمن.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="p-3 bg-[#00342B] text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-100 tracking-wide">إرجاع خلال 30 يوم</h4>
              <p className="text-xs text-gray-400 mt-1">سياسة استبدال واسترجاع مرنة وسهلة.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="p-3 bg-[#00342B] text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-100 tracking-wide">دعم فني 24/7</h4>
              <p className="text-xs text-gray-400 mt-1">فريق متكامل لمساعدتك على مدار الساعة.</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. NEWSLETTER */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-[#00342B]/60">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-l from-[#00221C] to-[#00342B]/40 p-8 sm:p-10 rounded-2xl border border-[#00342B]/50">

          <div className="max-w-md text-center lg:text-right">
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">اشترك في نشرتنا البريدية</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-100 mt-1">احصل على خصم 20% على طلبك الأول</h3>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              كن أول من يعرف بأحدث المنتجات الحصرية والعروض والخصومات الأسبوعية.
            </p>
          </div>

          <div className="w-full max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2.5 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-semibold">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>شكراً! تم اشتراكك بنجاح. تحقق من بريدك للحصول على كود الخصم.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="أدخل بريدك الإلكتروني هنا..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#001713] border border-[#00342B] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-950/50 text-gray-100 text-xs rounded-xl pr-10 pl-4 py-3 focus:outline-none transition-all placeholder-gray-500 text-right"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <span>اشترك الآن</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* 3. MAIN NAV LINKS */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="font-black text-white text-base">M</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                متجرنا<span className="text-emerald-500">.</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              وجهتك الأولى للتسوق الإلكتروني. تشكيلة مختارة بعناية من الإلكترونيات، الأزياء، مستلزمات المنزل وأكثر بجودة ممتازة.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: <FaFacebookF />, url: '#' },
                { icon: <FaTwitter />, url: '#' },
                { icon: <FaInstagram />, url: '#' },
                { icon: <FaYoutube />, url: '#' },
                { icon: <FaLinkedinIn />, url: '#' },
              ].map((s, i) => (
                <a key={i} href={s.url}
                  className="w-8 h-8 rounded-lg bg-[#00342B] hover:bg-emerald-600 hover:text-white text-gray-400 flex items-center justify-center transition-all duration-200"
                  aria-label="social">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-100 uppercase tracking-widest border-b border-[#00342B] pb-2">فئات التسوق</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/category" className="hover:text-emerald-400 transition-colors">إلكترونيات وأجهزة ذكية</Link></li>
              <li><Link to="/category" className="hover:text-emerald-400 transition-colors">أزياء وملابس راقية</Link></li>
              <li><Link to="/category" className="hover:text-emerald-400 transition-colors">مستلزمات المنزل</Link></li>
              <li><Link to="/category" className="hover:text-emerald-400 transition-colors">جمال وعناية شخصية</Link></li>
              <li><Link to="/category" className="hover:text-emerald-400 transition-colors">ملابس وأدوات رياضية</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-100 uppercase tracking-widest border-b border-[#00342B] pb-2">خدمة العملاء</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">تتبع طلبك</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">سياسة الإرجاع</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">تفاصيل الشحن</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">تواصل مع الدعم</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-100 uppercase tracking-widest border-b border-[#00342B] pb-2">شركتنا</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">عن متجرنا</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">الفرص الوظيفية</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">مواقع الفروع</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">المدونة والأخبار</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">برنامج العمولة</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-100 uppercase tracking-widest border-b border-[#00342B] pb-2">اتصل بنا</h4>
            <ul className="space-y-3.5 text-xs font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 leading-tight">شارع الرشيد، الكرادة، بغداد</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-gray-400 font-bold" dir="ltr">+964 770 123 4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-gray-400">support@mystore.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 4. BOTTOM BAR */}
      <div className="w-full bg-[#001713] py-6 px-4 sm:px-6 lg:px-8 border-t border-[#00221C]">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="text-center md:text-right text-xs text-gray-500">
            <span>&copy; {new Date().getFullYear()} متجرنا. جميع الحقوق محفوظة.</span>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1 text-[11px] text-gray-600">
              <a href="#" className="hover:text-gray-400 transition-colors">سياسة الخصوصية</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-gray-400 transition-colors">شروط الاستخدام</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-gray-400 transition-colors">خريطة الموقع</a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {['فيزا', 'ماستركارد', 'زين كاش', 'آبل باي', 'جوجل باي'].map((p) => (
              <span key={p}
                className="px-2.5 py-1 text-[10px] font-extrabold bg-[#00221C] border border-[#00342B] text-gray-400 rounded-md select-none hover:border-emerald-800 hover:text-gray-300 transition-colors cursor-default">
                {p}
              </span>
            ))}
          </div>

        </div>
      </div>

    </footer>
  )
}
