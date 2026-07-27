import React from 'react';

interface ButtonLoaderProps {
  size?: 'sm' | 'md';
  /** Pass a text color class (e.g. text-white, text-brand-primary) — the spinner uses currentColor */
  className?: string;
}

/**
 * Compact inline spinner for buttons / form submits.
 * Uses currentColor so it inherits the button's text color automatically
 * (e.g. white on a solid primary button, brand-primary on an outline button).
 */
export const ButtonLoader: React.FC<ButtonLoaderProps> = ({ size = 'sm', className = '' }) => {
  const dimension = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={`${dimension} animate-spin-slow motion-reduce:animate-none ${className}`}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'outline';
}

/**
 * Example consumer of ButtonLoader — a submit/checkout button with a loading state.
 * Ships as reference; swap for your own Button component and just reuse ButtonLoader.
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = 'Processing',
  variant = 'primary',
  children,
  disabled,
  className = '',
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 disabled:cursor-not-allowed';
  const variants =
    variant === 'primary'
      ? 'bg-brand-primary text-white hover:bg-brand-primary/90 disabled:bg-brand-primary/70'
      : 'border border-brand-primary/30 text-brand-primary hover:border-brand-primary disabled:opacity-60';

  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${base} ${variants} ${className}`}
    >
      {isLoading && <ButtonLoader className={variant === 'primary' ? 'text-white' : 'text-brand-primary'} />}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
};

export default ButtonLoader;
