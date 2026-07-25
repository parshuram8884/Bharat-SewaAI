import { permissionService } from './permissionService';
import { GrievancePublicStatus } from '../data/grievancePublicStatusModel';
import { GrievanceInternalStatus, GrievanceInternalToPublicMap } from '../data/grievanceInternalStatusModel';

const GRIEVANCES_KEY = 'bharat_sewa_grievances_v1';
const REQUESTS_KEY = 'bharat_sewa_grievance_requests_v1';
const RESOLUTIONS_KEY = 'bharat_sewa_grievance_resolutions_v1';
const AUDIT_KEY = 'bharat_sewa_grievance_audit_v1';

const getStore = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setStore = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Mapping function to hide internal statuses and sensitive fields from citizen view
export const mapGrievanceToCitizenView = (g) => {
  if (!g) return null;
  return {
    ...g,
    internalStatus: undefined,
    assignedOfficerId: undefined, // Hidden from citizen
    assignedOfficerName: g.assignedOfficerName || 'Assigned Officer', // Abstracted
    needsAttention: undefined, // Internal
    escalationLevel: g.escalationLevel === 'level-0' ? undefined : g.escalationLevel, // Only show if escalated
  };
};

export const mapInternalEventToCitizenTimeline = (event) => {
  if (event.visibility === 'internal') return null;
  return event;
};

export const grievanceService = {
  
  getCitizenGrievances(user) {
    if (!user || user.role !== 'citizen') return [];
    const all = getStore(GRIEVANCES_KEY);
    return all.filter(g => g.citizenId === user.id).map(mapGrievanceToCitizenView);
  },

  getGrievance(user, id) {
    const all = getStore(GRIEVANCES_KEY);
    const g = all.find(g => g.id === id);
    if (!g) return null;
    if (!permissionService.canViewGrievance(user, g)) throw new Error('Unauthorized');
    return user.role === 'citizen' ? mapGrievanceToCitizenView(g) : g;
  },

  createGrievanceDraft(user, draftData) {
    if (!user || user.role !== 'citizen') throw new Error('Unauthorized');
    const all = getStore(GRIEVANCES_KEY);
    const id = `BSAI-GRV-${new Date().getFullYear()}-${100000 + all.length + 1}`;
    
    const newGrievance = {
      id,
      acknowledgementNumber: id,
      citizenId: user.id,
      citizenNameMasked: user.name.replace(/^(.)(.*)(.)$/, (m, p1, p2, p3) => `${p1}${'*'.repeat(p2.length)}${p3}`),
      type: draftData.type,
      category: draftData.category,
      title: draftData.title,
      description: draftData.description,
      departmentId: draftData.departmentId || 'general',
      linkedApplicationId: draftData.linkedApplicationId || null,
      priority: 'normal',
      publicStatus: GrievancePublicStatus.DRAFT,
      internalStatus: GrievanceInternalStatus.QUEUED,
      submittedAt: null,
      lastUpdatedAt: new Date().toISOString(),
      assignedOfficerId: null,
      evidenceIds: draftData.evidenceIds || []
    };

    all.push(newGrievance);
    setStore(GRIEVANCES_KEY, all);
    return newGrievance;
  },

  updateGrievanceDraft(user, id, updates) {
    if (!user || user.role !== 'citizen') throw new Error('Unauthorized');
    const all = getStore(GRIEVANCES_KEY);
    const index = all.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Not found');
    if (all[index].citizenId !== user.id) throw new Error('Unauthorized');
    if (all[index].publicStatus !== GrievancePublicStatus.DRAFT) throw new Error('Cannot update submitted grievance');

    all[index] = { ...all[index], ...updates, lastUpdatedAt: new Date().toISOString() };
    setStore(GRIEVANCES_KEY, all);
    return all[index];
  },

  submitGrievance(user, id) {
    if (!user || user.role !== 'citizen') throw new Error('Unauthorized');
    const all = getStore(GRIEVANCES_KEY);
    const index = all.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Not found');
    if (all[index].citizenId !== user.id) throw new Error('Unauthorized');

    all[index].publicStatus = GrievancePublicStatus.SUBMITTED;
    all[index].submittedAt = new Date().toISOString();
    all[index].lastUpdatedAt = new Date().toISOString();
    all[index].slaDueAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Simple default SLA

    setStore(GRIEVANCES_KEY, all);

    // Audit log
    const audit = getStore(AUDIT_KEY);
    audit.push({
      id: `evt-${Date.now()}`,
      grievanceId: id,
      action: 'grievance-submitted',
      actorId: user.id,
      timestamp: new Date().toISOString(),
      visibility: 'public'
    });
    setStore(AUDIT_KEY, audit);

    return all[index];
  },
  
  deleteGrievanceDraft(user, id) {
    if (!user || user.role !== 'citizen') throw new Error('Unauthorized');
    const all = getStore(GRIEVANCES_KEY);
    const index = all.findIndex(g => g.id === id);
    if (index === -1) return;
    if (all[index].citizenId !== user.id) throw new Error('Unauthorized');
    if (all[index].publicStatus !== GrievancePublicStatus.DRAFT) throw new Error('Cannot delete submitted grievance');

    all.splice(index, 1);
    setStore(GRIEVANCES_KEY, all);
  },

  getGrievanceTimeline(user, id) {
    const all = getStore(AUDIT_KEY);
    const events = all.filter(e => e.grievanceId === id);
    if (user.role === 'citizen') {
      return events.filter(e => e.visibility !== 'internal');
    }
    return events;
  },

  getGrievanceRequests(user, id) {
    const all = getStore(REQUESTS_KEY);
    return all.filter(r => r.grievanceId === id);
  },

  saveClarificationDraft(user, requestId, responseText) {
    if (!user || user.role !== 'citizen') throw new Error('Unauthorized');
    const all = getStore(REQUESTS_KEY);
    const index = all.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Not found');
    
    // Ownership check would normally verify the grievance belongs to user
    all[index].responseText = responseText;
    all[index].status = 'draft';
    setStore(REQUESTS_KEY, all);
    return all[index];
  },

  submitClarificationResponse(user, requestId, responseText) {
    if (!user || user.role !== 'citizen') throw new Error('Unauthorized');
    const all = getStore(REQUESTS_KEY);
    const index = all.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Not found');
    
    all[index].responseText = responseText;
    all[index].status = 'submitted';
    all[index].respondedAt = new Date().toISOString();
    setStore(REQUESTS_KEY, all);

    // Update grievance status
    const grievances = getStore(GRIEVANCES_KEY);
    const gIndex = grievances.findIndex(g => g.id === all[index].grievanceId);
    if (gIndex !== -1) {
      grievances[gIndex].publicStatus = GrievancePublicStatus.UNDER_REVIEW;
      grievances[gIndex].internalStatus = GrievanceInternalStatus.EVIDENCE_REVIEW;
      grievances[gIndex].lastUpdatedAt = new Date().toISOString();
      setStore(GRIEVANCES_KEY, grievances);
    }

    return all[index];
  },

  getGrievanceResolution(user, id) {
    const all = getStore(RESOLUTIONS_KEY);
    const resolutions = all.filter(r => r.grievanceId === id);
    // Return the latest active resolution
    return resolutions.length > 0 ? resolutions[resolutions.length - 1] : null;
  },

  respondToResolution(user, id, accepted, citizenResponse) {
    if (!user || user.role !== 'citizen') throw new Error('Unauthorized');
    const allRes = getStore(RESOLUTIONS_KEY);
    const res = allRes.find(r => r.grievanceId === id && r.status === 'pending-citizen-response');
    if (!res) throw new Error('No pending resolution found');

    res.status = accepted ? 'accepted' : 'disputed';
    res.citizenResponse = citizenResponse;
    res.citizenRespondedAt = new Date().toISOString();
    res.locked = accepted;
    setStore(RESOLUTIONS_KEY, allRes);

    const grievances = getStore(GRIEVANCES_KEY);
    const gIndex = grievances.findIndex(g => g.id === id);
    if (gIndex !== -1) {
      grievances[gIndex].publicStatus = accepted ? GrievancePublicStatus.RESOLVED : GrievancePublicStatus.UNDER_REVIEW;
      grievances[gIndex].internalStatus = accepted ? GrievanceInternalStatus.CLOSURE_PENDING : GrievanceInternalStatus.EVIDENCE_REVIEW;
      grievances[gIndex].lastUpdatedAt = new Date().toISOString();
      setStore(GRIEVANCES_KEY, grievances);
    }
  }
};
