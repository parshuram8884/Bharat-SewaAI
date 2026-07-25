import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';
import { ExtractionFieldCard, DocumentPrivacyNotice } from '../../components/ocr/DocumentPreviewComponents';
import {
  useDocumentSession,
  useStartExtraction,
  useUpdateExtractedField,
  useConfirmExtraction,
  useSaveToMockLocker
} from '../../hooks/useOcrQuery';

export function DocumentExtractingPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const startMutation = useStartExtraction();
  const [step, setStep] = useState(1);

  useEffect(() => {
    startMutation.mutate(documentId);

    const t1 = setTimeout(() => setStep(2), 400);
    const t2 = setTimeout(() => setStep(3), 800);
    const t3 = setTimeout(() => {
      setStep(4);
      navigate(`/documents/${documentId}/extraction-review`);
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [documentId, navigate]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
      </div>

      <h1 className="text-2xl font-bold text-primary mb-2">Simulated OCR Extraction in Progress...</h1>
      <p className="text-xs text-on-surface-variant max-w-xs mb-8">
        This demonstration uses simulated document extraction. Sensitive identifiers are masked.
      </p>

      <div className="w-full max-w-xs space-y-2 text-xs text-left bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl">
        <div className={`p-2 rounded-lg flex items-center gap-2 ${step >= 1 ? 'font-bold text-primary bg-primary/10' : 'text-on-surface-variant'}`}>
          <span>1. Analysing Image Quality</span>
        </div>
        <div className={`p-2 rounded-lg flex items-center gap-2 ${step >= 2 ? 'font-bold text-primary bg-primary/10' : 'text-on-surface-variant'}`}>
          <span>2. Detecting Text Blocks</span>
        </div>
        <div className={`p-2 rounded-lg flex items-center gap-2 ${step >= 3 ? 'font-bold text-primary bg-primary/10' : 'text-on-surface-variant'}`}>
          <span>3. Identifying Document Fields</span>
        </div>
        <div className={`p-2 rounded-lg flex items-center gap-2 ${step >= 4 ? 'font-bold text-primary bg-primary/10' : 'text-on-surface-variant'}`}>
          <span>4. Preparing Review Screen</span>
        </div>
      </div>
    </div>
  );
}

export function DocumentExtractionReviewPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDocumentSession(documentId);
  const updateFieldMutation = useUpdateExtractedField();

  if (isLoading || !data?.data) {
    return <div className="p-8 text-center text-xs text-on-surface-variant">Loading extraction results...</div>;
  }

  const session = data.data;
  const fields = session.extractedFields || [];

  const handleFieldValueChange = (key, val) => {
    updateFieldMutation.mutate({ documentId, fieldKey: key, value: val });
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6 text-left">
      <main className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(`/documents/${documentId}/preview`)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Extracted Fields Review</span>
        </div>

        <DocumentPrivacyNotice />

        <div className="mb-6">
          <h1 className="text-xl font-bold text-primary mb-1">Review Extracted Information</h1>
          <p className="text-xs text-on-surface-variant mb-6">
            Review and correct any inaccurate values extracted from your document.
          </p>

          <div className="space-y-3">
            {fields.map((fld) => (
              <ExtractionFieldCard
                key={fld.key}
                field={fld}
                onValueChange={handleFieldValueChange}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface-container-lowest border-t border-outline-variant z-40 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/documents/scan/${session.documentType}`)}
            type="button"
            className="min-h-[44px] px-4 py-2 border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Replace Document
          </button>
          <button
            onClick={() => navigate(`/documents/${documentId}/verification`)}
            type="button"
            className="min-h-[48px] px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center gap-2 shadow-md"
          >
            <span>Continue to Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export function DocumentVerificationPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDocumentSession(documentId);
  const confirmMutation = useConfirmExtraction();
  const [confirmed, setConfirmed] = useState(false);

  if (isLoading || !data?.data) {
    return <div className="p-8 text-center text-xs text-on-surface-variant">Loading verification...</div>;
  }

  const session = data.data;

  const handleConfirm = () => {
    confirmMutation.mutate(documentId, {
      onSuccess: () => navigate(`/documents/${documentId}/result`)
    });
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6 text-left">
      <main className="max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(`/documents/${documentId}/extraction-review`)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Citizen Review Confirmation</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm mb-6">
          <h1 className="text-xl font-bold text-primary mb-2">Confirm Citizen Review</h1>
          <p className="text-xs text-on-surface-variant mb-6">
            Please confirm that you have reviewed all extracted details against your original physical or digital document.
          </p>

          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs mb-6 font-medium leading-relaxed">
            Note: This confirmation does not verify the authenticity of the document. Final approval rests with the concerned government department.
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded text-primary mt-0.5"
            />
            <span className="text-xs font-bold text-on-surface leading-relaxed">
              I have reviewed the extracted information and confirm that it matches my document.
            </span>
          </label>

          <button
            onClick={handleConfirm}
            disabled={!confirmed || confirmMutation.isPending}
            type="button"
            className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl disabled:opacity-40 hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
          >
            <span>Confirm Extracted Information</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

export function DocumentProcessingResultPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDocumentSession(documentId);
  const saveLockerMutation = useSaveToMockLocker();

  if (isLoading || !data?.data) {
    return <div className="p-8 text-center text-xs text-on-surface-variant">Loading result...</div>;
  }

  const session = data.data;

  const handleSaveLocker = () => {
    saveLockerMutation.mutate(documentId, {
      onSuccess: () => alert('Document metadata added to Digital Locker with status: User-reviewed extraction.')
    });
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6 text-center">
      <main className="max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">Extraction Complete</span>
        <h1 className="text-2xl font-bold text-primary mb-2">Document Processed</h1>
        <p className="text-xs text-on-surface-variant mb-6">
          Extracted values from <strong>{session.documentTypeName}</strong> are ready to map.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(`/applications/APP-2026-100001/documents/${documentId}/map`)}
            type="button"
            className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container shadow-md"
          >
            Map to Active Scheme Application
          </button>
          <button
            onClick={handleSaveLocker}
            type="button"
            className="w-full min-h-[44px] border border-outline text-primary font-bold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Add to Digital Locker (User-Reviewed)
          </button>
          <button
            onClick={() => navigate('/documents/scan')}
            type="button"
            className="w-full min-h-[44px] text-on-surface-variant font-semibold text-xs hover:underline"
          >
            Scan Another Document
          </button>
        </div>
      </main>
    </div>
  );
}
