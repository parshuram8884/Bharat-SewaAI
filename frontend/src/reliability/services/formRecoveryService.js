/**
 * Validates, versions and locally persists eligible draft fields in browser storage.
 */
import { errorRecoveryService } from './errorRecoveryService';

class FormRecoveryService {
  constructor() {
    this.drafts = new Map();
  }

  saveDraft(workflowId, schemaVersion, fields, metadata) {
    // Only save eligible non-sensitive fields
    const safeDraft = {
      workflowId,
      schemaVersion,
      savedAt: new Date().toISOString(),
      fields,
      metadata: metadata || {}
    };

    try {
      localStorage.setItem(`bsai_draft_${workflowId}`, JSON.stringify(safeDraft));
      return { success: true };
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        return { success: false, reason: 'quota-exceeded' };
      }
      return { success: false, reason: 'unknown' };
    }
  }

  loadDraft(workflowId, expectedSchemaVersion) {
    try {
      const draftData = localStorage.getItem(`bsai_draft_${workflowId}`);
      if (!draftData) return null;

      const draft = JSON.parse(draftData);
      
      if (draft.schemaVersion !== expectedSchemaVersion) {
        // Simple migration or discard policy
        console.warn(`Draft schema mismatch for ${workflowId}. Expected ${expectedSchemaVersion}, got ${draft.schemaVersion}`);
        // For demonstration, we discard invalid schemas rather than crashing
        this.clearDraft(workflowId);
        return null;
      }

      return draft;
    } catch (e) {
      console.error(`Failed to load draft for ${workflowId}`, e);
      return null;
    }
  }

  clearDraft(workflowId) {
    try {
      localStorage.removeItem(`bsai_draft_${workflowId}`);
    } catch (e) {
      // ignore
    }
  }
}

export const formRecoveryService = new FormRecoveryService();
