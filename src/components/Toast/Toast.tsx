import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

const icons: Record<ToastType, ReactElement> = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
    </svg>
  ),
};

const colors: Record<ToastType, { bg: string; icon: string; bar: string }> = {
  success: { bg: 'bg-white border-l-4 border-emerald-500', icon: 'text-emerald-500 bg-emerald-50', bar: 'bg-emerald-500' },
  error:   { bg: 'bg-white border-l-4 border-red-500',     icon: 'text-red-500 bg-red-50',         bar: 'bg-red-500'     },
  warning: { bg: 'bg-white border-l-4 border-amber-500',   icon: 'text-amber-500 bg-amber-50',     bar: 'bg-amber-500'   },
  info:    { bg: 'bg-white border-l-4 border-blue-500',    icon: 'text-blue-500 bg-blue-50',        bar: 'bg-blue-500'    },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const DURATION = 4000;
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick);
      else {
        setVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(show);
      cancelAnimationFrame(rafRef.current);
    };
  }, [toast.id, onRemove]);

  const { bg, icon, bar } = colors[toast.type];

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg pointer-events-auto transition-all duration-300 ${bg} ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
      style={{ minWidth: 300, maxWidth: 380 }}
    >
      <div className="flex items-start gap-3 p-4 pr-10">
        <span className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${icon}`}>
          {icons[toast.type]}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300); }}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100">
        <div className={`h-full transition-none ${bar}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

export function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((title: string, type: ToastType = 'info', description?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, description, type }]);
  }, []);

  return { toasts, toast, remove };
}
