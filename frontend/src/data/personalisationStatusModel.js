// personalisationStatusModel.js
export const createPersonalisationStatus = (userId) => ({
  userId,
  isStorageHealthy: true,
  storageUsage: '0.00 KB',
  lastMigrated: new Date().toISOString(),
  corruptedKeysDetected: []
});
