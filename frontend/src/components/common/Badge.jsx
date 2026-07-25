import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({ children, variant = 'default', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap tracking-wide';

  // Map common status terms to visual variants automatically if desired
  let mappedVariant = variant;
  const lower = typeof children === 'string' ? children.toLowerCase() : '';
  if (variant === 'default') {
    if (lower === 'approved' || lower === 'active' || lower === 'verified' || lower === 'resolved' || lower === 'operational') {
      mappedVariant = 'success';
    } else if (lower === 'pending review' || lower === 'pending' || lower === 'in progress' || lower === 'scheduled' || lower === 'needs review' || lower === 'flagged' || lower === 'documents requested' || lower === 'medium') {
      mappedVariant = 'warning';
    } else if (lower === 'rejected' || lower === 'suspended' || lower === 'failed' || lower === 'open' || lower === 'high') {
      mappedVariant = 'error';
    } else if (lower === 'low' || lower === 'sent') {
      mappedVariant = 'info';
    }
  }

  const variants = {
    default: 'bg-surface-container-highest text-on-surface',
    primary: 'bg-primary-fixed text-on-primary-fixed',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200/60',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200/60',
    error: 'bg-error-container text-on-error-container border border-error/20',
    info: 'bg-blue-100 text-blue-800 border border-blue-200/60',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[mappedVariant] || variants.default, className))} {...props}>
      {children}
    </span>
  );
}

export default Badge;
