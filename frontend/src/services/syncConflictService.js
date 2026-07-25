export const syncConflictService = {
  detectConflict(draft, serverRecord) {
    // If the server record was updated after the draft was created or based off an old version
    if (!serverRecord) return null;
    
    if (new Date(serverRecord.updatedAt) > new Date(draft.savedAt)) {
      return {
        id: `CONF-${Date.now()}`,
        type: 'version_mismatch',
        resourceId: draft.resourceId,
        module: draft.module,
        localVersion: draft.savedAt,
        serverVersion: serverRecord.updatedAt,
        details: 'The record was modified on the server while you were offline.',
        resolved: false
      };
    }
    
    return null;
  }
};
