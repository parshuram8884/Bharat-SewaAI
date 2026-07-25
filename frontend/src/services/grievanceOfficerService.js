import { permissionService } from './permissionService';
import { GrievancePublicStatus } from '../data/grievancePublicStatusModel';
import { GrievanceInternalStatus } from '../data/grievanceInternalStatusModel';
import { Roles } from '../data/officerPermissionModel';

const GRIEVANCES_KEY = 'bharat_sewa_grievances_v1';
const REQUESTS_KEY = 'bharat_sewa_grievance_requests_v1';
const RESOLUTIONS_KEY = 'bharat_sewa_grievance_resolutions_v1';
const AUDIT_KEY = 'bharat_sewa_grievance_audit_v1';

const getStore = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setStore = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const grievanceOfficerService = {
  
  getGrievanceQueue(user, filters = {}) {
    if (!user) return [];
    let all = getStore(GRIEVANCES_KEY);
    
    // Dept filtering
    if (!permissionService.canViewGrievance(user, { departmentId: 'dummy' })) {
        all = all.filter(g => permissionService.canAccessDepartment(user, g.departmentId));
    }

    if (filters.status) all = all.filter(g => g.publicStatus === filters.status);
    if (filters.unassigned) all = all.filter(g => !g.assignedOfficerId);
    if (filters.assignedToMe) all = all.filter(g => g.assignedOfficerId === user.id);
    if (filters.needsAttention) all = all.filter(g => g.needsAttention);
    
    return all;
  },

  getOfficerGrievance(user, id) {
    const all = getStore(GRIEVANCES_KEY);
    const g = all.find(g => g.id === id);
    if (!g) return null;
    if (!permissionService.canReviewGrievance(user, g) && !permissionService.canViewGrievance(user, g)) {
       throw new Error('Unauthorized');
    }
    return g;
  },

  assignGrievance(user, grievanceId, targetOfficerId, targetOfficerName) {
    const all = getStore(GRIEVANCES_KEY);
    const index = all.findIndex(g => g.id === grievanceId);
    if (index === -1) throw new Error('Not found');
    
    if (!permissionService.canAssignGrievance(user, all[index])) throw new Error('Unauthorized');
    if (all[index].assignedOfficerId) throw new Error('Grievance is already assigned');

    all[index].assignedOfficerId = targetOfficerId;
    all[index].assignedOfficerName = targetOfficerName;
    all[index].internalStatus = GrievanceInternalStatus.REVIEW_STARTED;
    all[index].publicStatus = GrievancePublicStatus.UNDER_REVIEW;
    all[index].lastUpdatedAt = new Date().toISOString();
    
    setStore(GRIEVANCES_KEY, all);

    // Audit
    const audit = getStore(AUDIT_KEY);
    audit.push({
      id: `evt-${Date.now()}`,
      grievanceId: grievanceId,
      action: 'grievance-assigned',
      actorId: user.id,
      timestamp: new Date().toISOString(),
      visibility: 'internal'
    });
    setStore(AUDIT_KEY, audit);
    
    return all[index];
  },

  proposeResolution(user, grievanceId, resolutionData) {
    const all = getStore(GRIEVANCES_KEY);
    const gIndex = all.findIndex(g => g.id === grievanceId);
    if (gIndex === -1) throw new Error('Not found');
    
    // Maker-checker logic defaults: Officer can propose, but cannot approve their own.
    // However, if the user is a manager, they can approve directly in some workflows, but let's keep propose/approve split.
    
    const resolutions = getStore(RESOLUTIONS_KEY);
    const newRes = {
      id: `res-${Date.now()}`,
      grievanceId,
      resolutionType: resolutionData.resolutionType,
      summary: resolutionData.summary,
      detailedAction: resolutionData.detailedAction,
      citizenMessage: resolutionData.citizenMessage,
      internalNote: resolutionData.internalNote,
      proposedBy: user.id,
      proposedAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null,
      status: 'resolution-approval-pending', // Internal state
      locked: false
    };

    resolutions.push(newRes);
    setStore(RESOLUTIONS_KEY, resolutions);

    all[gIndex].internalStatus = GrievanceInternalStatus.RESOLUTION_APPROVAL_PENDING;
    all[gIndex].lastUpdatedAt = new Date().toISOString();
    setStore(GRIEVANCES_KEY, all);

    return newRes;
  },

  approveResolution(user, grievanceId, resolutionId) {
    const allGrievances = getStore(GRIEVANCES_KEY);
    const gIndex = allGrievances.findIndex(g => g.id === grievanceId);
    if (gIndex === -1) throw new Error('Not found');

    if (!permissionService.canResolveGrievance(user, allGrievances[gIndex])) {
        throw new Error('Unauthorized to approve resolution');
    }

    const resolutions = getStore(RESOLUTIONS_KEY);
    const rIndex = resolutions.findIndex(r => r.id === resolutionId);
    if (rIndex === -1) throw new Error('Not found');

    // Maker-checker: proposer cannot approve their own resolution
    if (resolutions[rIndex].proposedBy === user.id) {
       throw new Error('Cannot approve your own proposed resolution');
    }

    resolutions[rIndex].approvedBy = user.id;
    resolutions[rIndex].approvedAt = new Date().toISOString();
    resolutions[rIndex].status = 'pending-citizen-response'; // Now public
    setStore(RESOLUTIONS_KEY, resolutions);

    allGrievances[gIndex].publicStatus = GrievancePublicStatus.RESOLUTION_PROPOSED;
    allGrievances[gIndex].internalStatus = GrievanceInternalStatus.RESOLUTION_APPROVED;
    allGrievances[gIndex].lastUpdatedAt = new Date().toISOString();
    setStore(GRIEVANCES_KEY, allGrievances);

    // Audit
    const audit = getStore(AUDIT_KEY);
    audit.push({
      id: `evt-${Date.now()}`,
      grievanceId: grievanceId,
      action: 'resolution-approved',
      actorId: user.id,
      timestamp: new Date().toISOString(),
      visibility: 'public'
    });
    setStore(AUDIT_KEY, audit);
  },

  createGrievanceClarificationRequest(user, grievanceId, requestData) {
    const all = getStore(GRIEVANCES_KEY);
    const gIndex = all.findIndex(g => g.id === grievanceId);
    if (gIndex === -1) throw new Error('Not found');
    if (!permissionService.canReviewGrievance(user, all[gIndex])) throw new Error('Unauthorized');

    const requests = getStore(REQUESTS_KEY);
    const newReq = {
      id: `req-${Date.now()}`,
      grievanceId,
      type: 'clarification',
      question: requestData.question,
      reason: requestData.reason,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      requestedAt: new Date().toISOString(),
      responseText: '',
      attachments: []
    };
    requests.push(newReq);
    setStore(REQUESTS_KEY, requests);

    all[gIndex].publicStatus = GrievancePublicStatus.CLARIFICATION_REQUIRED;
    all[gIndex].internalStatus = GrievanceInternalStatus.CITIZEN_RESPONSE_PENDING;
    all[gIndex].lastUpdatedAt = new Date().toISOString();
    setStore(GRIEVANCES_KEY, all);

    return newReq;
  }
};
