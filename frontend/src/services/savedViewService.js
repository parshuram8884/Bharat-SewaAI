/**
 * savedViewService.js
 * Manages persisted table/dashboard views.
 */
import { STORAGE_KEYS } from './personalisationStorageService';

export const savedViewService = {
  getSavedViews(userId, module) {
    const views = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_VIEWS) || '[]');
    return views.filter(v => v.userId === userId && v.module === module);
  },

  saveView(viewData) {
    const views = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_VIEWS) || '[]');
    const userModuleViews = views.filter(v => v.userId === viewData.userId && v.module === viewData.module);
    
    if (userModuleViews.length >= 20) throw new Error('Saved view limit reached for this module');
    
    // Handle default unsetting
    if (viewData.isDefault) {
      userModuleViews.forEach(v => v.isDefault = false);
    }

    views.push({
      ...viewData,
      id: viewData.id || 'view_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    localStorage.setItem(STORAGE_KEYS.SAVED_VIEWS, JSON.stringify(views));
  }
};
