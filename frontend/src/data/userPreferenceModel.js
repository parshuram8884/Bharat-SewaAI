// userPreferenceModel.js
export const createUserPreference = (userId) => ({
  id: 'pref_' + Date.now(),
  userId,
  language: 'en',
  theme: 'system',
  uiDensity: 'comfortable',
  fontScale: 100,
  reducedMotion: false,
  highContrast: false,
  readingMode: false,
  preferredLandingRoute: '',
  sidebarCollapsed: false,
  dashboardLayoutId: null,
  notificationPreferencesId: null,
  accessibilityPreferencesId: null,
  commandPaletteEnabled: true,
  keyboardShortcutsEnabled: true,
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  schemaVersion: 'v17.1.0'
});
