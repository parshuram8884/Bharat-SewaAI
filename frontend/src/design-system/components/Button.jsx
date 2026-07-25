import React from 'react';
import { Icon } from '../foundations/Icon';

const VARIANTS = {
  primary: 'bg-[var(--ds-color-primary-default)] text-[var(--ds-color-text-inverse)] hover:bg-[var(--ds-color-primary-hover)] active:bg-[var(--ds-color-primary-active)] border-transparent',
  secondary: 'bg-[var(--ds-color-surface-muted)] text-[var(--ds-color-text-primary)] hover:bg-[var(--ds-color-border-default)] border-transparent',
  outline: 'bg-transparent text-[var(--ds-color-text-primary)] border-[var(--ds-color-border-strong)] hover:bg-[var(--ds-color-surface-muted)]',
  ghost: 'bg-transparent text-[var(--ds-color-text-primary)] hover:bg-[var(--ds-color-surface-muted)] border-transparent',
  danger: 'bg-[var(--ds-color-error-default)] text-[var(--ds-color-text-inverse)] hover:opacity-90 border-transparent',
  success: 'bg-[var(--ds-color-success-default)] text-[var(--ds-color-text-inverse)] hover:opacity-90 border-transparent',
  link: 'bg-transparent text-[var(--ds-color-primary-default)] hover:underline border-transparent p-0'
};

const SIZES = {
  sm: 'px-3 py-1.5 text-[var(--ds-text-sm)]',
  md: 'px-4 py-2 text-[var(--ds-text-base)]',
  lg: 'px-6 py-3 text-[var(--ds-text-lg)]'
};

export const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  type = 'button',
  ...props
}, ref) => {
  
  const baseClasses = `inline-flex items-center justify-center font-medium border rounded-[var(--ds-radius-md)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--ds-color-focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed`;
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  const sizeClasses = variant === 'link' ? '' : SIZES[size] || SIZES.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Icon name="Loader2" className="animate-spin mr-2" size={size === 'sm' ? 16 : 20} />
      )}
      {!loading && leftIcon && (
        <Icon name={leftIcon} className="mr-2" size={size === 'sm' ? 16 : 20} />
      )}
      <span>{children}</span>
      {!loading && rightIcon && (
        <Icon name={rightIcon} className="ml-2" size={size === 'sm' ? 16 : 20} />
      )}
    </button>
  );
});

Button.displayName = 'Button';
