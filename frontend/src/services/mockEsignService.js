import { permissionService } from './permissionService';
import { Permissions } from '../data/officerPermissionModel';
import { documentVaultService } from './documentVaultService';

const ESIGN_KEY = 'bsai_document_signatures';

const getSignatures = () => JSON.parse(localStorage.getItem(ESIGN_KEY) || '[]');
const saveSignatures = (signatures) => localStorage.setItem(ESIGN_KEY, JSON.stringify(signatures));

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const mockEsignService = {
  applyEsign(user, documentId) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_ESIGN)) {
      throw new Error("Unauthorized");
    }

    const docs = JSON.parse(localStorage.getItem('bsai_documents') || '[]');
    const doc = docs.find(d => d.id === documentId);
    
    if (!doc || doc.citizenId !== user.id) {
      throw new Error("Document not found");
    }
    
    // Prevent multiple signatures on same version
    const sigs = getSignatures();
    const existing = sigs.find(s => s.versionId === doc.currentVersionId);
    if (existing) {
       throw new Error("This document version is already signed.");
    }
    
    const newSignature = {
      id: generateId('BSAI-SIG'),
      documentId: doc.id,
      versionId: doc.currentVersionId,
      citizenId: user.id,
      signedAt: new Date().toISOString(),
      disclaimer: "Digitally Signed — Demonstration Only. No legal or cryptographic validity",
      issuer: "Mock eSign Provider"
    };

    sigs.push(newSignature);
    saveSignatures(sigs);

    return newSignature;
  },
  
  getSignatureForVersion(versionId) {
    const sigs = getSignatures();
    return sigs.find(s => s.versionId === versionId) || null;
  }
};


