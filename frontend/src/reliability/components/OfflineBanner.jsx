import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Icon } from '../../design-system/foundations/Icon';
import { Typography } from '../../design-system/foundations/Typography';

export const OfflineBanner = () => {
  const status = useOnlineStatus();
  
  if (status === 'online') return null;

  return (
    <div className="bg-[var(--ds-color-warning-muted)] text-[var(--ds-color-warning-default)] px-4 py-2 flex items-center justify-center gap-2 z-50 fixed bottom-0 left-0 right-0 border-t border-[var(--ds-color-warning-default)]">
      <Icon name="WifiOff" size={16} />
      <Typography variant="bodySmall" className="font-medium">
        You are currently offline. Safe drafts will be preserved locally, but submissions are disabled.
      </Typography>
    </div>
  );
};
