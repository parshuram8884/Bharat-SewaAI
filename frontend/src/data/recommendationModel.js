// recommendationModel.js
export const createRecommendation = (userId, type, titleKey, descriptionKey, route, priority, reasonCode) => ({
  id: 'rec_ai_' + Date.now(),
  userId,
  recommendationType: type, // e.g. 'draft', 'next-action', 'scheme'
  titleKey,
  descriptionKey,
  route,
  priority,
  reasonCode, // 'active-draft', 'pending-clarification', etc.
  generatedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours
  dismissedAt: null
});
