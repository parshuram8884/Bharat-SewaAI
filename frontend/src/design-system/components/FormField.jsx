import React from 'react';
import { Typography } from '../foundations/Typography';

export const FormField = ({
  label,
  required = false,
  htmlFor,
  helperText,
  error,
  className = '',
  children
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="flex items-center text-[var(--ds-text-sm)] font-medium text-[var(--ds-color-text-primary)]">
          {label}
          {required && <span className="text-[var(--ds-color-error-default)] ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      
      {/* The actual input field goes here */}
      {children}
      
      {error && (
        <Typography variant="caption" className="text-[var(--ds-color-error-default)]" id={`${htmlFor}-error`}>
          {error}
        </Typography>
      )}
      
      {helperText && !error && (
        <Typography variant="caption" className="text-[var(--ds-color-text-muted)]" id={`${htmlFor}-helper`}>
          {helperText}
        </Typography>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';
