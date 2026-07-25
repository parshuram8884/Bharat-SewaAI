// recentActivityModel.js
export const createRecentActivity = (userId, activityType, resourceType, resourceId, titleKey, route, module, safeMetadata = {}) => ({
  id: 'rec_' + Date.now(),
  userId,
  activityType,
  resourceType,
  resourceId,
  titleKey,
  route,
  module,
  occurredAt: new Date().toISOString(),
  safeMetadata
});
