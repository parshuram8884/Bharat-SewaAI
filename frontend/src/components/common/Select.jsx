import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  children,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-semibold text-on-surface">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={twMerge(
          clsx(
            'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 text-base text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:opacity-75 cursor-pointer',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )
        )}
        {...props}
      >
        {children || options.map((opt) => (
          <option key={opt.value || opt} value={opt.value !== undefined ? opt.value : opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <span className="text-xs font-medium text-error">{error}</span>}
      {!error && helperText && <span className="text-xs text-on-surface-variant">{helperText}</span>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
