// Application Service for Bharat Sewa AI Phase 6 & Phase 7

import { MOCK_SCHEMES, MOCK_CITIZEN_PROFILE } from '../data/mockSchemesData';
import { validateApplication as performValidation } from './applicationValidation';
import { SCHEME_FORM_SCHEMAS } from '../data/applicationFormSchemas';

const APPLICATIONS_KEY = 'bharat_sewa_applications_v1';
const NOTIFICATIONS_KEY = 'bharat_sewa_notifications_v1';

function loadApplications() {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveApplications(apps) {
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  } catch (e) {}
}

function addMockNotification(title, message, type = 'info') {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
  } catch (e) {}
}

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

export const applicationService = {
  async getApplications(filters = {}) {
    await delay();
    let apps = loadApplications();
    if (filters.status) {
      apps = apps.filter((a) => a.status === filters.status);
    }
    return { success: true, data: apps };
  },

  async getDraftApplicationByScheme(schemeId) {
    await delay();
    const apps = loadApplications();
    const draft = apps.find(
      (a) => a.schemeId === schemeId && (a.status === 'draft' || a.status === 'documents-pending' || a.status === 'submission-failed')
    );
    return { success: true, data: draft || null };
  },

  async createApplicationDraft(schemeId, eligibilityResultId = null) {
    await delay();
    const apps = loadApplications();
    const existingDraft = apps.find(
      (a) => a.schemeId === schemeId && (a.status === 'draft' || a.status === 'documents-pending')
    );

    if (existingDraft) {
      return { success: true, data: existingDraft, isExisting: true };
    }

    const scheme = MOCK_SCHEMES.find((s) => s.id === schemeId) || MOCK_SCHEMES[0];
    const appId = `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newApp = {
      id: appId,
      schemeId,
      schemeName: scheme.name,
      citizenId: 'citizen-1',
      status: 'draft',
      currentStep: 1,
      completedSteps: [0],
      profileSnapshot: { ...MOCK_CITIZEN_PROFILE },
      eligibilityResultId,
      formData: {
        category: 'small',
        landArea: MOCK_CITIZEN_PROFILE.landholdingHectares,
        surveyNumber: '142/A',
        isSingleOwner: true,
        bankName: 'State Bank of India',
        accountNumber: 'XXXXXX9021',
        ifscCode: 'SBIN0001234',
        dbtConsent: true
      },
      uploadedDocuments: [
        {
          id: 'doc-aadhaar-1',
          requirementId: 'doc-aadhaar',
          name: 'Aadhaar Card',
          source: 'Digital Locker',
          fileName: 'Aadhaar_Card_Masked.pdf',
          status: 'verified',
          uploadedAt: new Date().toISOString()
        },
        {
          id: 'doc-bank-1',
          requirementId: 'doc-bank',
          name: 'Bank Passbook',
          source: 'Digital Locker',
          fileName: 'SBI_Passbook_Copy.pdf',
          status: 'verified',
          uploadedAt: new Date().toISOString()
        }
      ],
      declaration: {
        confirmed: false,
        applicantName: '',
        date: ''
      },
      submissionAttempts: 0,
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    apps.unshift(newApp);
    saveApplications(apps);
    addMockNotification('Draft Created', `Application draft for ${scheme.name} created.`, 'info');

    return { success: true, data: newApp, isExisting: false };
  },

  async getApplication(applicationId) {
    await delay();
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) {
      return { success: false, message: 'Application not found.' };
    }
    return { success: true, data: app };
  },

  async updateApplicationProfile(applicationId, profileData) {
    await delay(150);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      app.profileSnapshot = { ...app.profileSnapshot, ...profileData };
      app.updatedAt = new Date().toISOString();
      saveApplications(apps);
    }
    return { success: true, data: app };
  },

  async updateApplicationForm(applicationId, formData) {
    await delay(150);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      app.formData = { ...app.formData, ...formData };
      app.updatedAt = new Date().toISOString();
      saveApplications(apps);
    }
    return { success: true, data: app };
  },

  async saveApplicationSection(applicationId, sectionId, data) {
    await delay(150);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      app.formData = { ...app.formData, ...data };
      app.updatedAt = new Date().toISOString();
      saveApplications(apps);
    }
    return { success: true, data: app };
  },

  async getApplicationRequirements(applicationId) {
    await delay();
    const appRes = await this.getApplication(applicationId);
    if (!appRes.success) return appRes;
    const scheme = MOCK_SCHEMES.find((s) => s.id === appRes.data.schemeId) || MOCK_SCHEMES[0];
    return { success: true, data: scheme.requiredDocuments };
  },

  async attachDocument(applicationId, docMetadata) {
    await delay(200);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      app.uploadedDocuments = app.uploadedDocuments.filter((d) => d.requirementId !== docMetadata.requirementId);
      app.uploadedDocuments.push({
        id: `doc-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
        status: 'attached',
        ...docMetadata
      });
      app.updatedAt = new Date().toISOString();
      saveApplications(apps);
    }
    return { success: true, data: app };
  },

  async removeDocument(applicationId, documentId) {
    await delay(150);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      app.uploadedDocuments = app.uploadedDocuments.filter((d) => d.id !== documentId);
      app.updatedAt = new Date().toISOString();
      saveApplications(apps);
    }
    return { success: true, data: app };
  },

  async validateApplication(applicationId) {
    await delay();
    const appRes = await this.getApplication(applicationId);
    if (!appRes.success) return appRes;
    const validation = performValidation(appRes.data);
    return { success: true, data: validation };
  },

  async saveDeclaration(applicationId, declaration) {
    await delay(150);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      app.declaration = declaration;
      app.updatedAt = new Date().toISOString();
      saveApplications(apps);
    }
    return { success: true, data: app };
  },

  async submitApplication(applicationId) {
    await delay(1200);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) {
      return { success: false, message: 'Application not found.' };
    }

    app.submissionAttempts += 1;
    app.status = 'submitted';
    app.submittedAt = new Date().toISOString();
    app.updatedAt = new Date().toISOString();
    app.acknowledgement = {
      ackNumber: `BSAI-APP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      submissionTimestamp: app.submittedAt,
      disclaimer: 'This is a demonstration acknowledgement generated by Bharat Sewa AI. Official submission and acknowledgement will require integration with the concerned government service portal.'
    };

    saveApplications(apps);
    addMockNotification('Application Submitted', `Application ${app.id} for ${app.schemeName} submitted successfully.`, 'success');

    return { success: true, data: app };
  },

  async retryApplicationSubmission(applicationId) {
    return this.submitApplication(applicationId);
  },

  async withdrawApplication(applicationId) {
    await delay(150);
    let apps = loadApplications();
    apps = apps.filter((a) => a.id !== applicationId);
    saveApplications(apps);
    return { success: true, withdrawnId: applicationId };
  },

  async getApplicationAcknowledgement(applicationId) {
    await delay();
    const appRes = await this.getApplication(applicationId);
    if (!appRes.success) return appRes;
    return {
      success: true,
      data: {
        application: appRes.data,
        acknowledgement: appRes.data.acknowledgement
      }
    };
  },

  // Phase 7 OCR Application Helper Methods
  async getApplicationFieldSchema(applicationId) {
    await delay();
    const appRes = await this.getApplication(applicationId);
    if (!appRes.success) return appRes;
    const schema = SCHEME_FORM_SCHEMAS[appRes.data.schemeId] || SCHEME_FORM_SCHEMAS['pm-kisan'];
    return { success: true, data: schema };
  },

  async applyDocumentAutofill(applicationId, selectedMappings) {
    await delay(250);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found.' };

    const updatedFormData = { ...app.formData };
    Object.keys(selectedMappings).forEach((targetId) => {
      updatedFormData[targetId] = selectedMappings[targetId];
    });

    app.formData = updatedFormData;
    app.updatedAt = new Date().toISOString();
    saveApplications(apps);

    addMockNotification('Autofill Applied', `Document data applied to application ${app.id}.`, 'info');
    return { success: true, data: app };
  },

  async addApplicationDocumentResult(applicationId, documentResult) {
    await delay(150);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      app.uploadedDocuments = app.uploadedDocuments || [];
      app.uploadedDocuments.push(documentResult);
      app.updatedAt = new Date().toISOString();
      saveApplications(apps);
    }
    return { success: true, data: app };
  },

  async removeApplicationDocumentResult(applicationId, documentId) {
    return this.removeDocument(applicationId, documentId);
  },

  async addApplicationActivity(applicationId, activity) {
    await delay(100);
    const apps = loadApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      app.activities = app.activities || [];
      app.activities.unshift({
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...activity
      });
      saveApplications(apps);
    }
    return { success: true };
  }
};
