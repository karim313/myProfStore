import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface SmartMatchButtonProps {
  onClick: () => void;
  accentColor?: string;
  variants?: any;
}

export default function SmartMatchButton({ onClick, accentColor = '#00342B', variants }: SmartMatchButtonProps) {
  return (
    <motion.div
      variants={variants}
      className="mt-8 w-full max-w-md p-4 rounded-2xl border bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-4 transition-all duration-300 hover:bg-white cursor-pointer group"
      style={{ borderColor: `${accentColor}30` }}
      onClick={onClick}
    >
      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
        <Sparkles size={20} className="animate-pulse" />
      </div>
      <div className="flex-1 text-right">
        <h4 className="text-gray-900 font-bold text-sm mb-1 flex items-center gap-2">
          محتار تختار إيه؟
          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide">الذكاء الاصطناعي</span>
        </h4>
        <p className="text-gray-500 text-xs leading-relaxed">
          دع مساعدنا الذكي يختار لك أفضل المنتجات بناءً على ذوقك وميزانيتك في ثوانٍ.
        </p>
      </div>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
      </div>
    </motion.div>
  );
}
