import React from 'react';
import { ShieldAlert, Copy, CheckCircle2 } from 'lucide-react';

export function ApplicationStatusBadge({ status = 'draft' }) {
  const STATUS_CONFIG = {
    draft: 'bg-amber-100 text-amber-900 border-amber-300',
    submitting: 'bg-blue-100 text-blue-900 border-blue-300',
    submitted: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    'submission-failed': 'bg-red-100 text-red-900 border-red-300'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${STATUS_CONFIG[status] || STATUS_CONFIG.draft}`}>
      {status.replace('-', ' ')}
    </span>
  );
}

export function ApplicationReviewSection({ title, onEdit, children }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 md:p-6 rounded-2xl mb-4">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-outline-variant/40">
        <h3 className="text-sm font-bold text-primary">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            type="button"
            className="text-xs font-bold text-secondary hover:underline px-2 min-h-[38px] flex items-center"
          >
            Edit
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function ApplicationDeclarationCard({ declaration, onChange }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm max-w-xl mx-auto mb-6">
      <h2 className="text-lg font-bold text-primary mb-3">Declaration & Citizen Consent</h2>

      <div className="p-3.5 bg-surface-container-low rounded-2xl text-xs text-on-surface leading-relaxed mb-4 border border-outline-variant/60">
        "I hereby declare that all details provided in this application are true and correct to the best of my knowledge. I understand that final eligibility and sanction rest with the concerned government department."
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(declaration.confirmed)}
            onChange={(e) => onChange({ ...declaration, confirmed: e.target.checked })}
            className="w-4 h-4 rounded text-primary mt-0.5"
          />
          <span className="text-xs font-bold text-on-surface leading-relaxed">
            I accept the accuracy declaration and authorize verification of attached documents.
          </span>
        </label>

        <div className="space-y-1 text-left">
          <label className="text-xs font-bold text-primary">Typed Applicant Name Confirmation *</label>
          <input
            type="text"
            value={declaration.applicantName || ''}
            onChange={(e) => onChange({ ...declaration, applicantName: e.target.value })}
            placeholder="Type your full legal name"
            className="w-full min-h-[44px] px-3 py-2 bg-surface-container rounded-xl border border-outline-variant text-xs md:text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export function SubmissionConfirmDialog({ isOpen, onClose, onConfirm, schemeName, appId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl max-w-sm w-full shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-primary mb-1">Confirm Application Submission</h3>
        <p className="text-xs text-on-surface-variant mb-4">
          Submit application <strong>{appId}</strong> for <strong>{schemeName}</strong>?
        </p>

        <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-[11px] mb-6 border border-amber-200">
          Note: Submitted applications cannot be edited in this demonstration flow.
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            type="button"
            className="w-full min-h-[44px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container"
          >
            Submit Application
          </button>
          <button
            onClick={onClose}
            type="button"
            className="w-full min-h-[44px] border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Go Back & Review
          </button>
        </div>
      </div>
    </div>
  );
}

export function SubmissionProgress({ step = 1 }) {
  const steps = ['Validating application', 'Preparing documents', 'Recording declaration', 'Generating acknowledgement'];

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl space-y-2 mb-6">
      {steps.map((st, idx) => (
        <div key={idx} className="flex items-center gap-2.5 text-xs text-left">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx + 1 <= step ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
            {idx + 1}
          </div>
          <span className={idx + 1 === step ? 'font-bold text-primary' : 'text-on-surface-variant'}>{st}</span>
        </div>
      ))}
    </div>
  );
}

export function AcknowledgementCard({ ack, application }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(ack.ackNumber);
    alert('Acknowledgement reference copied!');
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-3xl shadow-md max-w-xl mx-auto mb-6 text-left">
      <div className="flex justify-between items-start gap-2 mb-4 pb-4 border-b border-outline-variant">
        <div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Demonstration Reference</span>
          <h2 className="text-xl font-bold text-primary">Bharat Sewa AI Application Receipt</h2>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy acknowledgement number"
          className="p-2 bg-surface-container rounded-lg text-primary hover:bg-surface-container-high"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5 text-xs mb-6">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Acknowledgement No:</span>
          <span className="font-mono font-bold text-primary">{ack.ackNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Application ID:</span>
          <span className="font-mono font-bold text-primary">{application.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Scheme:</span>
          <span className="font-bold text-primary">{application.schemeName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Submission Date:</span>
          <span className="font-semibold text-primary">{new Date(ack.submissionTimestamp).toLocaleString()}</span>
        </div>
      </div>

      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
        <span>{ack.disclaimer}</span>
      </div>
    </div>
  );
}

export function ApplicationTimeline({ submittedAt }) {
  return (
    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl mb-6 text-left">
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Application History</h3>
      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="font-semibold text-on-surface">Application Submitted</span>
          <span className="text-on-surface-variant ml-auto">{submittedAt ? new Date(submittedAt).toLocaleDateString() : 'Today'}</span>
        </div>
      </div>
    </div>
  );
}

export function ApplicationReviewSkeleton() {
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="h-20 bg-surface-container-low rounded-2xl animate-pulse" />
      <div className="h-40 bg-surface-container-low rounded-2xl animate-pulse" />
      <div className="h-40 bg-surface-container-low rounded-2xl animate-pulse" />
    </div>
  );
}

export function ApplicationFormSkeleton() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="h-20 bg-surface-container-low rounded-2xl animate-pulse" />
      <div className="h-64 bg-surface-container-low rounded-2xl animate-pulse" />
    </div>
  );
}

export function ApplicationDetailsSkeleton() {
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="h-40 bg-surface-container-low rounded-3xl animate-pulse" />
      <div className="h-48 bg-surface-container-low rounded-2xl animate-pulse" />
    </div>
  );
}
