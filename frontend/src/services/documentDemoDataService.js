import { DocumentLifecycleStatus } from '../data/documentLifecycleStatusModel';
import { DocumentVerificationStatus } from '../data/documentVerificationStatusModel';
import { DocumentSource, DocumentSourceStatus } from '../data/documentSourceModel';
import { DocumentTrustLevel } from '../data/documentTrustLevelModel';
import { DocumentType } from '../data/documentTypeModel';

const SCHEMA_VERSION_KEY = 'bsai_document_schema_version';
const CURRENT_SCHEMA_VERSION = 1;

const getDocs = () => JSON.parse(localStorage.getItem('bsai_documents') || '[]');
const saveDocs = (docs) => localStorage.setItem('bsai_documents', JSON.stringify(docs));

const getVersions = () => JSON.parse(localStorage.getItem('bsai_document_versions') || '[]');
const saveVersions = (versions) => localStorage.setItem('bsai_document_versions', JSON.stringify(versions));

export const documentDemoDataService = {
  initializeDemoData() {
    const version = parseInt(localStorage.getItem(SCHEMA_VERSION_KEY) || '0', 10);

    if (version < CURRENT_SCHEMA_VERSION) {
      this.seedInitialData();
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
    }
  },

  seedInitialData() {
    let docs = getDocs();
    let versions = getVersions();
    
    // Only seed if empty to prevent overwriting user data
    if (docs.length > 0) return;

    const citizenId = 'CITIZEN-001';
    
    // Create 12 scenarios
    const scenarios = [
      { id: 'BSAI-DOC-001', type: DocumentType.INCOME_CERTIFICATE, life: DocumentLifecycleStatus.DRAFT, ver: DocumentVerificationStatus.NOT_REQUESTED, src: DocumentSource.LOCAL_UPLOAD },
      { id: 'BSAI-DOC-002', type: DocumentType.CASTE_CERTIFICATE, life: DocumentLifecycleStatus.OCR_PROCESSING, ver: DocumentVerificationStatus.NOT_REQUESTED, src: DocumentSource.LOCAL_UPLOAD },
      { id: 'BSAI-DOC-003', type: DocumentType.DOMICILE_CERTIFICATE, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.NOT_REQUESTED, src: DocumentSource.LOCAL_UPLOAD },
      { id: 'BSAI-DOC-004', type: DocumentType.BIRTH_CERTIFICATE, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.VERIFICATION_REQUESTED, src: DocumentSource.LOCAL_UPLOAD },
      { id: 'BSAI-DOC-005', type: DocumentType.DISABILITY_CERTIFICATE, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.UNDER_REVIEW, src: DocumentSource.LOCAL_UPLOAD, assignedOfficerId: 'OFFICER-001' },
      { id: 'BSAI-DOC-006', type: DocumentType.LAND_RECORD, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.CLARIFICATION_REQUIRED, src: DocumentSource.LOCAL_UPLOAD },
      { id: 'BSAI-DOC-007', type: DocumentType.BANK_PASSBOOK, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.REPLACEMENT_REQUESTED, src: DocumentSource.LOCAL_UPLOAD },
      { id: 'BSAI-DOC-008', type: DocumentType.EDUCATION_CERTIFICATE, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.APPROVED, src: DocumentSource.LOCAL_UPLOAD, trust: DocumentTrustLevel.OFFICER_VERIFIED },
      { id: 'BSAI-DOC-009', type: DocumentType.AADHAAR, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.APPROVED, src: DocumentSource.MOCK_DIGILOCKER_IMPORT, trust: DocumentTrustLevel.TRUSTED_MOCK_IMPORT, sourceRef: 'mock-digilocker:CITIZEN-001:mock-dl-aadhaar-1' },
      { id: 'BSAI-DOC-010', type: DocumentType.PAN, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.APPROVED, src: DocumentSource.MOCK_DIGILOCKER_IMPORT, trust: DocumentTrustLevel.TRUSTED_MOCK_IMPORT, sourceRef: 'mock-digilocker:CITIZEN-001:mock-dl-pan-1' },
      { id: 'BSAI-DOC-011', type: DocumentType.DRIVING_LICENCE, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.APPROVED, src: DocumentSource.MOCK_DIGILOCKER_IMPORT, trust: DocumentTrustLevel.TRUSTED_MOCK_IMPORT, sourceRef: 'mock-digilocker:CITIZEN-001:mock-dl-driving-1' },
      { id: 'BSAI-DOC-012', type: DocumentType.PASSPORT, life: DocumentLifecycleStatus.OCR_COMPLETE, ver: DocumentVerificationStatus.APPROVED, src: DocumentSource.LOCAL_UPLOAD, trust: DocumentTrustLevel.OFFICER_VERIFIED }
    ];

    scenarios.forEach(sc => {
      const verId = `${sc.id}-VER-1`;
      
      docs.push({
        id: sc.id,
        citizenId,
        departmentId: 'dept-general',
        documentType: sc.type,
        currentVersionId: verId,
        lifecycleStatus: sc.life,
        verificationStatus: sc.ver,
        source: sc.src,
        sourceStatus: sc.src === DocumentSource.LOCAL_UPLOAD ? DocumentSourceStatus.PENDING : DocumentSourceStatus.MOCK_SOURCE_CONFIRMED,
        trustLevel: sc.trust || DocumentTrustLevel.UNTRUSTED,
        sourceReference: sc.sourceRef || null,
        assignedOfficerId: sc.assignedOfficerId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      versions.push({
        id: verId,
        documentId: sc.id,
        versionNumber: 1,
        metadata: {
          name: `Demo ${sc.type}`,
          issueDate: '2023-01-01'
        },
        createdAt: new Date().toISOString()
      });
    });

    saveDocs(docs);
    saveVersions(versions);
    
    // Seed eSign for Document 12
    const sigs = JSON.parse(localStorage.getItem('bsai_document_signatures') || '[]');
    if (sigs.length === 0) {
      sigs.push({
        id: 'BSAI-SIG-001',
        documentId: 'BSAI-DOC-012',
        versionId: 'BSAI-DOC-012-VER-1',
        citizenId,
        signedAt: new Date().toISOString(),
        disclaimer: "Digitally Signed — Demonstration Only. No legal or cryptographic validity",
        issuer: "Mock eSign Provider"
      });
      localStorage.setItem('bsai_document_signatures', JSON.stringify(sigs));
    }
  }
};


