import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-on-surface">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-on-surface-variant pointer-events-none flex items-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={twMerge(
            clsx(
              'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 text-base text-on-surface placeholder:text-on-surface-variant/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:opacity-75',
              Icon && 'pl-11',
              error && 'border-error focus:border-error focus:ring-error/20',
              className
            )
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-medium text-error">{error}</span>}
      {!error && helperText && <span className="text-xs text-on-surface-variant">{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
