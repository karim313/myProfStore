import React from 'react';
import { X, Sparkles } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function SmartMatchHeader({ onClose, progress = 0 }: { onClose: () => void, progress?: number }) {
  return (
    <div className="flex flex-col border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-500" />
          <h3 className="font-bold text-[#00342B]">مساعد التسوق الذكي</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
          <X size={18} />
        </button>
      </div>
      {progress > 0 && <ProgressBar progress={progress} />}
    </div>
  );
}
