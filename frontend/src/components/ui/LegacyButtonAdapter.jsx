import React from 'react';
import { Button } from '../../design-system/components/Button';
import { componentUsageRegistry } from '../../design-system/registry/componentUsageRegistry';

/**
 * @deprecated 
 * This is a compatibility adapter for Phase 18 migration.
 * It maps legacy `ui/Button` props to `design-system/components/Button`.
 * Once all usages are migrated to the new Design System directly, this adapter will be removed.
 */
export const LegacyButtonAdapter = React.forwardRef(({
  variant = 'primary', // Old variants might differ
  className = '',
  children,
  ...props
}, ref) => {
  
  // Example translation of legacy props to standard props
  let standardVariant = variant;
  if (variant === 'danger-outline') {
    standardVariant = 'danger';
    // Might need custom override or we just map it to danger
  }
  
  return (
    <Button
      ref={ref}
      variant={standardVariant}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
});

LegacyButtonAdapter.displayName = 'LegacyButtonAdapter';
