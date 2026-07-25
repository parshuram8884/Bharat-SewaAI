import { environment } from './environment';

export const FeatureFlagStatuses = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  EXPERIMENTAL: 'experimental',
  DEPRECATED: 'deprecated'
};

export const featureFlags = {
  'enable-ai-assistant': {
    key: 'enable-ai-assistant',
    description: 'Enables the AI Assistant conversational interface (Phase 4)',
    enabledByDefault: true,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-document-vault': {
    key: 'enable-document-vault',
    description: 'Enables Digilocker and Document Vault integration (Phase 12)',
    enabledByDefault: true,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-payment-simulation': {
    key: 'enable-payment-simulation',
    description: 'Enables mock payment gateway and sanctioning workflows (Phase 11)',
    enabledByDefault: true,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-csc-module': {
    key: 'enable-csc-module',
    description: 'Enables Citizen Service Centre operators and appointments (Phase 13)',
    enabledByDefault: true,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-analytics': {
    key: 'enable-analytics',
    description: 'Enables Executive and Department Analytics Dashboards (Phase 14)',
    enabledByDefault: environment.enableAnalytics,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-open-data': {
    key: 'enable-open-data',
    description: 'Enables Open Data Publication Pipeline (Phase 14)',
    enabledByDefault: true,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-security-dashboard': {
    key: 'enable-security-dashboard',
    description: 'Enables the Platform Operator Security Dashboard (Phase 15)',
    enabledByDefault: environment.enableSecurityDashboard,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-pwa': {
    key: 'enable-pwa',
    description: 'Enables Service Worker and Install Prompts (Phase 15)',
    enabledByDefault: environment.enablePwa,
    allowedEnvironments: ['development', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-offline-drafts': {
    key: 'enable-offline-drafts',
    description: 'Enables saving forms to local drafts while offline (Phase 15)',
    enabledByDefault: true,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-demo-reset': {
    key: 'enable-demo-reset',
    description: 'Enables the full Demo Factory Reset capability',
    enabledByDefault: environment.enableDemoReset,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-personalisation': {
    key: 'enable-personalisation',
    description: 'Enables dashboard customization, preferences and favorites (Phase 17)',
    enabledByDefault: true,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  },
  'enable-universal-search': {
    key: 'enable-universal-search',
    description: 'Enables frontend universal search and command palette (Phase 17)',
    enabledByDefault: true,
    allowedEnvironments: ['development', 'test', 'preview', 'production-demo'],
    status: FeatureFlagStatuses.ACTIVE
  }
};

export function isFeatureEnabled(flagKey) {
  const flag = featureFlags[flagKey];
  if (!flag) return false;
  if (flag.status === FeatureFlagStatuses.DISABLED) return false;
  if (!flag.allowedEnvironments.includes(environment.env)) return false;
  return flag.enabledByDefault;
}
