import React from 'react';
import { Typography } from '../foundations/Typography';
import { Surface } from '../foundations/Surface';
import { IconButton } from '../components/IconButton';
import { useAssistanceUiStore } from '../../stores/assistanceUiStore';

export const PageHeader = ({
  title,
  subtitle,
  breadcrumb,
  status,
  actions,
  className = '',
  ...props
}) => {
  const { togglePanel } = useAssistanceUiStore();
  
  return (
    <Surface 
      as="header" 
      elevation="none"
      className={`border-b border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-default)] px-4 py-4 md:px-8 md:py-6 ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          {breadcrumb && <div className="text-[var(--ds-color-text-muted)] text-sm mb-1">{breadcrumb}</div>}
          
          <div className="flex items-center gap-3">
            <Typography variant="h1" className="truncate">{title}</Typography>
            {status && <div>{status}</div>}
          </div>
          
          {subtitle && (
            <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)] mt-1">
              {subtitle}
            </Typography>
          )}
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          {actions}
          <IconButton 
            icon="Sparkles" 
            variant="secondary"
            aria-label="Open guided assistance"
            onClick={togglePanel}
            title="Smart Assistance"
          />
        </div>
      </div>
    </Surface>
  );
};
