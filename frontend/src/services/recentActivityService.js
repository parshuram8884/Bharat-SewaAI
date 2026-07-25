/**
 * recentActivityService.js
 * Tracks local frontend navigation. 
 */
import { STORAGE_KEYS } from './personalisationStorageService';

export const recentActivityService = {
  recordActivity(activityRecord) {
    let recents = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITY) || '[]');
    
    // Deduplicate consecutive views of the same resource
    const lastActivity = recents.find(r => r.userId === activityRecord.userId);
    if (lastActivity && lastActivity.resourceId === activityRecord.resourceId && lastActivity.activityType === activityRecord.activityType) {
      return; // Skip repeated tracking
    }

    recents.unshift(activityRecord);

    // Limit retention
    recents = recents.filter(r => r.userId === activityRecord.userId).slice(0, 100);
    
    localStorage.setItem(STORAGE_KEYS.RECENT_ACTIVITY, JSON.stringify(recents));
  },

  getRecentActivity(userId) {
    const recents = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITY) || '[]');
    return recents.filter(r => r.userId === userId);
  },
  
  clearRecentActivity(userId) {
    let recents = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITY) || '[]');
    recents = recents.filter(r => r.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.RECENT_ACTIVITY, JSON.stringify(recents));
  }
};
