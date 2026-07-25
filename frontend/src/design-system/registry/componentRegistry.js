export const componentRegistry = {
  Button: { id: 'Button', category: 'Action', status: 'stable', version: '1.0.0' },
  IconButton: { id: 'IconButton', category: 'Action', status: 'stable', version: '1.0.0' },
  Card: { id: 'Card', category: 'Layout', status: 'stable', version: '1.0.0' },
  Badge: { id: 'Badge', category: 'Feedback', status: 'stable', version: '1.0.0' },
  StatusBadge: { id: 'StatusBadge', category: 'Feedback', status: 'stable', version: '1.0.0' },
  FormField: { id: 'FormField', category: 'Forms', status: 'stable', version: '1.0.0' },
  Input: { id: 'Input', category: 'Forms', status: 'stable', version: '1.0.0' },
  PageHeader: { id: 'PageHeader', category: 'Patterns', status: 'stable', version: '1.0.0' },
  EmptyState: { id: 'EmptyState', category: 'States', status: 'stable', version: '1.0.0' },
  ErrorState: { id: 'ErrorState', category: 'States', status: 'stable', version: '1.0.0' },
  LoadingState: { id: 'LoadingState', category: 'States', status: 'stable', version: '1.0.0' },
  DataTable: { id: 'DataTable', category: 'Patterns', status: 'experimental', version: '0.1.0' },
  Dialog: { id: 'Dialog', category: 'Overlays', status: 'stable', version: '1.0.0' }
};

export const statusRegistry = {
  draft: { key: 'draft', tone: 'infoSubtle', icon: 'FileEdit' },
  submitted: { key: 'submitted', tone: 'info', icon: 'Send' },
  pending: { key: 'pending', tone: 'warningSubtle', icon: 'Clock' },
  approved: { key: 'approved', tone: 'success', icon: 'CheckCircle' },
  rejected: { key: 'rejected', tone: 'error', icon: 'XCircle' },
  completed: { key: 'completed', tone: 'success', icon: 'Check' },
  failed: { key: 'failed', tone: 'error', icon: 'AlertTriangle' },
  offline: { key: 'offline', tone: 'errorSubtle', icon: 'WifiOff' }
};

export const pageStateRegistry = {
  states: ['loading', 'empty', 'error', 'offline', 'permission-denied', 'feature-disabled', 'missing-data', 'blocked', 'success', 'conflict']
};
