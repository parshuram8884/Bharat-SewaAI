import React from 'react';
import { Icon } from '../foundations/Icon';

const VARIANTS = {
  primary: 'bg-[var(--ds-color-primary-default)] text-[var(--ds-color-text-inverse)] hover:bg-[var(--ds-color-primary-hover)] active:bg-[var(--ds-color-primary-active)] border-transparent',
  secondary: 'bg-[var(--ds-color-surface-muted)] text-[var(--ds-color-text-primary)] hover:bg-[var(--ds-color-border-default)] border-transparent',
  outline: 'bg-transparent text-[var(--ds-color-text-primary)] border-[var(--ds-color-border-strong)] hover:bg-[var(--ds-color-surface-muted)]',
  ghost: 'bg-transparent text-[var(--ds-color-text-primary)] hover:bg-[var(--ds-color-surface-muted)] border-transparent',
  danger: 'bg-[var(--ds-color-error-default)] text-[var(--ds-color-text-inverse)] hover:opacity-90 border-transparent',
};

const SIZES = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3'
};

const ICON_SIZES = {
  sm: 16,
  md: 20,
  lg: 24
};

export const IconButton = React.forwardRef(({
  icon,
  'aria-label': ariaLabel,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  
  if (!ariaLabel) {
    console.warn("IconButton requires an aria-label for accessibility.");
  }

  const baseClasses = `inline-flex items-center justify-center border rounded-[var(--ds-radius-md)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--ds-color-focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed`;
  const variantClasses = VARIANTS[variant] || VARIANTS.ghost;
  const sizeClasses = SIZES[size] || SIZES.md;
  const iconSize = ICON_SIZES[size] || 20;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <Icon name="Loader2" className="animate-spin" size={iconSize} />
      ) : (
        <Icon name={icon} size={iconSize} />
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';
