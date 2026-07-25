import React from 'react';
import { Surface } from '../../design-system/foundations/Surface';
import { Typography } from '../../design-system/foundations/Typography';
import { Button } from '../../design-system/components/Button';
import { Icon } from '../../design-system/foundations/Icon';

export const GlobalErrorFallback = ({ error, resetErrorBoundary, context = 'application' }) => {
  return (
    <Surface className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[var(--ds-color-error-muted)] flex items-center justify-center text-[var(--ds-color-error-default)]">
        <Icon name="AlertTriangle" size={32} />
      </div>
      
      <div className="space-y-2 max-w-md">
        <Typography variant="h2">Something went wrong</Typography>
        <Typography variant="body" className="text-[var(--ds-color-text-secondary)]">
          The {context} encountered an unexpected error.
        </Typography>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => window.location.assign('/')} variant="secondary">
          Return Home
        </Button>
        {resetErrorBoundary && (
          <Button onClick={resetErrorBoundary} variant="primary">
            Try Again
          </Button>
        )}
      </div>
      
      <Typography variant="caption" className="text-[var(--ds-color-text-muted)] mt-8">
        Diagnostic Ref: ERR_{Math.floor(Date.now() / 1000).toString(36).toUpperCase()}
      </Typography>
    </Surface>
  );
};
