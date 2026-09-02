import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Home, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-16" dir="rtl">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Visual illustration */}
        <motion.div 
          className="relative mx-auto w-40 h-40 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-brand/10 rounded-full animate-ping opacity-30" />
          <div className="w-32 h-32 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center relative z-10">
            <span className="text-5xl font-black text-brand tracking-tighter">404</span>
          </div>
          <motion.div 
            className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-full shadow-lg z-20"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            الصفحة غير موجودة!
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
            عذراً، يبدو أن الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله لعنوان آخر.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-brand hover:bg-brand-light text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 space-x-reverse"
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>

          <button
            onClick={() => navigate('/category')}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 space-x-reverse cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>تصفح المنتجات</span>
          </button>
        </div>

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 space-x-reverse text-xs font-semibold text-slate-400 hover:text-brand transition-colors cursor-pointer pt-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>الرجوع للصفحة السابقة</span>
        </button>

      </div>
    </main>
  );
}
