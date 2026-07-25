import { permissionService } from './permissionService';
import { Permissions } from '../data/officerPermissionModel';
import { DocumentSource, DocumentSourceStatus } from '../data/documentSourceModel';
import { DocumentTrustLevel } from '../data/documentTrustLevelModel';
import { DocumentLifecycleStatus } from '../data/documentLifecycleStatusModel';
import { DocumentVerificationStatus } from '../data/documentVerificationStatusModel';
import { documentVaultService } from './documentVaultService';

const DL_CONNECTION_KEY = 'bsai_digilocker_connections';

const getConnections = () => JSON.parse(localStorage.getItem(DL_CONNECTION_KEY) || '[]');
const saveConnections = (connections) => localStorage.setItem(DL_CONNECTION_KEY, JSON.stringify(connections));

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const mockDigilockerService = {
  getConnectionState(user) {
    if (!user) return null;
    const conns = getConnections();
    const conn = conns.find(c => c.citizenId === user.id);
    return conn || { state: 'disconnected' };
  },

  connect(user) {
    if (!user || user.role !== 'citizen') throw new Error("Unauthorized");
    const conns = getConnections();
    let conn = conns.find(c => c.citizenId === user.id);
    if (!conn) {
      conn = { citizenId: user.id, state: 'connected', connectedAt: new Date().toISOString() };
      conns.push(conn);
    } else {
      conn.state = 'connected';
    }
    saveConnections(conns);
    return conn;
  },
  
  disconnect(user) {
    if (!user) throw new Error("Unauthorized");
    const conns = getConnections();
    const idx = conns.findIndex(c => c.citizenId === user.id);
    if (idx !== -1) {
      conns[idx].state = 'disconnected';
      saveConnections(conns);
    }
    return { state: 'disconnected' };
  },

  getMockAvailableDocuments(user) {
    // Return predefined fixtures
    if (!user) return [];
    return [
      { id: 'mock-dl-aadhaar-1', type: 'aadhaar', name: 'Aadhaar Card', issueDate: '2023-01-15' },
      { id: 'mock-dl-pan-1', type: 'pan', name: 'PAN Card', issueDate: '2020-05-10' },
      { id: 'mock-dl-driving-1', type: 'driving-licence', name: 'Driving Licence', issueDate: '2019-11-20' }
    ];
  },

  importDocument(user, sourceDocumentId) {
    if (!user || !permissionService.hasPermission(user, Permissions.DOCUMENT_DIGILOCKER_IMPORT)) {
      throw new Error("Unauthorized");
    }
    const available = this.getMockAvailableDocuments(user);
    const sourceDoc = available.find(d => d.id === sourceDocumentId);
    if (!sourceDoc) throw new Error("Document not available for import");

    const vaultDocs = documentVaultService.getCitizenDocuments(user);
    // Duplicate prevention using source ID
    const exists = vaultDocs.find(d => d.sourceReference === `mock-digilocker:${user.id}:${sourceDocumentId}`);
    if (exists) {
      throw new Error("Document already imported from DigiLocker.");
    }

    const docId = generateId('BSAI-DOC');
    const versionId = generateId('BSAI-VER');

    const newDoc = {
      id: docId,
      citizenId: user.id,
      departmentId: 'dept-general',
      documentType: sourceDoc.type,
      currentVersionId: versionId,
      source: DocumentSource.MOCK_DIGILOCKER_IMPORT,
      sourceStatus: DocumentSourceStatus.MOCK_SOURCE_CONFIRMED,
      trustLevel: DocumentTrustLevel.TRUSTED_MOCK_IMPORT,
      lifecycleStatus: DocumentLifecycleStatus.OCR_COMPLETE,
      verificationStatus: DocumentVerificationStatus.APPROVED, // Trusted import is implicitly verified
      sourceReference: `mock-digilocker:${user.id}:${sourceDocumentId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newVersion = {
      id: versionId,
      documentId: docId,
      versionNumber: 1,
      metadata: { name: sourceDoc.name, issueDate: sourceDoc.issueDate, imported: true },
      createdAt: new Date().toISOString()
    };

    // directly modify local storage for now
    const docs = JSON.parse(localStorage.getItem('bsai_documents') || '[]');
    docs.push(newDoc);
    localStorage.setItem('bsai_documents', JSON.stringify(docs));

    const versions = JSON.parse(localStorage.getItem('bsai_document_versions') || '[]');
    versions.push(newVersion);
    localStorage.setItem('bsai_document_versions', JSON.stringify(versions));

    return documentVaultService.mapDocumentToCitizenView(newDoc);
  }
};


