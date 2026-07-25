/**
 * environment.js
 * Exposes Vite environment variables safely.
 * Frontend environment variables must NOT be treated as secrets.
 */

export const environment = {
  appName: import.meta.env.VITE_APP_NAME || 'Bharat Sewa AI Demo',
  appVersion: import.meta.env.VITE_APP_VERSION || 'BSAI-DEMO-1.0.0',
  env: import.meta.env.VITE_APP_ENVIRONMENT || 'production-demo',
  isDev: import.meta.env.DEV || false,
  enablePwa: import.meta.env.VITE_ENABLE_PWA === 'true',
  enableDemoReset: import.meta.env.VITE_ENABLE_DEMO_RESET !== 'false',
  enableDebugDetails: import.meta.env.VITE_ENABLE_DEBUG_DETAILS === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS_MODULE !== 'false',
  enableSecurityDashboard: import.meta.env.VITE_ENABLE_SECURITY_DASHBOARD !== 'false'
};
