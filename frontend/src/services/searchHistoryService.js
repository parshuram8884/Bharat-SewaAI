/**
 * searchHistoryService.js
 * Tracks personal search history locally.
 */
import { STORAGE_KEYS } from './personalisationStorageService';

export const searchHistoryService = {
  recordSearch(userId, query) {
    if (!query || query.trim().length < 2) return;
    
    let history = JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY) || '[]');
    const normalized = query.trim();

    // Deduplicate
    history = history.filter(h => !(h.userId === userId && h.query === normalized));
    
    history.unshift({
      id: 'shist_' + Date.now(),
      userId,
      query: normalized,
      searchedAt: new Date().toISOString()
    });

    // Limit to 20 per user
    const userHistory = history.filter(h => h.userId === userId).slice(0, 20);
    const otherHistory = history.filter(h => h.userId !== userId);
    
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify([...otherHistory, ...userHistory]));
  },

  getHistory(userId) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY) || '[]');
    return history.filter(h => h.userId === userId);
  },

  clearHistory(userId) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY) || '[]');
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history.filter(h => h.userId !== userId)));
  }
};
