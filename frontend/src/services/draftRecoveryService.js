export const draftRecoveryService = {
  saveDraft(module, resourceId, draftData, user) {
    const storeKey = 'bsai_offline_drafts';
    const drafts = JSON.parse(localStorage.getItem(storeKey) || '[]');
    
    const index = drafts.findIndex(d => d.resourceId === resourceId && d.module === module && d.userId === user.id);
    const newDraft = {
      id: `DRAFT-${Date.now()}`,
      userId: user.id,
      module,
      resourceId,
      data: draftData,
      savedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    };
    
    if (index >= 0) {
      drafts[index] = newDraft;
    } else {
      drafts.push(newDraft);
    }
    
    localStorage.setItem(storeKey, JSON.stringify(drafts));
    return newDraft;
  },

  getDraftsForUser(userId) {
    const storeKey = 'bsai_offline_drafts';
    const drafts = JSON.parse(localStorage.getItem(storeKey) || '[]');
    return drafts.filter(d => d.userId === userId && d.status === 'active' && new Date(d.expiresAt) > new Date());
  },

  discardDraft(draftId) {
    const storeKey = 'bsai_offline_drafts';
    const drafts = JSON.parse(localStorage.getItem(storeKey) || '[]');
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      draft.status = 'discarded';
      localStorage.setItem(storeKey, JSON.stringify(drafts));
    }
  }
};
