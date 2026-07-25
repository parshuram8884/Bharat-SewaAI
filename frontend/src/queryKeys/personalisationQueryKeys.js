// personalisationQueryKeys.js
export const personalisationQueryKeys = {
  preferences: (userId) => ['preferences', userId],
  layouts: (userId) => ['layouts', userId],
  favorites: (userId) => ['favorites', userId],
  recentActivity: (userId) => ['recentActivity', userId],
  savedViews: (userId) => ['savedViews', userId],
  recommendations: (userId) => ['recommendations', userId],
  notificationPreferences: (userId) => ['notificationPreferences', userId]
};

// searchQueryKeys.js
export const searchQueryKeys = {
  search: (query, userId) => ['search', query, userId],
  searchHistory: (userId) => ['searchHistory', userId]
};

// helpQueryKeys.js
export const helpQueryKeys = {
  helpArticles: (role) => ['helpArticles', role],
  helpSearch: (query, role) => ['helpSearch', query, role]
};
