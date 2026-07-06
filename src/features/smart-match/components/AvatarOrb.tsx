import React from 'react';
import { User, Sparkles } from 'lucide-react';

export default function AvatarOrb({ isAi = false }: { isAi?: boolean }) {
  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${isAi ? 'bg-emerald-100 text-emerald-600' : 'bg-[#00342B] text-white'}`}>
      {isAi ? <Sparkles size={16} /> : <User size={16} />}
    </div>
  );
}
