/**
 * notificationPreferenceService.js
 * Manages local user preferences for notification filtering.
 */
import { STORAGE_KEYS } from './personalisationStorageService';

export const notificationPreferenceService = {
  getPreferences(userId) {
    const prefs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const userPref = prefs.find(p => p.userId === userId);
    
    if (userPref) return userPref;

    // Return Defaults
    return {
      userId,
      categories: {
        applications: 'enabled',
        grievances: 'enabled',
        payments: 'important-only',
        documents: 'enabled',
        csc: 'enabled',
        security: 'important-only'
      }
    };
  },

  updatePreferences(userId, newCategories) {
    const prefs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    let userPref = prefs.find(p => p.userId === userId);
    
    if (!userPref) {
      userPref = { id: 'notif_pref_' + Date.now(), userId, categories: {} };
      prefs.push(userPref);
    }

    userPref.categories = { ...userPref.categories, ...newCategories };
    userPref.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(prefs));
  }
};
