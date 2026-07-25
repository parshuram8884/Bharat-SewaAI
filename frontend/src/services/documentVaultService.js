import { permissionService } from './permissionService';
import { Permissions } from '../data/officerPermissionModel';
import { DocumentLifecycleStatus } from '../data/documentLifecycleStatusModel';
import { DocumentVerificationStatus } from '../data/documentVerificationStatusModel';

const STORAGE_KEY = 'bsai_documents';
const VERSIONS_KEY = 'bsai_document_versions';
const SHARE_LINKS_KEY = 'bsai_document_share_links';

const getDocs = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const saveDocs = (docs) => localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));

const getVersions = () => JSON.parse(localStorage.getItem(VERSIONS_KEY) || '[]');
const saveVersions = (versions) => localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));

const getShareLinks = () => JSON.parse(localStorage.getItem(SHARE_LINKS_KEY) || '[]');
const saveShareLinks = (links) => localStorage.setItem(SHARE_LINKS_KEY, JSON.stringify(links));

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const documentVaultService = {
  // Citizen Ops
  getCitizenDocuments(user) {
    if (!user || user.role !== 'citizen') return [];
    return getDocs().filter(d => d.citizenId === user.id)
      .map(this.mapDocumentToCitizenView);
  },

  getDocumentDetails(user, documentId) {
    if (!user) return null;
    const doc = getDocs().find(d => d.id === documentId);
    if (!doc) return null;

    if (!permissionService.canViewDocument(user, doc)) {
      throw new Error("Unauthorized to view this document");
    }

    // Return specific view based on role
    if (user.role === 'citizen') {
      return this.mapDocumentToCitizenView(doc);
    }
    return this.mapDocumentToOfficerView(doc);
  },
  
  getDocumentVersions(user, documentId) {
    if (!user) return [];
    const doc = getDocs().find(d => d.id === documentId);
    if (!doc || !permissionService.canViewDocument(user, doc)) return [];
    
    const versions = getVersions().filter(v => v.documentId === documentId);
    return versions.map(v => user.role === 'citizen' ? this.mapVersionToCitizenView(v) : v);
  },

  uploadDocumentDraft(user, metadata) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_UPLOAD)) {
      throw new Error("Unauthorized");
    }

    const docId = generateId('BSAI-DOC');
    const versionId = generateId('BSAI-VER');
    
    const newDoc = {
      id: docId,
      citizenId: user.id,
      departmentId: metadata.departmentId || 'dept-general',
      documentType: metadata.documentType,
      currentVersionId: versionId,
      lifecycleStatus: DocumentLifecycleStatus.DRAFT,
      verificationStatus: DocumentVerificationStatus.NOT_REQUESTED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newVersion = {
      id: versionId,
      documentId: docId,
      versionNumber: 1,
      metadata: metadata,
      createdAt: new Date().toISOString()
    };

    const docs = getDocs();
    docs.push(newDoc);
    saveDocs(docs);

    const versions = getVersions();
    versions.push(newVersion);
    saveVersions(versions);

    return this.mapDocumentToCitizenView(newDoc);
  },

  submitDocument(user, documentId) {
     if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_UPLOAD)) {
       throw new Error("Unauthorized");
     }
     const docs = getDocs();
     const doc = docs.find(d => d.id === documentId);
     if (!doc || doc.citizenId !== user.id) throw new Error("Document not found");

     doc.lifecycleStatus = DocumentLifecycleStatus.UPLOADED;
     doc.updatedAt = new Date().toISOString();
     saveDocs(docs);
     return this.mapDocumentToCitizenView(doc);
  },
  
  requestVerification(user, documentId) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_VERIFICATION_REQUEST)) {
       throw new Error("Unauthorized");
    }
    
    const docs = getDocs();
    const doc = docs.find(d => d.id === documentId);
    if (!doc || doc.citizenId !== user.id) throw new Error("Document not found");

    doc.verificationStatus = DocumentVerificationStatus.VERIFICATION_REQUESTED;
    doc.updatedAt = new Date().toISOString();
    saveDocs(docs);
    return this.mapDocumentToCitizenView(doc);
  },
  
  createShareLink(user, documentId, options) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_SHARE)) {
      throw new Error("Unauthorized");
    }
    
    const docs = getDocs();
    const doc = docs.find(d => d.id === documentId);
    if (!doc || doc.citizenId !== user.id) throw new Error("Document not found");
    
    const token = generateId('share');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + (options.hours || 24));
    
    const shareLink = {
      token,
      documentId: doc.id,
      versionId: doc.currentVersionId,
      citizenId: user.id,
      scope: options.scope || 'verification-summary',
      expiresAt: expiryDate.toISOString(),
      viewLimit: options.viewLimit || 5,
      viewCount: 0,
      revoked: false,
      createdAt: new Date().toISOString()
    };
    
    const links = getShareLinks();
    links.push(shareLink);
    saveShareLinks(links);
    
    return shareLink;
  },

  getSharedDocument(token) {
    const links = getShareLinks();
    const link = links.find(l => l.token === token);
    
    if (!link) throw new Error("Invalid share link");
    if (link.revoked) throw new Error("This share link has been revoked");
    if (new Date(link.expiresAt) < new Date()) throw new Error("This share link has expired");
    if (link.viewCount >= link.viewLimit) throw new Error("View limit exceeded for this share link");
    
    // Increment view count
    link.viewCount += 1;
    saveShareLinks(links);

    const doc = getDocs().find(d => d.id === link.documentId);
    const version = getVersions().find(v => v.id === link.versionId);
    
    if (!doc || !version) throw new Error("Document not found");
    
    return this.mapDocumentToSharedView(doc, version, link.scope);
  },

  // Mappers
  mapDocumentToCitizenView(doc) {
    if (!doc) return null;
    const { internalNotes, assignedOfficerId, riskFlags, ...citizenSafe } = doc;
    return citizenSafe;
  },
  
  mapVersionToCitizenView(version) {
    if (!version) return null;
    return { ...version };
  },

  mapDocumentToSharedView(doc, version, scope) {
    return {
      documentId: doc.id,
      documentType: doc.documentType,
      lifecycleStatus: doc.lifecycleStatus,
      verificationStatus: doc.verificationStatus,
      metadata: scope === 'metadata-only' || scope === 'verification-summary' ? version.metadata : null,
      scope,
      sharedAt: new Date().toISOString()
    };
  },

  mapDocumentToOfficerView(doc) {
    return { ...doc };
  }
};


