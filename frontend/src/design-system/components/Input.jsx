import React from 'react';

export const Input = React.forwardRef(({
  className = '',
  error,
  disabled,
  readOnly,
  ...props
}, ref) => {
  
  const baseClasses = `block w-full rounded-[var(--ds-radius-md)] border bg-[var(--ds-color-surface-default)] px-3 py-2 text-[var(--ds-text-base)] text-[var(--ds-color-text-primary)] placeholder-[var(--ds-color-text-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--ds-color-focus-ring)]`;
  
  const stateClasses = error 
    ? 'border-[var(--ds-color-error-default)] focus:border-[var(--ds-color-error-default)]'
    : 'border-[var(--ds-color-border-strong)] hover:border-[var(--ds-color-text-muted)]';
    
  const disabledClasses = (disabled || readOnly) 
    ? 'opacity-60 bg-[var(--ds-color-surface-muted)] cursor-not-allowed'
    : '';

  return (
    <input
      ref={ref}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={!!error}
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
