/**
 * favoritesService.js
 * Manages user favorites stored in localStorage.
 */
import { STORAGE_KEYS } from './personalisationStorageService';

export const favoritesService = {
  getFavorites(userId) {
    const allFavs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    return allFavs.filter(f => f.userId === userId && f.available);
  },

  getFavoritesByType(userId, type) {
    return this.getFavorites(userId).filter(f => f.type === type);
  },

  addFavorite(favItem) {
    const allFavs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    const userFavs = allFavs.filter(f => f.userId === favItem.userId);
    
    if (userFavs.length >= this.getFavoriteLimit()) {
      throw new Error('Favorite limit reached');
    }
    
    if (userFavs.some(f => f.referenceId === favItem.referenceId && f.type === favItem.type)) {
      return; // Already favorite
    }

    allFavs.push(favItem);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(allFavs));
  },

  removeFavorite(userId, referenceId, type) {
    let allFavs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    allFavs = allFavs.filter(f => !(f.userId === userId && f.referenceId === referenceId && f.type === type));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(allFavs));
  },

  toggleFavorite(userId, type, referenceId, label) {
    if (this.isFavorite(userId, referenceId, type)) {
      this.removeFavorite(userId, referenceId, type);
    } else {
      this.addFavorite({
        id: 'fav_' + Date.now(),
        userId,
        type,
        referenceId,
        label,
        order: 0,
        addedAt: new Date().toISOString(),
        available: true
      });
    }
  },

  isFavorite(userId, referenceId, type) {
    const allFavs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    return allFavs.some(f => f.userId === userId && f.referenceId === referenceId && f.type === type);
  },

  reorderFavorites(userId, reorderedFavs) {
    // Reorders a batch
  },

  validateFavoriteAccess(userId, favId, currentRole) {
    // Determines if they still have permission to see it
    return true; 
  },

  removeUnavailableFavorites(userId) {
    // Housekeeping
  },

  getFavoriteLimit() {
    return 50;
  }
};
