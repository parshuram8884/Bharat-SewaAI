import { ApplicationStatusConfig } from '../data/applicationStatusModel';
import { TimelineActorTypes } from '../data/requestModels';
import { notificationService } from './notificationService';

const APPLICATIONS_KEY = 'bharat_sewa_applications_v1';

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

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

export const applicationTrackingService = {
  async getApplications(filters = {}) {
    await delay();
    let apps = loadApplications();
    
    // Convert old statuses if they don't map to new Phase 8 ones
    apps.forEach(app => {
      if (!ApplicationStatusConfig[app.status]) {
        if (app.status === 'documents-pending' || app.status === 'submission-failed') app.status = 'draft';
        if (app.status === 'pending') app.status = 'submitted';
      }
    });

    if (filters.status && filters.status !== 'All') {
      const targetCategory = filters.status; // filters map to category in some contexts, or we filter by category
      apps = apps.filter(app => {
        const conf = ApplicationStatusConfig[app.status];
        if (!conf) return false;
        // The UI might pass status keys or category names.
        if (filters.status === conf.category) return true;
        if (filters.status === app.status) return true;
        return false;
      });
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      apps = apps.filter(app => 
        app.id.toLowerCase().includes(q) || 
        app.schemeName.toLowerCase().includes(q)
      );
    }

    if (filters.sort === 'updated-desc') {
      apps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (filters.sort === 'newest') {
      apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === 'oldest') {
      apps.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return { success: true, data: apps };
  },

  async getApplicationTrackingSummary(applicationId) {
    await delay();
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    return { success: true, data: app };
  },

  async getApplicationTimeline(applicationId) {
    await delay();
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    return { success: true, data: app.timeline || this._generateMockTimeline(app) };
  },

  async getApplicationHistory(applicationId) {
    await delay();
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    return { success: true, data: app.history || [] };
  },

  async getApplicationStatus(applicationId) {
    await delay();
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    return { success: true, data: ApplicationStatusConfig[app.status] };
  },

  async getApplicationRemarks(applicationId) {
    await delay();
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    return { success: true, data: app.remarks || [] };
  },

  async getDocumentRequests(applicationId) {
    await delay();
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    return { success: true, data: app.documentRequests || [] };
  },

  async getClarificationRequests(applicationId) {
    await delay();
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    return { success: true, data: app.clarificationRequests || [] };
  },

  async uploadRequestedDocument(applicationId, requestId, documentMetadata) {
    await delay(300);
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    const req = (app.documentRequests || []).find(r => r.id === requestId);
    if (!req) return { success: false, message: 'Request not found' };
    
    if (req.status === 'submitted' || req.status === 'accepted') {
      return { success: false, message: 'Response already submitted' };
    }

    req.status = 'submitted';
    req.respondedAt = new Date().toISOString();
    req.responseDocumentId = documentMetadata.id || `doc-${Date.now()}`;

    // Update Application Status & History & Timeline
    this._addHistory(app, `Document ${req.title} uploaded in response to request.`);
    this._addTimeline(app, 'Citizen Response', 'documents-requested', `Uploaded document: ${req.title}`, TimelineActorTypes.CITIZEN, req.id);
    
    const valid = this._transitionStatus(app, 'under-review');
    if (valid) {
      notificationService.addNotification(
        'Document Response Received',
        `Your document response for ${app.id} has been submitted successfully.`,
        'success',
        `application:${app.id}:documents-requested:${req.id}`
      );
    }
    
    app.updatedAt = new Date().toISOString();
    saveApplications(apps);

    return { success: true, data: req };
  },

  async attachLockerDocumentToRequest(applicationId, requestId, lockerDocId) {
    // Treat similar to uploadRequestedDocument
    return this.uploadRequestedDocument(applicationId, requestId, { id: lockerDocId, source: 'Digital Locker' });
  },

  async saveClarificationDraft(applicationId, requestId, responseText, attachments = []) {
    await delay(100);
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    const req = (app.clarificationRequests || []).find(r => r.id === requestId);
    if (!req) return { success: false, message: 'Request not found' };

    req.status = 'draft';
    req.responseText = responseText;
    req.attachments = attachments;
    
    app.updatedAt = new Date().toISOString();
    saveApplications(apps);

    return { success: true, data: req };
  },

  async submitClarification(applicationId, requestId, responseText, attachments = []) {
    await delay(300);
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    const req = (app.clarificationRequests || []).find(r => r.id === requestId);
    if (!req) return { success: false, message: 'Request not found' };

    if (req.status === 'submitted' || req.status === 'reviewed') {
      return { success: false, message: 'Clarification already submitted' };
    }

    req.status = 'submitted';
    req.responseText = responseText;
    req.attachments = attachments;
    req.respondedAt = new Date().toISOString();

    // Update Application Status & History & Timeline
    this._addHistory(app, `Clarification response submitted for request: ${req.question}`);
    this._addTimeline(app, 'Clarification Submitted', 'clarification-requested', `Response sent to department.`, TimelineActorTypes.CITIZEN, req.id);
    
    const valid = this._transitionStatus(app, 'under-review');
    if (valid) {
      notificationService.addNotification(
        'Clarification Submitted',
        `Your clarification for ${app.id} has been submitted successfully.`,
        'success',
        `application:${app.id}:clarification-requested:${req.id}`
      );
    }
    
    app.updatedAt = new Date().toISOString();
    saveApplications(apps);

    return { success: true, data: req };
  },

  async withdrawApplication(applicationId, reason) {
    await delay(300);
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    if (!this.canWithdrawApplication(app)) {
      return { success: false, message: 'Application cannot be withdrawn in its current state.' };
    }

    app.withdrawalReason = reason;
    this._addHistory(app, `Application withdrawn by citizen. Reason: ${reason}`);
    this._addTimeline(app, 'Application Withdrawn', 'withdrawn', `Application was withdrawn.`, TimelineActorTypes.CITIZEN, null);
    
    const valid = this._transitionStatus(app, 'withdrawn');
    if (valid) {
      notificationService.addNotification(
        'Application Withdrawn',
        `Your application ${app.id} has been withdrawn successfully.`,
        'info',
        `application:${app.id}:withdrawn`
      );
    }
    
    app.updatedAt = new Date().toISOString();
    saveApplications(apps);

    return { success: true, data: app };
  },

  canWithdrawApplication(app) {
    const conf = ApplicationStatusConfig[app.status];
    if (conf && conf.isTerminal) return false;
    if (app.status === 'approved' || app.status === 'rejected' || app.status === 'closed') return false;
    return true;
  },

  async transitionApplicationStatus(applicationId, newStatus) {
    await delay();
    const apps = loadApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    const success = this._transitionStatus(app, newStatus);
    if (success) {
      saveApplications(apps);
      return { success: true, data: app };
    }
    return { success: false, message: 'Invalid transition' };
  },

  _transitionStatus(app, newStatus) {
    // Add logic to block invalid transitions.
    // Terminal states cannot be changed.
    const currentConf = ApplicationStatusConfig[app.status];
    const newConf = ApplicationStatusConfig[newStatus];

    if (!newConf) return false;
    if (currentConf && currentConf.isTerminal) return false;

    app.status = newStatus;
    app.updatedAt = new Date().toISOString();
    return true;
  },

  _addTimeline(app, title, status, description, actorType, relatedRequestId = null) {
    app.timeline = app.timeline || [];
    app.timeline.unshift({
      id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      applicationId: app.id,
      eventType: title,
      status,
      title,
      description,
      timestamp: new Date().toISOString(),
      actorType,
      actorName: actorType === TimelineActorTypes.CITIZEN ? 'Citizen' : 'System',
      source: 'tracking-service',
      relatedRequestId,
      visibility: 'public'
    });
  },

  _addHistory(app, description) {
    app.history = app.history || [];
    app.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      description,
    });
  },

  _generateMockTimeline(app) {
    const tl = [];
    tl.push({
      id: 'tl-1',
      applicationId: app.id,
      eventType: 'Draft Saved',
      status: 'draft',
      title: 'Draft Saved',
      description: 'Application was saved as a draft.',
      timestamp: app.createdAt,
      actorType: TimelineActorTypes.CITIZEN,
      actorName: 'Citizen',
      source: 'tracking-service',
      relatedRequestId: null,
      visibility: 'public'
    });

    if (app.submittedAt) {
      tl.unshift({
        id: 'tl-2',
        applicationId: app.id,
        eventType: 'Application Submitted',
        status: 'submitted',
        title: 'Application Submitted',
        description: 'Application successfully submitted to system.',
        timestamp: app.submittedAt,
        actorType: TimelineActorTypes.CITIZEN,
        actorName: 'Citizen',
        source: 'tracking-service',
        relatedRequestId: null,
        visibility: 'public'
      });
    }

    // Mock document request if status requires it
    if (app.status === 'documents-requested' && (!app.documentRequests || app.documentRequests.length === 0)) {
      app.documentRequests = [{
        id: 'req-mock-1',
        applicationId: app.id,
        title: 'Income Certificate Needed',
        description: 'Please upload a valid Income Certificate from the current financial year.',
        reason: 'Missing current year certificate',
        documentType: 'income-certificate',
        required: true,
        deadline: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        status: 'open',
        requestedAt: new Date().toISOString(),
        officerName: 'Verification Officer',
        officerRole: 'Dept of Agriculture'
      }];
    }

    // Mock clarification request
    if (app.status === 'clarification-requested' && (!app.clarificationRequests || app.clarificationRequests.length === 0)) {
      app.clarificationRequests = [{
        id: 'clar-mock-1',
        applicationId: app.id,
        question: 'Is the farming land irrigated or non-irrigated?',
        reason: 'Information missing from submitted form',
        deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
        status: 'open',
        requestedAt: new Date().toISOString(),
        responseText: '',
        attachments: []
      }];
    }
    
    return tl;
  },

  async getApplicationDownloads(applicationId) {
    await delay();
    return {
      success: true,
      data: {
        summary: true,
        receipt: true,
        timeline: true
      }
    };
  }
};
