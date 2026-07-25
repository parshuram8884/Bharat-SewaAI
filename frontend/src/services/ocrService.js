// Mock OCR Service for Phase 7

import { getDocumentTypeConfig } from '../data/documentTypeConfigs';
import { analyzeDocumentQuality } from './documentQualityService';

const OCR_SESSIONS_KEY = 'bharat_sewa_ocr_sessions_v1';
const MOCK_LOCKER_KEY = 'bharat_sewa_saved_schemes_v1'; // or shared locker persistence

function loadSessions() {
  try {
    const raw = localStorage.getItem(OCR_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(OCR_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {}
}

const VALID_TRANSITIONS = {
  created: ['uploaded', 'deleted'],
  uploaded: ['quality-checking', 'deleted'],
  'quality-checking': ['quality-warning', 'quality-failed', 'ready-for-extraction', 'deleted'],
  'quality-warning': ['ready-for-extraction', 'uploaded', 'deleted'],
  'quality-failed': ['uploaded', 'deleted'],
  'ready-for-extraction': ['extracting', 'deleted'],
  extracting: ['extraction-complete', 'extraction-failed', 'deleted'],
  'extraction-complete': ['review-required', 'user-corrected', 'confirmed', 'deleted'],
  'extraction-failed': ['ready-for-extraction', 'uploaded', 'deleted'],
  'review-required': ['user-corrected', 'confirmed', 'deleted'],
  'user-corrected': ['confirmed', 'deleted'],
  confirmed: ['mapped', 'deleted'],
  mapped: ['deleted']
};

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const ocrService = {
  async createDocumentSession(documentType, metadata = {}) {
    await delay();
    const sessions = loadSessions();
    const docId = `DOC-OCR-${Date.now()}`;
    const cfg = getDocumentTypeConfig(documentType);

    const newSession = {
      id: docId,
      documentType,
      documentTypeName: cfg.name,
      status: 'created',
      fileName: metadata.fileName || `${cfg.name.replace(/\s+/g, '_')}_Scan.pdf`,
      fileSizeMb: metadata.fileSizeMb || 2.4,
      source: metadata.source || 'Upload',
      qualityResult: null,
      extractedFields: [],
      userCorrections: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Transition created -> uploaded
    newSession.status = 'uploaded';
    sessions.unshift(newSession);
    saveSessions(sessions);

    return { success: true, data: newSession };
  },

  async getDocumentSession(documentId) {
    await delay();
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === documentId);
    if (!sess) return { success: false, message: 'OCR document session not found.' };
    return { success: true, data: sess };
  },

  async updateDocumentMetadata(documentId, metadata) {
    await delay(150);
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === documentId);
    if (sess) {
      Object.assign(sess, metadata);
      sess.updatedAt = new Date().toISOString();
      saveSessions(sessions);
    }
    return { success: true, data: sess };
  },

  async runQualityCheck(documentId) {
    await delay(400);
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === documentId);
    if (!sess) return { success: false, message: 'Session not found.' };

    sess.status = 'quality-checking';
    const quality = analyzeDocumentQuality(sess);
    sess.qualityResult = quality;

    if (quality.overallStatus === 'poor') {
      sess.status = 'quality-failed';
    } else if (quality.overallStatus === 'warning') {
      sess.status = 'quality-warning';
    } else {
      sess.status = 'ready-for-extraction';
    }

    sess.updatedAt = new Date().toISOString();
    saveSessions(sessions);
    return { success: true, data: sess, quality };
  },

  async startExtraction(documentId) {
    await delay(300);
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === documentId);
    if (!sess) return { success: false, message: 'Session not found.' };

    sess.status = 'extracting';
    sess.updatedAt = new Date().toISOString();
    saveSessions(sessions);

    // Simulate extraction processing delay
    setTimeout(() => {
      const sList = loadSessions();
      const sToFinish = sList.find((s) => s.id === documentId);
      if (sToFinish && sToFinish.status === 'extracting') {
        const cfg = getDocumentTypeConfig(sToFinish.documentType);
        sToFinish.status = 'extraction-complete';
        sToFinish.extractedFields = cfg.extractableFields.map((fld) => {
          const val = cfg.sampleData[fld.key];
          // Give one field lower confidence for review demonstration
          const isLow = fld.key === 'annualIncome' || fld.key === 'landAreaHectares';
          return {
            key: fld.key,
            label: fld.label,
            extractedValue: val,
            correctedValue: val,
            dataType: fld.type,
            confidence: isLow ? 62 : 94,
            confidenceLevel: isLow ? 'medium' : 'high',
            sensitive: fld.sensitive,
            required: fld.required,
            reviewed: false
          };
        });
        sToFinish.updatedAt = new Date().toISOString();
        saveSessions(sList);
      }
    }, 1500);

    return { success: true, data: sess };
  },

  async getExtractionStatus(documentId) {
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === documentId);
    return { success: true, status: sess?.status || 'deleted' };
  },

  async getExtractionResult(documentId) {
    await delay();
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === documentId);
    if (!sess) return { success: false, message: 'Session not found.' };
    return { success: true, data: sess };
  },

  async updateExtractedField(documentId, fieldKey, correctedValue) {
    await delay(150);
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === documentId);
    if (sess) {
      const field = sess.extractedFields.find((f) => f.key === fieldKey);
      if (field) {
        field.correctedValue = correctedValue;
        field.reviewed = true;
        field.confidenceLevel = 'high';
      }
      sess.status = 'user-corrected';
      sess.updatedAt = new Date().toISOString();
      saveSessions(sessions);
    }
    return { success: true, data: sess };
  },

  async confirmExtraction(documentId) {
    await delay(200);
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === documentId);
    if (sess) {
      sess.status = 'confirmed';
      sess.confirmedAt = new Date().toISOString();
      sess.updatedAt = new Date().toISOString();
      saveSessions(sessions);
    }
    return { success: true, data: sess };
  },

  async retryExtraction(documentId) {
    return this.startExtraction(documentId);
  },

  async cancelExtraction(documentId) {
    await delay(100);
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === documentId);
    if (sess) {
      sess.status = 'uploaded';
      saveSessions(sessions);
    }
    return { success: true };
  },

  async deleteDocumentSession(documentId) {
    await delay(100);
    let sessions = loadSessions();
    sessions = sessions.filter((s) => s.id !== documentId);
    saveSessions(sessions);
    return { success: true, deletedId: documentId };
  },

  async mapExtractionToApplication(documentId, applicationId) {
    await delay();
    const sessRes = await this.getDocumentSession(documentId);
    if (!sessRes.success) return sessRes;
    return { success: true, data: sessRes.data };
  },

  async applyAutofillMappings(applicationId, mappings) {
    await delay(300);
    // Safe delegation to applicationService done via custom query hooks
    return { success: true, appliedCount: Object.keys(mappings).length };
  },

  async getDocumentHistory() {
    await delay();
    const sessions = loadSessions();
    return { success: true, data: sessions };
  },

  async saveToMockLocker(documentId) {
    await delay(200);
    const sessRes = await this.getDocumentSession(documentId);
    if (!sessRes.success) return sessRes;

    const sess = sessRes.data;
    try {
      const lockerRaw = localStorage.getItem('bharat_sewa_digital_locker_v1');
      const lockerList = lockerRaw ? JSON.parse(lockerRaw) : [];
      lockerList.unshift({
        id: `locker-${Date.now()}`,
        documentType: sess.documentType,
        name: sess.documentTypeName,
        source: 'User-reviewed extraction',
        fileName: sess.fileName,
        maskedReference: sess.extractedFields.find((f) => f.sensitive)?.correctedValue || 'CONFIRMED-DOC',
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('bharat_sewa_digital_locker_v1', JSON.stringify(lockerList));
    } catch (e) {}

    return { success: true, message: 'Document metadata added to Digital Locker.' };
  }
};
