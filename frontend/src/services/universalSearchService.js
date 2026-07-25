/**
 * universalSearchService.js
 * Frontend deterministic search engine.
 */
import { searchIndexService } from './searchIndexService';
import { searchHistoryService } from './searchHistoryService';
import { featureFlags } from '../config/featureFlags';

export const universalSearchService = {
  async search(query, userContext) {
    if (!query || query.length < 2) return [];
    
    // Simulate slight debounce/processing delay
    await new Promise(res => setTimeout(res, 250));

    const index = searchIndexService.getFullIndex();
    const normalizedQuery = query.toLowerCase().trim();
    
    const results = index.filter(item => {
      // 1. Role and Permission Check
      if (item.requiredRoles.length > 0 && !item.requiredRoles.includes(userContext.role)) {
        return false;
      }

      // 2. Feature Flag Check
      if (item.featureFlag && !featureFlags[item.featureFlag]?.enabledByDefault) {
        return false;
      }

      // 3. Text Matching
      return item.searchableText.toLowerCase().includes(normalizedQuery) || 
             item.title.toLowerCase().includes(normalizedQuery);
    });

    // Record History
    searchHistoryService.recordSearch(userContext.userId, query);

    return results.slice(0, 20); // Limit to top 20
  }
};
