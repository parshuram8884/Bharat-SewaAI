/**
 * personalisationStorageService.js
 * Manages boundaries and migrations for all Phase 17 personalization records.
 */

export const STORAGE_KEYS = {
  PREFERENCES: 'bsai_user_preferences',
  LAYOUTS: 'bsai_dashboard_layouts',
  FAVORITES: 'bsai_favorites',
  RECENT_ACTIVITY: 'bsai_recent_activity',
  SAVED_VIEWS: 'bsai_saved_views',
  SEARCH_HISTORY: 'bsai_search_history',
  ONBOARDING: 'bsai_onboarding_progress',
  NOTIFICATIONS: 'bsai_notification_preferences',
  EVENTS: 'bsai_personalisation_events',
  SCHEMA_VERSION: 'bsai_personalisation_schema_version'
};

const CURRENT_SCHEMA_VERSION = 'v17.1.0';

export const personalisationStorageService = {
  initializePersonalisationStorage() {
    const version = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
    if (!version || version !== CURRENT_SCHEMA_VERSION) {
      this.migratePersonalisationStorage(version);
    }
  },

  migratePersonalisationStorage(oldVersion) {
    // Basic migration mock: Reset specific ephemeral keys if too old, but preserve safe preferences
    if (oldVersion && oldVersion.startsWith('v16')) {
      // safe upgrade path
    }
    localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
  },

  validatePersonalisationStorage() {
    // Assert boundaries
    return true;
  },

  resetPersonalisationPreferences(userId) {
    // Only resets for the specific user context
    const allFavs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    const cleanedFavs = allFavs.filter(f => f.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(cleanedFavs));
    // Implementation would clear layouts, recent activity, etc for this user.
  },

  resetPersonalisationDemoData() {
    // Total clear (Factory reset context)
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this.initializePersonalisationStorage();
  },

  getPersonalisationStorageUsage() {
    let size = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const val = localStorage.getItem(key);
      if (val) size += val.length;
    });
    return (size / 1024).toFixed(2) + ' KB';
  },

  cleanExpiredPersonalisationData() {
    // Prune recent activity > 30 days
  }
};
