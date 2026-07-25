import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className = '', title, subtitle, action, footer, ...props }) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden flex flex-col',
          className
        )
      )}
      {...props}
    >
      {(title || action) && (
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between gap-4 bg-surface/50">
          <div>
            {title && <h3 className="text-lg font-heading font-bold text-on-surface">{title}</h3>}
            {subtitle && <p className="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-6 flex-1">{children}</div>
      {footer && (
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/30 text-sm text-on-surface-variant">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
