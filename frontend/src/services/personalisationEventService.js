/**
 * personalisationEventService.js
 * Tracks frontend-only events for diagnostics.
 */

import { STORAGE_KEYS } from './personalisationStorageService';

export const personalisationEventService = {
  logEvent({ eventType, userId, module, resourceType, resourceIdMasked, safeMetadata }) {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    
    // Bounds check
    if (events.length > 200) events.shift();

    events.push({
      id: 'p_evt_' + Date.now() + Math.random().toString(36).substr(2, 5),
      eventType,
      userId,
      module,
      resourceType,
      resourceIdMasked,
      occurredAt: new Date().toISOString(),
      safeMetadata
    });

    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getEventsForUser(userId) {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    return events.filter(e => e.userId === userId);
  }
};
