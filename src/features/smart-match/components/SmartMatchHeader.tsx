import { X, Sparkles, ArrowRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface SmartMatchHeaderProps {
  onClose: () => void;
  progress?: number;
  onBack?: () => void;
  canGoBack?: boolean;
}

export default function SmartMatchHeader({ onClose, progress = 0, onBack, canGoBack }: SmartMatchHeaderProps) {
  return (
    <div className="flex flex-col border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {canGoBack && onBack && (
            <button onClick={onBack} className="text-gray-400 hover:text-gray-700 p-1 mr-2">
              <ArrowRight size={18} />
            </button>
          )}
          <Sparkles size={18} className="text-emerald-500" />
          <h3 className="font-bold text-[#00342B]">AI Shopping Assistant</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
          <X size={18} />
        </button>
      </div>
      {progress > 0 && <ProgressBar progress={progress} />}
    </div>
  );
}
