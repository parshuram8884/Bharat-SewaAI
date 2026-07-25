import React from 'react';
import { Typography } from '../foundations/Typography';
import { Icon } from '../foundations/Icon';

export const EmptyState = ({
  icon = 'Inbox',
  title,
  description,
  primaryAction,
  secondaryAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 ${className}`}>
      <div className="w-16 h-16 bg-[var(--ds-color-surface-muted)] rounded-full flex items-center justify-center mb-6 text-[var(--ds-color-text-muted)]">
        <Icon name={icon} size={32} />
      </div>
      <Typography variant="h3" className="mb-2">{title}</Typography>
      <Typography variant="body" className="text-[var(--ds-color-text-secondary)] max-w-sm mb-8">
        {description}
      </Typography>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
};
