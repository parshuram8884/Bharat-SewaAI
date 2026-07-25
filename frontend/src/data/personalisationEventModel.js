// personalisationEventModel.js
export const createPersonalisationEvent = (userId, eventType, module, resourceType, resourceIdMasked, safeMetadata = {}) => ({
  id: 'pevt_' + Date.now(),
  eventType,
  userId,
  module,
  resourceType,
  resourceIdMasked,
  occurredAt: new Date().toISOString(),
  safeMetadata,
  eventKey: eventType + '_' + Date.now()
});
