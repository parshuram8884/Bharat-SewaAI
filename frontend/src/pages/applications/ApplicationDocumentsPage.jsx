import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ApplicationStepper, AutosaveStatus } from '../../components/applications/ApplicationHeaderComponents';
import {
  DocumentRequirementCard,
  DocumentCompletenessSummary,
  LockerDocumentPicker
} from '../../components/applications/ApplicationDocumentComponents';
import { ApplicationFormSkeleton } from '../../components/applications/ApplicationReviewComponents';
import { useApplication, useAttachApplicationDocument, useRemoveApplicationDocument } from '../../hooks/useApplicationQuery';
import { MOCK_SCHEMES } from '../../data/mockSchemesData';

export default function ApplicationDocumentsPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useApplication(applicationId);
  const attachDocMutation = useAttachApplicationDocument();
  const removeDocMutation = useRemoveApplicationDocument();

  const [activeLockerReq, setActiveLockerReq] = useState(null);
  const application = data?.data;

  if (isLoading || !application) {
    return (
      <div className="p-6">
        <ApplicationFormSkeleton />
      </div>
    );
  }

  const scheme = MOCK_SCHEMES.find((s) => s.id === application.schemeId) || MOCK_SCHEMES[0];
  const reqDocs = scheme.requiredDocuments || [];
  const attachedDocs = application.uploadedDocuments || [];

  const handleSelectFromLocker = (docMetadata) => {
    if (!activeLockerReq) return;
    attachDocMutation.mutate({
      applicationId,
      docMetadata: {
        requirementId: activeLockerReq.id,
        ...docMetadata
      }
    });
  };

  const handleSimulateUpload = (reqDoc) => {
    const fileName = `${reqDoc.name.replace(/\s+/g, '_')}_Scan.pdf`;
    attachDocMutation.mutate({
      applicationId,
      docMetadata: {
        requirementId: reqDoc.id,
        name: reqDoc.name,
        source: 'User Upload',
        fileName,
        maskedReference: 'FILE-SCAN-2026'
      }
    });
  };

  const handleRemoveDoc = (docId) => {
    removeDocMutation.mutate({ applicationId, documentId: docId });
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-4">
      <header className="max-w-4xl mx-auto flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/applications/${applicationId}/form`)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-primary">Required Documents Checklist</h1>
            <span className="text-[11px] text-on-surface-variant font-mono">App ID: {application.id}</span>
          </div>
        </div>

        <AutosaveStatus status="saved" lastSavedAt={application.updatedAt} />
      </header>

      <main className="max-w-3xl mx-auto">
        <ApplicationStepper currentStep={2} />

        <DocumentCompletenessSummary
          totalRequired={reqDocs.length}
          attachedCount={attachedDocs.length}
        />

        <div className="space-y-3 mb-8">
          {reqDocs.map((reqDoc) => {
            const attached = attachedDocs.find(
              (d) => d.requirementId === reqDoc.id || d.name.toLowerCase().includes(reqDoc.name.toLowerCase())
            );

            return (
              <DocumentRequirementCard
                key={reqDoc.id}
                reqDoc={reqDoc}
                attachedDoc={attached}
                onOpenLocker={(doc) => setActiveLockerReq(doc)}
                onRemoveDoc={handleRemoveDoc}
                onSimulateUpload={handleSimulateUpload}
              />
            );
          })}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface-container-lowest border-t border-outline-variant z-40 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/applications/${applicationId}/form`)}
            type="button"
            className="min-h-[44px] px-4 py-2 border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Previous
          </button>
          <button
            onClick={() => navigate(`/applications/${applicationId}/review`)}
            type="button"
            className="min-h-[48px] px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span>Continue to Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      <LockerDocumentPicker
        isOpen={Boolean(activeLockerReq)}
        onClose={() => setActiveLockerReq(null)}
        onSelectDocument={handleSelectFromLocker}
        targetDocName={activeLockerReq?.name}
      />
    </div>
  );
}
