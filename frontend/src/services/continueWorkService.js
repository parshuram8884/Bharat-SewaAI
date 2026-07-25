/**
 * continueWorkService.js
 * Synthesizes active drafts into "Continue where you left off" objects.
 */
import { documentVaultService } from './documentVaultService';
import { applicationTrackingService } from './applicationTrackingService';

export const continueWorkService = {
  getContinueItems(userId, role) {
    const items = [];
    
    if (role === 'citizen') {
      // Mock search drafts
      const draftApp = localStorage.getItem('draft_application_form');
      if (draftApp) {
        items.push({
          id: 'cw_app_draft',
          titleKey: 'Incomplete Application',
          route: '/schemes/apply',
          type: 'draft'
        });
      }
    } else if (role === 'officer') {
      // Officer might have a pending review draft
    }

    return items;
  },

  getRecommendedResumeRoute(userId, role) {
    const items = this.getContinueItems(userId, role);
    return items.length > 0 ? items[0].route : null;
  }
};
