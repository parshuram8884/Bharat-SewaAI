import { create } from 'zustand';

const DRAFTS_KEY = 'bharat_sewa_eligibility_drafts_v1';

function loadDraftsMap() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveDraftsMap(map) {
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(map));
  } catch (e) {}
}

export const useSchemeEligibilityUiStore = create((set, get) => ({
  activeSchemeId: null,
  currentQuestionIndex: 0,
  eligibilitySessionId: null,
  lastSavedAt: null,
  isExitDialogOpen: false,
  draftsMap: loadDraftsMap(),

  initSession: (schemeId) => {
    const drafts = get().draftsMap;
    const existing = drafts[schemeId] || { step: 0, answers: {} };
    set({
      activeSchemeId: schemeId,
      currentQuestionIndex: existing.step || 0,
      eligibilitySessionId: `session-${schemeId}-${Date.now()}`,
      lastSavedAt: existing.savedAt || null
    });
  },

  setQuestionIndex: (index) => {
    const schemeId = get().activeSchemeId;
    set({ currentQuestionIndex: index });
    if (schemeId) {
      get().persistCurrentDraft();
    }
  },

  setAnswer: (fieldKey, value) => {
    const schemeId = get().activeSchemeId;
    if (!schemeId) return;

    const drafts = { ...get().draftsMap };
    const schemeDraft = drafts[schemeId] || { step: 0, answers: {} };
    schemeDraft.answers = { ...schemeDraft.answers, [fieldKey]: value };
    schemeDraft.step = get().currentQuestionIndex;
    schemeDraft.savedAt = new Date().toISOString();

    drafts[schemeId] = schemeDraft;
    saveDraftsMap(drafts);
    set({ draftsMap: drafts, lastSavedAt: schemeDraft.savedAt });
  },

  getDraftAnswers: (schemeId) => {
    const sid = schemeId || get().activeSchemeId;
    if (!sid) return {};
    return get().draftsMap[sid]?.answers || {};
  },

  persistCurrentDraft: () => {
    const schemeId = get().activeSchemeId;
    if (!schemeId) return;
    const drafts = { ...get().draftsMap };
    const schemeDraft = drafts[schemeId] || { step: 0, answers: {} };
    schemeDraft.step = get().currentQuestionIndex;
    schemeDraft.savedAt = new Date().toISOString();
    drafts[schemeId] = schemeDraft;
    saveDraftsMap(drafts);
    set({ draftsMap: drafts, lastSavedAt: schemeDraft.savedAt });
  },

  clearSchemeDraft: (schemeId) => {
    const sid = schemeId || get().activeSchemeId;
    if (!sid) return;
    const drafts = { ...get().draftsMap };
    delete drafts[sid];
    saveDraftsMap(drafts);
    set({
      draftsMap: drafts,
      currentQuestionIndex: 0,
      lastSavedAt: null
    });
  },

  setIsExitDialogOpen: (isOpen) => set({ isExitDialogOpen: isOpen })
}));
