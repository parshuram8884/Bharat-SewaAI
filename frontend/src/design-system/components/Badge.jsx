import React from 'react';

const VARIANTS = {
  default: 'bg-[var(--ds-color-surface-muted)] text-[var(--ds-color-text-secondary)] border-[var(--ds-color-border-default)]',
  primary: 'bg-[var(--ds-color-primary-subtle)] text-[var(--ds-color-primary-default)] border-[var(--ds-color-primary-subtle)]',
  success: 'bg-[var(--ds-color-success-subtle)] text-[var(--ds-color-success-default)] border-[var(--ds-color-success-subtle)]',
  warning: 'bg-[var(--ds-color-warning-subtle)] text-[var(--ds-color-warning-default)] border-[var(--ds-color-warning-subtle)]',
  error: 'bg-[var(--ds-color-error-subtle)] text-[var(--ds-color-error-default)] border-[var(--ds-color-error-subtle)]'
};

export const Badge = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = `inline-flex items-center px-2.5 py-0.5 rounded-[var(--ds-radius-pill)] text-xs font-medium border`;
  const variantClasses = VARIANTS[variant] || VARIANTS.default;

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </span>
  );
};
