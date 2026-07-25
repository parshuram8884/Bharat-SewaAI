import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-container text-on-primary shadow-sm hover:shadow',
    secondary: 'bg-secondary hover:bg-secondary-container text-on-secondary shadow-sm hover:shadow',
    outline: 'bg-transparent border border-outline-variant hover:bg-surface-container text-on-surface',
    danger: 'bg-error hover:bg-error-container text-on-error hover:text-on-error-container shadow-sm',
    ghost: 'hover:bg-surface-container text-on-surface-variant hover:text-on-surface',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs min-h-[32px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px]',
    lg: 'px-6 py-3.5 text-base min-h-[48px]',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className))}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
