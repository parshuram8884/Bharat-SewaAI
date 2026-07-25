/**
 * frontendRecommendationService.js
 * Smart, deterministic rule-based recommendations. No backend AI involved.
 */
import { continueWorkService } from './continueWorkService';
import { favoritesService } from './favoritesService';

export const frontendRecommendationService = {
  getRecommendations(userId, role) {
    const recommendations = [];

    // Rule 1: Drafts
    const drafts = continueWorkService.getContinueItems(userId, role);
    if (drafts.length > 0) {
      recommendations.push({
        id: 'rec_draft',
        recommendationType: 'draft',
        titleKey: 'Resume Application',
        descriptionKey: 'Recommended because you have an active application draft.',
        route: drafts[0].route,
        priority: 'high',
        reasonCode: 'active-draft'
      });
    }

    // Rule 2: Favorites prompting
    const favs = favoritesService.getFavorites(userId);
    if (favs.length === 0) {
      recommendations.push({
        id: 'rec_fav',
        recommendationType: 'feature-discovery',
        titleKey: 'Pin your favourite modules',
        descriptionKey: 'Recommended because you haven\'t pinned any favourites yet.',
        route: '/preferences',
        priority: 'medium',
        reasonCode: 'new-feature-demo'
      });
    }

    return recommendations;
  },

  dismissRecommendation(userId, recId) {
    // Tracks dismissal in events service to prevent immediate reshowing
  }
};
