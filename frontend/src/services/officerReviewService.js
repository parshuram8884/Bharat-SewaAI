import { InternalStatus, PublicStatusMap, ValidTransitions } from '../data/officerWorkflowTransitions';
import { permissionService } from './permissionService';
import { officerAuthService } from './officerAuthService';
import { Permissions } from '../data/officerPermissionModel';
import { reviewChecklistConfigs } from '../data/reviewChecklistConfigs';

const APPLICATIONS_KEY = 'bharat_sewa_applications_v1';
const AUDIT_KEY = 'bharat_sewa_audit_v1';
const NOTES_KEY = 'bharat_sewa_internal_notes_v1';
const CHECKLIST_KEY = 'bharat_sewa_checklists_v1';
const DECISION_KEY = 'bharat_sewa_decisions_v1';
const ASSIGNMENT_KEY = 'bharat_sewa_assignments_v1';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

const getStore = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
};
const saveStore = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function createAuditEntry(action, entityType, entityId, departmentId, beforeSummary, afterSummary, reason = '') {
  const user = officerAuthService.getCurrentUser();
  if (!user) return;
  const audit = getStore(AUDIT_KEY);
  audit.unshift({
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action,
    entityType,
    entityId,
    departmentId,
    beforeSummary,
    afterSummary,
    reason,
    source: 'officer-portal',
    visibility: 'internal'
  });
  saveStore(AUDIT_KEY, audit);
}

function addCitizenTimeline(appId, title, status, description, actorType, actorName, relatedRequestId = null) {
  const apps = getStore(APPLICATIONS_KEY);
  const app = apps.find(a => a.id === appId);
  if (app) {
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
      actorName,
      source: 'officer-action',
      relatedRequestId,
      visibility: 'public'
    });
    saveStore(APPLICATIONS_KEY, apps);
  }
}

function transitionStatus(app, newInternalStatus) {
  const validTargets = ValidTransitions[app.internalStatus] || [];
  if (!validTargets.includes(newInternalStatus)) return false;
  
  app.internalStatus = newInternalStatus;
  app.publicStatus = PublicStatusMap[newInternalStatus];
  app.updatedAt = new Date().toISOString();
  return true;
}

export const officerReviewService = {

  // ---- QUEUES & DASHBOARD ----
  
  async getApplicationQueue(filters = {}) {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!user) return { success: false, message: 'Unauthenticated' };
    
    let apps = getStore(APPLICATIONS_KEY);
    
    apps.forEach(app => {
      if (!app.internalStatus) {
        if (app.status === 'submitted') {
          app.internalStatus = InternalStatus.QUEUED;
          app.publicStatus = PublicStatusMap[app.internalStatus];
        } else if (app.status === 'draft') {
          app.internalStatus = 'draft';
        } else {
          app.internalStatus = InternalStatus.QUEUED;
        }
      }
    });

    if (user.departmentId !== 'all') {
      apps = apps.filter(a => a.departmentId === user.departmentId);
    }
    
    apps = apps.filter(a => a.internalStatus && a.internalStatus !== 'draft');

    if (filters.status) apps = apps.filter(a => a.internalStatus === filters.status);
    if (filters.priority) apps = apps.filter(a => a.priority === filters.priority);
    
    if (filters.assignment === 'unassigned') apps = apps.filter(a => !a.assignedOfficerId);
    if (filters.assignment === 'assigned-me') apps = apps.filter(a => a.assignedOfficerId === user.id);
    if (filters.needsAttention) apps = apps.filter(a => a.needsAttention);
    
    if (filters.query) {
      const q = filters.query.toLowerCase();
      apps = apps.filter(a => a.id.toLowerCase().includes(q) || (a.citizenNameMasked || '').toLowerCase().includes(q));
    }

    apps.sort((a,b) => new Date(b.updatedAt || b.submittedAt) - new Date(a.updatedAt || a.submittedAt));

    return { success: true, data: apps };
  },

  async getOfficerDashboard() {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!user) return { success: false, message: 'Unauthenticated' };
    
    const appsResult = await this.getApplicationQueue();
    const apps = appsResult.data || [];
    
    return {
      success: true,
      data: {
        assignedToMe: apps.filter(a => a.assignedOfficerId === user.id).length,
        unassignedQueue: apps.filter(a => !a.assignedOfficerId).length,
        needsAttention: apps.filter(a => a.needsAttention && a.assignedOfficerId === user.id).length,
        decisionsPending: apps.filter(a => a.internalStatus === InternalStatus.RECOMMENDATION_SUBMITTED || a.internalStatus === InternalStatus.DECISION_PENDING).length
      }
    };
  },

  async getOfficerApplication(applicationId) {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!user) return { success: false, message: 'Unauthenticated' };
    
    const apps = getStore(APPLICATIONS_KEY);
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };
    if (!permissionService.canAccessDepartment(user, app.departmentId)) return { success: false, message: 'Department access denied' };
    
    createAuditEntry('application-viewed', 'application', app.id, app.departmentId, null, null);
    
    return { success: true, data: app };
  },

  async assignApplication(applicationId, officerId) {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!user) return { success: false, message: 'Unauthenticated' };
    if (!permissionService.hasPermission(user, Permissions.APPLICATION_ASSIGN)) {
      return { success: false, message: 'Permission denied' };
    }

    const apps = getStore(APPLICATIONS_KEY);
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };
    if (app.assignedOfficerId === officerId) return { success: false, message: 'Already assigned to this officer' };

    const before = app.assignedOfficerId;
    app.assignedOfficerId = officerId;
    app.assignedOfficerName = officerId === user.id ? user.name : 'Officer';
    
    transitionStatus(app, InternalStatus.ASSIGNED);
    
    saveStore(APPLICATIONS_KEY, apps);
    createAuditEntry('application-assigned', 'application', app.id, app.departmentId, `Assigned to: ${before || 'None'}`, `Assigned to: ${officerId}`);

    return { success: true, data: app };
  },

  async getReviewChecklist(applicationId, schemeId) {
    await delay(200);
    const checklists = getStore(CHECKLIST_KEY);
    let cl = checklists.find(c => c.applicationId === applicationId);
    
    if (!cl) {
      const config = reviewChecklistConfigs[schemeId] || reviewChecklistConfigs['default'];
      cl = { applicationId, config: config, completedChecks: {}, notes: {} };
    }
    return { success: true, data: cl };
  },

  async saveReviewChecklist(applicationId, completedChecks, notes) {
    await delay(300);
    const user = officerAuthService.getCurrentUser();
    if (!permissionService.hasPermission(user, Permissions.APPLICATION_REVIEW)) {
      return { success: false, message: 'Permission denied' };
    }

    const checklists = getStore(CHECKLIST_KEY);
    let cl = checklists.find(c => c.applicationId === applicationId);
    
    if (cl) {
      cl.completedChecks = completedChecks;
      cl.notes = notes;
    } else {
      cl = { applicationId, config: reviewChecklistConfigs['default'], completedChecks, notes };
      checklists.push(cl);
    }
    
    saveStore(CHECKLIST_KEY, checklists);
    createAuditEntry('checklist-updated', 'application', applicationId, 'all', null, null);
    
    const apps = getStore(APPLICATIONS_KEY);
    const app = apps.find(a => a.id === applicationId);
    if (app && app.internalStatus === InternalStatus.ASSIGNED) {
      transitionStatus(app, InternalStatus.REVIEW_STARTED);
      saveStore(APPLICATIONS_KEY, apps);
    }

    return { success: true, data: cl };
  },
  
  async getInternalNotes(applicationId) {
    await delay();
    const notes = getStore(NOTES_KEY).filter(n => n.applicationId === applicationId);
    return { success: true, data: notes };
  },
  
  async addInternalNote(applicationId, content, category, visibility) {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!user) return { success: false, message: 'Unauthenticated' };
    if (!permissionService.hasPermission(user, Permissions.APPLICATION_ADD_NOTE)) {
      return { success: false, message: 'Permission denied' };
    }
    
    const notes = getStore(NOTES_KEY);
    const note = {
      id: `note-${Date.now()}`,
      applicationId,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content,
      category,
      visibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.push(note);
    saveStore(NOTES_KEY, notes);
    
    createAuditEntry('note-added', 'application', applicationId, 'all', null, `Category: ${category}`);
    return { success: true, data: note };
  },

  // ---- REQUESTS (Phase 8 Integration) ----

  async createClarificationRequest(applicationId, question, reason, citizenNote) {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!permissionService.hasPermission(user, Permissions.APPLICATION_REQUEST_CLARIFICATION)) {
      return { success: false, message: 'Permission denied' };
    }

    const apps = getStore(APPLICATIONS_KEY);
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    const reqId = `clar-${Date.now()}`;
    app.clarificationRequests = app.clarificationRequests || [];
    app.clarificationRequests.push({
      id: reqId,
      applicationId: app.id,
      question,
      reason,
      deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
      status: 'open',
      requestedAt: new Date().toISOString(),
      responseText: '',
      attachments: []
    });

    if (citizenNote) {
      // Citizen remark added
      app.remarks = app.remarks || [];
      app.remarks.push({
        id: `rmk-${Date.now()}`,
        timestamp: new Date().toISOString(),
        description: citizenNote,
      });
    }

    if (transitionStatus(app, InternalStatus.CLARIFICATION_PENDING)) {
      saveStore(APPLICATIONS_KEY, apps);
      addCitizenTimeline(app.id, 'Clarification Requested', 'clarification-requested', question, 'department', user.name, reqId);
      createAuditEntry('clarification-requested', 'application', app.id, app.departmentId, null, null);
      return { success: true, data: app };
    }
    return { success: false, message: 'Invalid workflow transition' };
  },

  // ---- DECISION & APPROVAL ----

  async saveRecommendation(applicationId, recommendationText) {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!permissionService.hasPermission(user, Permissions.APPLICATION_RECOMMEND)) {
      return { success: false, message: 'Permission denied' };
    }

    const apps = getStore(APPLICATIONS_KEY);
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    if (transitionStatus(app, InternalStatus.RECOMMENDATION_SUBMITTED)) {
      saveStore(APPLICATIONS_KEY, apps);
      createAuditEntry('recommendation-submitted', 'application', app.id, app.departmentId, null, `Recommendation: ${recommendationText}`);
      
      const decisions = getStore(DECISION_KEY);
      decisions.push({
        id: `dec-${Date.now()}`,
        applicationId,
        decisionType: 'recommendation',
        reasonText: recommendationText,
        decidedBy: user.id,
        decidedByRole: user.role,
        decidedAt: new Date().toISOString()
      });
      saveStore(DECISION_KEY, decisions);
      
      return { success: true, data: app };
    }
    return { success: false, message: 'Invalid transition' };
  },

  async approveApplication(applicationId, benefitSummary, citizenMessage, internalNote) {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!permissionService.hasPermission(user, Permissions.APPLICATION_APPROVE)) {
      return { success: false, message: 'Permission denied. Senior authority required.' };
    }

    const apps = getStore(APPLICATIONS_KEY);
    const app = apps.find(a => a.id === applicationId);
    if (!app) return { success: false, message: 'Application not found' };

    if (transitionStatus(app, InternalStatus.APPROVED)) {
      app.status = 'approved'; // Sync phase 8 public state
      saveStore(APPLICATIONS_KEY, apps);
      
      createAuditEntry('application-approved', 'application', app.id, app.departmentId, null, `Benefit: ${benefitSummary}`);
      addCitizenTimeline(app.id, 'Application Approved', 'approved', citizenMessage, 'department', user.name);

      const decisions = getStore(DECISION_KEY);
      decisions.push({
        id: `dec-${Date.now()}`,
        applicationId,
        decisionType: 'approved',
        benefitSummary,
        citizenMessage,
        internalNote,
        decidedBy: user.id,
        decidedByRole: user.role,
        decidedAt: new Date().toISOString(),
        referenceNumber: `BSAI-APRV-${Math.floor(1000 + Math.random() * 9000)}`
      });
      saveStore(DECISION_KEY, decisions);
      
      return { success: true, data: app };
    }
    return { success: false, message: 'Invalid transition. Application cannot be approved from current state.' };
  },
  
  async getApplicationAuditLog(applicationId) {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!user) return { success: false, message: 'Unauthenticated' };
    
    const logs = getStore(AUDIT_KEY).filter(l => l.entityId === applicationId);
    return { success: true, data: logs };
  }
};
