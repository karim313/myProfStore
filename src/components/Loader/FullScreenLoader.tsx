import React from 'react';

interface FullScreenLoaderProps {
  /** Primary status announced to screen readers and shown as the eyebrow label */
  label?: string;
  /** Secondary, quieter line of copy underneath the label */
  subLabel?: string;
  /** Set false if the loader is rendered inside an already-scrolled container instead of the viewport */
  fullScreen?: boolean;
  className?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  label = 'Loading store',
  subLabel = 'Preparing your shopping experience',
  fullScreen = true,
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`${
        fullScreen ? 'fixed inset-0 z-[9999]' : 'relative h-full w-full'
      } flex items-center justify-center bg-gradient-to-b from-white via-[#F7F9F8] to-[#EEF3F0] ${className}`}
    >
      <span className="sr-only">{label}</span>

      <div className="flex flex-col items-center gap-8 px-6">
        <div className="relative flex h-32 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-white/80 shadow-2xl shadow-slate-200" />
          <div className="absolute inset-x-0 bottom-0 h-10 rounded-b-3xl bg-slate-100 border-t border-slate-200" />

          <div className="relative z-10 flex h-24 w-32 items-end justify-between">
            <div className="relative h-14 w-20 rounded-2xl border-2 border-slate-300 bg-slate-50 shadow-inner">
              <div className="absolute top-2 left-3 h-7 w-11 rounded-md bg-brand/90" />
              <div className="absolute top-4 left-2 h-2.5 w-16 rounded-full bg-white/90 shadow-sm" />
              <div className="absolute top-8 left-3 h-2 w-14 rounded-full bg-white/80" />
            </div>
            <div className="relative flex h-14 w-8 flex-col justify-between items-center">
              <div className="h-5 w-6 rounded-t-lg bg-brand/90" />
              <div className="flex items-center gap-2">
                <span className="block h-3.5 w-3.5 rounded-full bg-slate-900 animate-bounce" />
                <span className="block h-3.5 w-3.5 rounded-full bg-slate-900 animate-bounce delay-150" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center max-w-xs">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            {label}
          </p>
          <p className="text-sm text-slate-700">{subLabel}</p>
        </div>

        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-150" />
          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
