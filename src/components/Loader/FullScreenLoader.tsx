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

/**
 * Premium full-screen loading state for storefront transitions
 * (initial load, route changes, checkout processing).
 *
 * - Pure CSS/Tailwind animation, no JS timers or animation libraries.
 * - Respects prefers-reduced-motion via `motion-reduce:` variants.
 * - role="status" + sr-only text keeps it accessible without visual clutter.
 */
const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  label = 'Loading',
  subLabel = 'Curating your selection',
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
      {/* Announced to assistive tech; visual content below is decorative */}
      <span className="sr-only">{label}</span>

      <div className="flex flex-col items-center gap-8 px-6 animate-fade-in motion-reduce:animate-none">
        {/* Ring + glow + mark */}
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          {/* Soft ambient glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-brand-primary/10 blur-xl animate-pulse-glow motion-reduce:animate-none"
          />

          {/* Outer ring — slow forward rotation, gold accent arc */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            fill="none"
            className="absolute inset-0 h-full w-full animate-spin-slow motion-reduce:animate-none"
          >
            <circle cx="50" cy="50" r="46" stroke="#00342B" strokeOpacity="0.12" strokeWidth="1.5" />
            <path
              d="M50 4a46 46 0 0 1 46 46"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Inner ring — slow reverse rotation, quiet primary arc */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            fill="none"
            className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] animate-spin-reverse-slow motion-reduce:animate-none"
          >
            <path
              d="M50 96a46 46 0 0 1-46-46"
              stroke="#00342B"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>

          {/* Center mark — shopping bag */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary shadow-[0_10px_28px_-10px_rgba(0,52,43,0.6)] sm:h-14 sm:w-14">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 sm:h-7 sm:w-7"
            >
              <path
                d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z"
                stroke="#D4AF37"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M9 8V6a3 3 0 0 1 6 0v2"
                stroke="#FFFFFF"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-brand-primary">
            {label}
          </p>
          <p className="text-xs text-brand-primary/50">{subLabel}</p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-dot-pulse motion-reduce:animate-none [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-dot-pulse motion-reduce:animate-none [animation-delay:200ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-dot-pulse motion-reduce:animate-none [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
