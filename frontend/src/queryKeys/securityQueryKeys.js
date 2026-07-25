export const securityQueryKeys = {
  all: ['security'],
  events: () => [...securityQueryKeys.all, 'events'],
  eventDetails: (id) => [...securityQueryKeys.events(), id],
  sessions: () => [...securityQueryKeys.all, 'sessions'],
  rateLimits: () => [...securityQueryKeys.all, 'rateLimits'],
  offlineDrafts: (userId) => [...securityQueryKeys.all, 'drafts', userId],
  platformHealth: () => [...securityQueryKeys.all, 'platformHealth']
};
