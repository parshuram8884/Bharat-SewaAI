import React, { useState } from 'react';
import { FileCheck, ShieldCheck, Upload, Trash2, CheckCircle2, X } from 'lucide-react';

const MOCK_LOCKER_DOCUMENTS = [
  { id: 'doc-aadhaar', name: 'Aadhaar Card', maskedRef: 'XXXX-XXXX-4821', fileName: 'Aadhaar_Card_Masked.pdf' },
  { id: 'doc-bank', name: 'Bank Passbook Copy', maskedRef: 'XXXXXX9021', fileName: 'SBI_Passbook_Copy.pdf' },
  { id: 'doc-income', name: 'Income Certificate', maskedRef: 'INC-2025-9921', fileName: 'Income_Certificate_2025.pdf' },
  { id: 'doc-ration', name: 'Ration Card', maskedRef: 'RAT-8841-MH', fileName: 'Maharashtra_Ration_Card.pdf' },
  { id: 'doc-land', name: '7/12 Land Record Extract', maskedRef: 'LAND-142A-JAL', fileName: 'Land_Extract_712.pdf' }
];

export function LockerDocumentPicker({ isOpen, onClose, onSelectDocument, targetDocName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-primary">Select from Digital Locker</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-low"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-on-surface-variant mb-4">
          Selecting document for: <strong>{targetDocName || 'Required Document'}</strong>
        </p>

        <div className="space-y-2.5 max-h-64 overflow-y-auto mb-6 pr-1">
          {MOCK_LOCKER_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                onSelectDocument({
                  name: doc.name,
                  source: 'Digital Locker',
                  fileName: doc.fileName,
                  maskedReference: doc.maskedRef
                });
                onClose();
              }}
              className="p-3 bg-surface-container-low border border-outline-variant hover:border-primary rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-primary block">{doc.name}</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">{doc.maskedRef}</span>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded">Select</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DocumentRequirementCard({ reqDoc, attachedDoc, onOpenLocker, onRemoveDoc, onSimulateUpload }) {
  const isAttached = Boolean(attachedDoc);

  return (
    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl mb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isAttached ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-900'}`}>
          {isAttached ? <CheckCircle2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-primary">{reqDoc.name}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Required</span>
          </div>
          {isAttached ? (
            <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
              <span>{attachedDoc.fileName || 'Attached Document'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {attachedDoc.source || 'Uploaded'}
              </span>
            </div>
          ) : (
            <p className="text-xs text-amber-800 mt-1">Document not yet attached.</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAttached ? (
          <button
            onClick={() => onRemoveDoc(attachedDoc.id)}
            type="button"
            aria-label={`Remove ${reqDoc.name}`}
            className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1 min-h-[38px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => onOpenLocker(reqDoc)}
              type="button"
              className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container min-h-[38px]"
            >
              From Locker
            </button>
            <button
              onClick={() => onSimulateUpload(reqDoc)}
              type="button"
              className="px-3 py-1.5 border border-outline text-primary rounded-lg text-xs font-bold hover:bg-surface-container-low min-h-[38px]"
            >
              Upload
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function DocumentCompletenessSummary({ totalRequired, attachedCount }) {
  const isComplete = attachedCount >= totalRequired;

  return (
    <div className={`p-4 rounded-2xl border mb-6 flex items-center justify-between gap-3 ${isComplete ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
      <span className="text-xs font-bold">
        {attachedCount} of {totalRequired} required documents attached
      </span>
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isComplete ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
        {isComplete ? 'Ready for Review' : 'Documents Needed'}
      </span>
    </div>
  );
}
