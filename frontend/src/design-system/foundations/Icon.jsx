import React from 'react';
import * as LucideIcons from 'lucide-react';

export const Icon = React.forwardRef(({ name, size = 20, className = '', ...props }, ref) => {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) {
    console.warn(`Icon ${name} not found`);
    return null;
  }
  return <LucideIcon ref={ref} size={size} className={className} {...props} />;
});

Icon.displayName = 'Icon';
