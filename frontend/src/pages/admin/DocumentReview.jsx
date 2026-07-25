import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Check,
  X,
  Filter,
  ShieldCheck,
  Building,
  Download,
  Search
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export function DocumentReview() {
  const { citizens } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  // Extract all documents across citizens to create a unified verification queue
  const [docQueue, setDocQueue] = useState(() => {
    const list = [];
    (citizens || []).forEach((c) => {
      if (c?.documents && Array.isArray(c.documents)) {
        c.documents.forEach((d) => {
          list.push({
            ...d,
            name: d?.name || d?.type || 'Unnamed Certificate',
            uploadedDate: d?.uploadedDate || d?.uploadedAt || 'Recently',
            citizenId: c?.id || 'N/A',
            citizenName: c?.name || 'Unknown Citizen',
            aadhaarMasked: c?.aadhaarMasked || 'XXXX-XXXX-XXXX',
            state: c?.state || 'India'
          });
        });
      }
    });
    return list;
  });

  const filteredQueue = docQueue.filter((doc) => {
    const docName = (doc?.name || doc?.type || '').toLowerCase();
    const cName = (doc?.citizenName || '').toLowerCase();
    const cId = (doc?.citizenId || '').toLowerCase();
    const fType = (filterType || '').toLowerCase();
    const sQuery = (searchQuery || '').toLowerCase();

    const matchType = filterType === 'All' || docName.includes(fType);
    const matchSearch =
      docName.includes(sQuery) ||
      cName.includes(sQuery) ||
      cId.includes(sQuery);
    return matchType && matchSearch;
  });

  const handleApproveDoc = (docId) => {
    setDocQueue((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'Verified' } : d))
    );
    showToast('Document certificate digital signature verified and approved!', 'success');
  };

  const handleFlagDoc = (docId) => {
    setDocQueue((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'Flagged' } : d))
    );
    showToast('Document marked as flagged/discrepancy. Citizen notified for re-upload.', 'error');
  };

  const pendingCount = docQueue.filter((d) => d.status.includes('Pending') || d.status === 'Uploaded').length;
  const verifiedCount = docQueue.filter((d) => d.status === 'Verified').length;
  const flaggedCount = docQueue.filter((d) => d.status === 'Flagged' || d.status === 'Rejected').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">Document Verification Queue</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Audit uploaded KYC certificates, verify DigiLocker digital signatures, and flag discrepancies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => showToast('Running batch AI OCR check on all pending documents...', 'info')}
            className="font-bold flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>AI OCR Batch Verify</span>
          </Button>
        </div>
      </div>

      {/* Mini Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-800">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Awaiting Verification</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{pendingCount}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Verified / Approved</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{verifiedCount}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-error-container text-error">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Flagged Discrepancies</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{flaggedCount}</h4>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto">
          <div className="max-w-xs w-full">
            <Input
              icon={Search}
              placeholder="Search citizen name, ID, document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-lg flex-wrap">
            {['All', 'Income', 'Caste', 'Ration', 'Aadhaar'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  filterType === t ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-semibold text-on-surface-variant">
          Showing <span className="font-bold text-on-surface">{filteredQueue.length}</span> documents
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQueue.map((doc) => {
          const isPending = doc.status.includes('Pending') || doc.status === 'Uploaded';
          return (
            <div
              key={doc.id}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-primary-fixed/50 text-primary group-hover:scale-105 transition-transform shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface leading-tight">{doc.name}</h4>
                      <p className="text-xs font-mono text-on-surface-variant mt-0.5">Hash: {doc.id}</p>
                    </div>
                  </div>
                  <Badge>{doc.status}</Badge>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/40 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Applicant:</span>
                    <Link to={`/citizens/${doc.citizenId}`} className="font-bold text-primary hover:underline">
                      {doc.citizenName}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Citizen ID:</span>
                    <span className="font-mono">{doc.citizenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Uploaded On:</span>
                    <span>{doc.uploadedDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="font-bold text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview & Audit</span>
                </button>

                {isPending ? (
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => handleApproveDoc(doc.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-1.5"
                      title="Verify Signature"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleFlagDoc(doc.id)}
                      className="bg-error hover:bg-error-container text-on-error font-bold p-1.5"
                      title="Flag Discrepancy"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-on-surface-variant">Audit Closed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Preview Modal */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={`Audit Document: ${previewDoc?.name}`}
        maxWidth="max-w-3xl"
      >
        {previewDoc && (
          <div className="space-y-6 text-center py-6 bg-surface-container-low rounded-xl border border-outline-variant/60">
            <Building className="w-16 h-16 text-primary mx-auto opacity-40" />
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="font-heading font-bold text-lg text-on-surface">{previewDoc.name}</h4>
              <p className="text-xs text-on-surface-variant font-mono">DigiLocker Verification Hash: SHA256-{previewDoc.id}</p>
            </div>

            <div className="p-6 bg-surface-container-lowest mx-6 rounded-lg border border-outline-variant text-left font-mono text-xs text-on-surface space-y-2.5 shadow-inner">
              <p className="font-bold text-primary text-sm">=== DIGITAL CERTIFICATE OF ISSUANCE ===</p>
              <p>Certificate Name: {previewDoc.name}</p>
              <p>Beneficiary Citizen: {previewDoc.citizenName} ({previewDoc.citizenId})</p>
              <p>Aadhaar Reference: {previewDoc.aadhaarMasked}</p>
              <p>Issuing Authority: Government Revenue & Civil Services Department, {previewDoc.state}</p>
              <p className="text-emerald-600 font-bold">Digital Signature: VERIFIED BY NIC ROOT CERTIFICATE AUTHORITY</p>
              <p>Timestamp: {previewDoc.uploadedDate}</p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleApproveDoc(previewDoc.id);
                  setPreviewDoc(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>Verify & Approve</span>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  handleFlagDoc(previewDoc.id);
                  setPreviewDoc(null);
                }}
                className="font-bold"
              >
                <X className="w-4 h-4 mr-1.5" />
                <span>Flag Discrepancy</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DocumentReview;
