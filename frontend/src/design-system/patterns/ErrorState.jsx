import React from 'react';
import { Typography } from '../foundations/Typography';
import { Icon } from '../foundations/Icon';

export const ErrorState = ({
  title = "Something went wrong",
  description = "An error occurred while loading this content.",
  retryAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 bg-[var(--ds-color-error-subtle)] rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-error-default)]/20 ${className}`}>
      <div className="text-[var(--ds-color-error-default)] mb-4">
        <Icon name="AlertTriangle" size={48} />
      </div>
      <Typography variant="h3" className="mb-2 text-[var(--ds-color-error-default)]">{title}</Typography>
      <Typography variant="body" className="text-[var(--ds-color-error-default)]/80 max-w-sm mb-6">
        {description}
      </Typography>
      
      {retryAction && (
        <div>{retryAction}</div>
      )}
    </div>
  );
};
