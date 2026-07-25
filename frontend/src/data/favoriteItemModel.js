// favoriteItemModel.js
export const createFavoriteItem = (userId, type, referenceId, label) => ({
  id: 'fav_' + Date.now(),
  userId,
  type, // 'module', 'scheme', 'application', 'document', 'csc', 'report', 'analytics'
  referenceId,
  label,
  order: 0,
  addedAt: new Date().toISOString(),
  available: true
});
