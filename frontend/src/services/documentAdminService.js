import { permissionService } from './permissionService';
import { Permissions } from '../data/officerPermissionModel';
import { DocumentLifecycleStatus } from '../data/documentLifecycleStatusModel';
import { DocumentVerificationStatus } from '../data/documentVerificationStatusModel';

const STORAGE_KEY = 'bsai_documents';
const getDocs = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

export const documentAdminService = {
  getAnalytics(user) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_ANALYTICS_VIEW)) {
      throw new Error("Unauthorized");
    }
    
    let docs = getDocs();
    if (user.departmentId && !permissionService.hasPermission(user, Permissions.DOCUMENT_AUDIT_VIEW)) {
      docs = docs.filter(d => d.departmentId === user.departmentId);
    }
    
    const totalDocs = docs.length;
    const verified = docs.filter(d => d.verificationStatus === DocumentVerificationStatus.APPROVED).length;
    const pending = docs.filter(d => 
      [DocumentVerificationStatus.UNASSIGNED, DocumentVerificationStatus.ASSIGNED, DocumentVerificationStatus.UNDER_REVIEW].includes(d.verificationStatus)
    ).length;
    const rejected = docs.filter(d => d.verificationStatus === DocumentVerificationStatus.REJECTED).length;
    
    // Basic most uploaded document calculation
    const typeCount = {};
    docs.forEach(d => {
      typeCount[d.documentType] = (typeCount[d.documentType] || 0) + 1;
    });
    
    let mostUploaded = 'None';
    let maxCount = 0;
    for (const [type, count] of Object.entries(typeCount)) {
      if (count > maxCount) {
        maxCount = count;
        mostUploaded = type;
      }
    }
    
    return {
      totalDocuments: totalDocs,
      verifiedDocuments: verified,
      pendingVerifications: pending,
      rejectedVerifications: rejected,
      expiredDocuments: 0,
      renewedDocuments: 0,
      mostUploadedDocument: mostUploaded,
      averageVerificationTime: '2.5 Days' // mock value
    };
  }
};
