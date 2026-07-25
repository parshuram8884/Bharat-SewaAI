import { permissionService } from './permissionService';
import { Permissions } from '../data/officerPermissionModel';
import { DocumentVerificationStatus } from '../data/documentVerificationStatusModel';
import { DocumentLifecycleStatus } from '../data/documentLifecycleStatusModel';
import { getNextVerificationStatus } from '../data/documentWorkflowTransitions';

const STORAGE_KEY = 'bsai_documents';
const VERIFICATION_LOGS_KEY = 'bsai_document_verification_logs';

const getDocs = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const saveDocs = (docs) => localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));

const getLogs = () => JSON.parse(localStorage.getItem(VERIFICATION_LOGS_KEY) || '[]');
const saveLogs = (logs) => localStorage.setItem(VERIFICATION_LOGS_KEY, JSON.stringify(logs));

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const documentVerificationService = {
  getVerificationQueue(user) {
    if (!user || (!permissionService.hasPermission(user, Permissions.DOCUMENT_OFFICER_REVIEW) && !permissionService.hasPermission(user, Permissions.DOCUMENT_AUDIT_VIEW))) {
      return [];
    }
    
    let docs = getDocs();
    
    // Admin / Manager sees all in department
    if (permissionService.hasPermission(user, Permissions.DOCUMENT_AUDIT_VIEW)) {
       docs = docs.filter(d => d.departmentId === user.departmentId);
    } else {
       // Regular officer sees assigned or unassigned verification requested
       docs = docs.filter(d => d.departmentId === user.departmentId && (d.assignedOfficerId === user.id || d.verificationStatus === DocumentVerificationStatus.VERIFICATION_REQUESTED || d.verificationStatus === DocumentVerificationStatus.UNASSIGNED));
    }
    
    return docs;
  },
  
  getVerificationLogs(user, documentId) {
     if (!user) return [];
     const docs = getDocs();
     const doc = docs.find(d => d.id === documentId);
     
     if (!doc) return [];
     if (!permissionService.canViewDocument(user, doc)) return [];
     
     const logs = getLogs().filter(l => l.documentId === documentId);
     
     if (user.role === 'citizen') {
       return logs.map(this.mapVerificationToCitizenView);
     }
     return logs;
  },

  assignDocument(user, documentId) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_ASSIGN)) {
      throw new Error("Unauthorized");
    }
    const docs = getDocs();
    const doc = docs.find(d => d.id === documentId);
    if (!doc || doc.departmentId !== user.departmentId) throw new Error("Document not found");

    doc.assignedOfficerId = user.id;
    doc.verificationStatus = getNextVerificationStatus(doc.verificationStatus, 'assign');
    doc.updatedAt = new Date().toISOString();
    saveDocs(docs);
    
    this._appendLog(doc.id, user.id, 'assigned', 'Officer assigned for verification');
    return doc;
  },

  addInternalNote(user, documentId, note) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_INTERNAL_NOTE)) {
      throw new Error("Unauthorized");
    }
    const docs = getDocs();
    const doc = docs.find(d => d.id === documentId);
    if (!doc || !permissionService.canReviewDocument(user, doc)) throw new Error("Unauthorized or not assigned");
    
    if (!doc.internalNotes) doc.internalNotes = [];
    doc.internalNotes.push({ officerId: user.id, note, createdAt: new Date().toISOString() });
    saveDocs(docs);
    return doc;
  },
  
  submitRecommendation(user, documentId, recommendation, remark) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_OFFICER_REVIEW)) {
      throw new Error("Unauthorized");
    }
    const docs = getDocs();
    const doc = docs.find(d => d.id === documentId);
    if (!doc || !permissionService.canReviewDocument(user, doc)) throw new Error("Unauthorized or not assigned");

    const action = recommendation === 'approve' ? 'recommend-approval' : 'recommend-rejection';
    const newStatus = getNextVerificationStatus(doc.verificationStatus, action);
    
    doc.verificationStatus = newStatus;
    doc.updatedAt = new Date().toISOString();
    saveDocs(docs);
    
    this._appendLog(doc.id, user.id, action, remark);
    return doc;
  },

  approveVerification(user, documentId) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_VERIFICATION_DECISION)) {
      throw new Error("Unauthorized");
    }
    const docs = getDocs();
    const doc = docs.find(d => d.id === documentId);
    if (!doc || !permissionService.canReviewDocument(user, doc)) throw new Error("Unauthorized or not assigned");

    const logs = getLogs().filter(l => l.documentId === documentId);
    const lastRecommendation = logs.reverse().find(l => l.action === 'recommend-approval' || l.action === 'recommend-rejection');
    
    if (!permissionService.canApproveDocumentVerification(user, doc, lastRecommendation)) {
       throw new Error("Maker-checker violation: Cannot approve your own recommendation.");
    }
    
    doc.verificationStatus = DocumentVerificationStatus.APPROVED;
    doc.lifecycleStatus = DocumentLifecycleStatus.OCR_COMPLETE; 
    doc.updatedAt = new Date().toISOString();
    saveDocs(docs);
    
    this._appendLog(doc.id, user.id, 'approve', 'Final verification approved');
    return doc;
  },
  
  _appendLog(documentId, officerId, action, comment) {
    const logs = getLogs();
    logs.push({
      id: generateId('BSAI-VER-LOG'),
      documentId,
      officerId,
      action,
      comment,
      createdAt: new Date().toISOString()
    });
    saveLogs(logs);
  },
  
  mapVerificationToCitizenView(log) {
    return {
      action: log.action,
      comment: log.comment, // some comments may be internal, but we assume citizen safe remarks here
      createdAt: log.createdAt
    };
  }
};


