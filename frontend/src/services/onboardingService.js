/**
 * onboardingService.js
 * Tracks progress for tours and feature highlights.
 */
import { STORAGE_KEYS } from './personalisationStorageService';

export const onboardingService = {
  getProgress(userId, tourId) {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONBOARDING) || '[]');
    return records.find(r => r.userId === userId && r.tourId === tourId) || null;
  },

  markCompleted(userId, tourId, roleContext) {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONBOARDING) || '[]');
    const existing = records.find(r => r.userId === userId && r.tourId === tourId);
    
    if (existing) {
      existing.completed = true;
      existing.completedAt = new Date().toISOString();
    } else {
      records.push({
        id: 'onb_' + Date.now(),
        userId,
        tourId,
        roleContext,
        completed: true,
        completedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(records));
  }
};
