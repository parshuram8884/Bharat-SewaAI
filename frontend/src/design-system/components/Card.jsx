import React from 'react';
import { Surface } from '../foundations/Surface';

export const Card = React.forwardRef(({
  variant = 'default',
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = `overflow-hidden flex flex-col`;
  const variants = {
    default: 'border border-[var(--ds-color-border-default)]',
    interactive: 'border border-[var(--ds-color-border-default)] hover:border-[var(--ds-color-primary-default)] cursor-pointer transition-colors',
    selected: 'border-2 border-[var(--ds-color-primary-default)] bg-[var(--ds-color-primary-subtle)]',
    elevated: 'border-none shadow-[var(--ds-shadow-md)]'
  };

  return (
    <Surface
      ref={ref}
      radius="lg"
      background={variant === 'selected' ? 'primary-subtle' : 'surface-default'}
      className={`${baseClasses} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </Surface>
  );
});
Card.displayName = 'Card';

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`px-5 py-4 border-b border-[var(--ds-color-border-muted)] flex flex-col gap-1 ${className}`} {...props}>
    {children}
  </div>
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={`text-[var(--ds-text-lg)] font-semibold text-[var(--ds-color-text-primary)] ${className}`} {...props}>
    {children}
  </h3>
);
CardTitle.displayName = 'CardTitle';

export const CardSubtitle = ({ className = '', children, ...props }) => (
  <p className={`text-[var(--ds-text-sm)] text-[var(--ds-color-text-secondary)] ${className}`} {...props}>
    {children}
  </p>
);
CardSubtitle.displayName = 'CardSubtitle';

export const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-5 flex-1 ${className}`} {...props}>
    {children}
  </div>
);
CardContent.displayName = 'CardContent';

export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`px-5 py-4 bg-[var(--ds-color-surface-muted)] border-t border-[var(--ds-color-border-muted)] flex items-center ${className}`} {...props}>
    {children}
  </div>
);
CardFooter.displayName = 'CardFooter';
