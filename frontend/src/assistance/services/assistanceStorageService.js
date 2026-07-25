/**
 * Service for handling local browser storage of assistance data.
 */

const STORAGE_KEYS = {
  PREFERENCES: 'bsai_assistance_preferences',
  HISTORY: 'bsai_assistance_history',
  DISMISSALS: 'bsai_assistance_dismissals'
};

const MAX_HISTORY_ITEMS = 100;

class AssistanceStorageService {
  getPreferences() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : { language: 'en', enableOptional: true };
    } catch {
      return { language: 'en', enableOptional: true };
    }
  }

  setPreferences(prefs) {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.warn("Assistance storage limit reached or unavailable.");
    }
  }

  logHistoryEvent(event) {
    try {
      let history = this.getHistory();
      history.unshift({ ...event, occurredAt: new Date().toISOString() });
      if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
      }
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn("Failed to write assistance history.");
    }
  }

  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

export const assistanceStorageService = new AssistanceStorageService();
