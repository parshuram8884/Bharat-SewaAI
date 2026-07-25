// Scheme Service for Bharat Sewa AI Phase 5

import { MOCK_SCHEMES, MOCK_CITIZEN_PROFILE, MOCK_ELIGIBILITY_QUESTIONS } from '../data/mockSchemesData';
import { evaluateEligibility } from './eligibilityEngine';

const SAVED_SCHEMES_KEY = 'bharat_sewa_saved_schemes_v1';
const RESULTS_CACHE_KEY = 'bharat_sewa_eligibility_results_v1';

function getSavedSchemeIds() {
  try {
    const raw = localStorage.getItem(SAVED_SCHEMES_KEY);
    return raw ? JSON.parse(raw) : ['pm-fasal-bima'];
  } catch (e) {
    return ['pm-fasal-bima'];
  }
}

function setSavedSchemeIds(ids) {
  try {
    localStorage.setItem(SAVED_SCHEMES_KEY, JSON.stringify(ids));
  } catch (e) {}
}

function getStoredResults() {
  try {
    const raw = localStorage.getItem(RESULTS_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveResultRecord(resultId, record) {
  try {
    const map = getStoredResults();
    map[resultId] = record;
    localStorage.setItem(RESULTS_CACHE_KEY, JSON.stringify(map));
  } catch (e) {}
}

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

export const schemeService = {
  async getSchemes({ category = 'All', sort = 'Recommended' } = {}) {
    await delay();
    const savedIds = getSavedSchemeIds();
    let result = MOCK_SCHEMES.map((s) => ({
      ...s,
      isSaved: savedIds.includes(s.id)
    }));

    if (category && category !== 'All') {
      result = result.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    if (sort === 'Highest Match') {
      result.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sort === 'Recently Added') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'Scheme Name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return { success: true, data: result };
  },

  async searchSchemes(query = '') {
    await delay();
    const savedIds = getSavedSchemeIds();
    const q = query.toLowerCase().trim();
    if (!q) return this.getSchemes();

    const matches = MOCK_SCHEMES.filter((s) => {
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.benefitSummary.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }).map((s) => ({
      ...s,
      isSaved: savedIds.includes(s.id)
    }));

    return { success: true, data: matches };
  },

  async getSchemeById(schemeId) {
    await delay();
    const savedIds = getSavedSchemeIds();
    const scheme = MOCK_SCHEMES.find((s) => s.id === schemeId || s.slug === schemeId);
    if (!scheme) {
      return { success: false, message: 'Scheme not found' };
    }
    return {
      success: true,
      data: {
        ...scheme,
        isSaved: savedIds.includes(scheme.id)
      }
    };
  },

  async getRecommendedSchemes(profile = MOCK_CITIZEN_PROFILE) {
    await delay();
    const savedIds = getSavedSchemeIds();
    const recommended = MOCK_SCHEMES.filter((s) => s.matchScore >= 70).map((s) => ({
      ...s,
      isSaved: savedIds.includes(s.id)
    }));
    return {
      success: true,
      profileSummary: {
        occupation: profile.occupation,
        state: profile.state,
        district: profile.district,
        annualIncome: `₹${(profile.annualIncome / 100000).toFixed(1)} Lakh`
      },
      data: recommended
    };
  },

  async getSavedSchemes() {
    await delay();
    const savedIds = getSavedSchemeIds();
    const saved = MOCK_SCHEMES.filter((s) => savedIds.includes(s.id)).map((s) => ({
      ...s,
      isSaved: true
    }));
    return { success: true, data: saved };
  },

  async saveScheme(schemeId) {
    await delay(150);
    const ids = getSavedSchemeIds();
    if (!ids.includes(schemeId)) {
      ids.push(schemeId);
      setSavedSchemeIds(ids);
    }
    return { success: true, savedId: schemeId };
  },

  async unsaveScheme(schemeId) {
    await delay(150);
    let ids = getSavedSchemeIds();
    ids = ids.filter((id) => id !== schemeId);
    setSavedSchemeIds(ids);
    return { success: true, unsavedId: schemeId };
  },

  async getSchemeDocuments(schemeId) {
    await delay();
    const res = await this.getSchemeById(schemeId);
    if (!res.success) return res;
    return { success: true, data: res.data.requiredDocuments || [] };
  },

  async getEligibilityQuestions(schemeId) {
    await delay();
    const questions = MOCK_ELIGIBILITY_QUESTIONS[schemeId] || MOCK_ELIGIBILITY_QUESTIONS['pm-kisan'];
    return { success: true, data: questions };
  },

  async evaluateSchemeEligibility(schemeId, profile = MOCK_CITIZEN_PROFILE, answers = {}) {
    await delay(400);
    const schemeRes = await this.getSchemeById(schemeId);
    if (!schemeRes.success) return schemeRes;

    const evaluation = evaluateEligibility(schemeRes.data, profile, answers);
    const resultId = `result-${schemeId}-${Date.now()}`;
    const record = {
      resultId,
      schemeId,
      schemeName: schemeRes.data.name,
      evaluation,
      createdAt: new Date().toISOString()
    };

    saveResultRecord(resultId, record);
    return { success: true, resultId, data: record };
  },

  async getEligibilityResult(resultId) {
    await delay();
    const map = getStoredResults();
    const record = map[resultId];
    if (!record) {
      return { success: false, message: 'Eligibility result expired or not found' };
    }
    return { success: true, data: record };
  }
};
