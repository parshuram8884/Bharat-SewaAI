// notificationPreferenceModel.js
export const createNotificationPreference = (userId) => ({
  id: 'notif_pref_' + Date.now(),
  userId,
  categories: {
    applications: 'enabled',
    grievances: 'enabled',
    payments: 'important-only',
    documents: 'enabled',
    csc: 'enabled',
    analytics: 'disabled',
    security: 'important-only',
    release: 'important-only',
    pwa: 'enabled',
    drafts: 'enabled'
  },
  updatedAt: new Date().toISOString()
});
