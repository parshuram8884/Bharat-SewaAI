// searchHistoryModel.js
export const createSearchHistory = (userId, query, selectedResultType = null) => ({
  id: 'shist_' + Date.now(),
  userId,
  query,
  normalizedQuery: query.toLowerCase().trim(),
  selectedResultType,
  searchedAt: new Date().toISOString()
});
