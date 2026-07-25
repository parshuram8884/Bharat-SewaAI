import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Send,
  Download,
  Eye,
  Check,
  X,
  HelpCircle,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';

export function ApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, approveApplication, rejectApplication, requestApplicationDocs } = useAdminData();
  const { showToast } = useToast();

  const [noteText, setNoteText] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: '' });
  const [docStatuses, setDocStatuses] = useState({
    'Aadhaar Card (Biometric Verified)': 'Valid',
    'Income Certificate (Issued by Tahsildar)': 'Valid',
    'Caste / EWS Certificate': 'Valid',
    'Land Ownership / Ration Card Proof': 'Flagged'
  });
  const [previewDoc, setPreviewDoc] = useState(null);

  const application = applications.find((a) => a.id === id) || applications[0];

  const handleDocToggle = (docName, status) => {
    setDocStatuses((prev) => ({ ...prev, [docName]: status }));
    showToast(`Document marked as ${status}: ${docName}`, status === 'Valid' ? 'success' : 'warning');
  };

  const executeAction = () => {
    if (confirmModal.action === 'approve') {
      approveApplication(application.id, 'Tejas Mail', noteText || 'Verified against DigiLocker records.');
      showToast('Application successfully APPROVED! Citizen notified via SMS & DigiLocker.', 'success');
    } else if (confirmModal.action === 'reject') {
      if (!noteText.trim()) {
        showToast('Please specify a rejection reason in the notes field before rejecting.', 'error');
        setConfirmModal({ isOpen: false, action: '' });
        return;
      }
      rejectApplication(application.id, 'Tejas Mail', noteText);
      showToast('Application REJECTED. Citizen alerted with correction instructions.', 'error');
    } else if (confirmModal.action === 'request') {
      requestApplicationDocs(application.id, 'Tejas Mail', noteText || 'Please re-upload clearer land ownership documents.');
      showToast('Clarification requested from citizen. Status updated to Documents Requested.', 'info');
    }
    setConfirmModal({ isOpen: false, action: '' });
    navigate('/applications');
  };

  const isCompleted = application.status === 'Approved' || application.status === 'Rejected';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Back & Title */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-outline-variant/30 pb-4">
        <button
          onClick={() => navigate('/applications')}
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications List</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant">Reviewing as:</span>
          <span className="text-xs font-bold bg-primary-fixed/30 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Tejas Mail (Super Admin)</span>
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-heading font-extrabold text-on-surface">Application {application.id}</h2>
            <Badge>{application.status}</Badge>
          </div>
          <p className="text-sm font-bold text-primary">{application.schemeName}</p>
          <div className="flex items-center gap-4 text-xs text-on-surface-variant pt-1">
            <span>Submitted: {application.submissionDate}</span>
            <span>•</span>
            <span>Assigned to: {application.assignedReviewer || 'Unassigned'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <Link to={`/citizens/${application.citizenId}`}>
            <Button variant="outline" size="sm" className="font-bold">
              <User className="w-4 h-4 mr-1.5" />
              <span>View Citizen Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Citizen Data Summary & Eligibility */}
        <div className="lg:col-span-7 space-y-6">
          <Card title="Applicant Eligibility Dossier">
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                <div>
                  <p className="text-xs text-on-surface-variant font-semibold uppercase">Applicant Legal Name</p>
                  <p className="font-bold text-on-surface text-base mt-0.5">{application.citizenName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant font-semibold uppercase">Citizen ID</p>
                  <Link to={`/citizens/${application.citizenId}`} className="font-mono font-bold text-primary hover:underline">
                    {application.citizenId}
                  </Link>
                </div>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-outline-variant/40 bg-surface/40">
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant">Annual Family Income</dt>
                  <dd className="font-bold text-emerald-600 mt-0.5">₹ 1,45,000 / annum (Eligible)</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant">Social Category / Caste</dt>
                  <dd className="font-bold text-on-surface mt-0.5">OBC (Verified via DigiLocker)</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant">Residential Jurisdiction</dt>
                  <dd className="font-bold text-on-surface mt-0.5">Lucknow, Uttar Pradesh</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant">Aadhaar KYC Verification</dt>
                  <dd className="font-bold text-primary mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>UIDAI Verified (100% Match)</span>
                  </dd>
                </div>
              </dl>
            </div>
          </Card>

          {/* Timeline & Notes History */}
          <Card title="Review Timeline & Remarks">
            <div className="space-y-4">
              {(application.timeline || []).map((t, idx) => (
                <div key={idx} className="flex gap-3 text-xs border-l-2 border-primary/40 pl-3 py-1">
                  <div>
                    <span className="font-bold text-on-surface block">{t.action || t.event}</span>
                    <span className="text-on-surface-variant">{t.date} {t.author && `• by ${t.author}`}</span>
                  </div>
                </div>
              ))}

              {application.notes && application.notes.length > 0 && (
                <div className="pt-4 border-t border-outline-variant/30 space-y-3">
                  <h5 className="font-bold text-xs text-on-surface-variant uppercase">Reviewer Notes</h5>
                  {application.notes.map((n) => (
                    <div key={n.id} className="p-3 rounded-lg bg-surface-container-low text-xs space-y-1 border border-outline-variant/30">
                      <div className="flex justify-between font-bold text-primary">
                        <span>{n.author}</span>
                        <span className="text-on-surface-variant font-normal">{n.date}</span>
                      </div>
                      <p className="text-on-surface">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Document Checklist & Action Console */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Document Verification Checklist" subtitle="Verify each certificate against state database">
            <div className="space-y-3">
              {Object.entries(docStatuses).map(([docName, status], i) => (
                <div key={i} className="p-3 rounded-xl border border-outline-variant/60 bg-surface-container-low/40 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-on-surface leading-tight">{docName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-outline-variant/30">
                    <button
                      onClick={() => setPreviewDoc(docName)}
                      className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Document</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDocToggle(docName, 'Valid')}
                        className={`p-1 rounded text-xs font-bold flex items-center gap-0.5 cursor-pointer ${
                          status === 'Valid' ? 'bg-emerald-600 text-white' : 'bg-surface-container hover:bg-emerald-100'
                        }`}
                        title="Mark Valid"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDocToggle(docName, 'Flagged')}
                        className={`p-1 rounded text-xs font-bold flex items-center gap-0.5 cursor-pointer ${
                          status === 'Flagged' ? 'bg-amber-600 text-white' : 'bg-surface-container hover:bg-amber-100'
                        }`}
                        title="Flag for Discrepancy"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Decision Box */}
          <Card title="Adjudication Action Console" className="border-primary/40 shadow-lg">
            {isCompleted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-on-surface">Review Closed</h4>
                <p className="text-xs text-on-surface-variant">
                  This application has already been marked as <span className="font-bold text-on-surface">{application.status}</span>.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1.5">
                    Adjudication Note / Rejection Reason
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter verification comments, subsidy calculation notes, or reason for rejection/clarification..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    variant="primary"
                    onClick={() => setConfirmModal({ isOpen: true, action: 'approve' })}
                    className="w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-white justify-center py-3 shadow-md"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-1.5" />
                    <span>Approve Application</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setConfirmModal({ isOpen: true, action: 'request' })}
                    className="w-full font-bold justify-center border-amber-500/60 text-amber-700 hover:bg-amber-50 py-2.5"
                  >
                    <HelpCircle className="w-4 h-4 mr-1.5 text-amber-600" />
                    <span>Request Additional Documents</span>
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => setConfirmModal({ isOpen: true, action: 'reject' })}
                    className="w-full font-bold justify-center py-2.5"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    <span>Reject Application</span>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Document Preview Modal Simulation */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={`Secure Document Preview: ${previewDoc}`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4 text-center py-8 bg-surface-container-low rounded-xl border border-outline-variant/60">
          <Building className="w-16 h-16 text-primary mx-auto opacity-40" />
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="font-heading font-bold text-lg text-on-surface">{previewDoc}</h4>
            <p className="text-xs text-on-surface-variant font-mono">DigiLocker Hash: SHA256-99A82B104E7C6... • UIDAI Verified</p>
          </div>
          <div className="p-6 bg-surface-container-lowest mx-6 rounded-lg border border-outline-variant text-left font-mono text-xs text-on-surface space-y-2">
            <p className="font-bold text-primary">=== GOVERNMENT OF INDIA CERTIFICATE ===</p>
            <p>Holder: {application.citizenName}</p>
            <p>Citizen ID: {application.citizenId}</p>
            <p>Verification Status: Digital Signature Validated by National Informatics Centre (NIC)</p>
            <p>Timestamp: 2023-10-24 14:22:10 IST</p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => showToast('Simulating document download...', 'success')}>
              <Download className="w-4 h-4 mr-1" />
              <span>Download Signed Copy</span>
            </Button>
            <Button variant="primary" size="sm" onClick={() => setPreviewDoc(null)}>
              Close Preview
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: '' })}
        onConfirm={executeAction}
        title={
          confirmModal.action === 'approve'
            ? 'Confirm Approval'
            : confirmModal.action === 'reject'
            ? 'Confirm Rejection'
            : 'Request Clarification'
        }
        message={
          confirmModal.action === 'approve'
            ? `Confirm subsidy award approval for ${application.citizenName}? This will trigger Direct Benefit Transfer (DBT) verification.`
            : confirmModal.action === 'reject'
            ? `Are you sure you want to reject ${application.citizenName}'s application? Please make sure your notes explain the discrepancy clearly.`
            : `Send an official clarification request to ${application.citizenName}? Their application status will change to Documents Requested.`
        }
        confirmText={
          confirmModal.action === 'approve'
            ? 'Approve Award'
            : confirmModal.action === 'reject'
            ? 'Reject Application'
            : 'Send Request'
        }
        variant={confirmModal.action === 'approve' ? 'primary' : confirmModal.action === 'reject' ? 'danger' : 'primary'}
      />
    </div>
  );
}

export default ApplicationReview;
