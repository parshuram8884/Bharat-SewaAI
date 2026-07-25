import React from 'react';

const VARIANTS = {
  display: 'text-[var(--ds-text-4xl)] font-bold tracking-tighter',
  h1: 'text-[var(--ds-text-3xl)] font-bold tracking-tight',
  h2: 'text-[var(--ds-text-2xl)] font-semibold tracking-tight',
  h3: 'text-[var(--ds-text-xl)] font-semibold',
  title: 'text-[var(--ds-text-lg)] font-medium',
  body: 'text-[var(--ds-text-base)]',
  bodySmall: 'text-[var(--ds-text-sm)]',
  label: 'text-[var(--ds-text-sm)] font-medium',
  caption: 'text-[var(--ds-text-xs)] text-[var(--ds-color-text-muted)]'
};

const ELEMENT_MAP = {
  display: 'h1', h1: 'h1', h2: 'h2', h3: 'h3', title: 'h4', 
  body: 'p', bodySmall: 'p', label: 'label', caption: 'span'
};

export const Typography = React.forwardRef(({ variant = 'body', as, className = '', children, ...props }, ref) => {
  const Component = as || ELEMENT_MAP[variant] || 'span';
  const baseClass = VARIANTS[variant] || VARIANTS.body;
  
  return (
    <Component ref={ref} className={`${baseClass} ${className}`} {...props}>
      {children}
    </Component>
  );
});

Typography.displayName = 'Typography';
