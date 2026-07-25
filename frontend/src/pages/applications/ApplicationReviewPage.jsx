import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { ApplicationStepper } from '../../components/applications/ApplicationHeaderComponents';
import { ApplicationReviewSection, ApplicationReviewSkeleton } from '../../components/applications/ApplicationReviewComponents';
import { useApplication, useValidateApplication } from '../../hooks/useApplicationQuery';

export default function ApplicationReviewPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useApplication(applicationId);
  const { data: valRes } = useValidateApplication(applicationId);

  const application = data?.data;
  const validation = valRes?.data;

  if (isLoading || !application) {
    return (
      <div className="p-6">
        <ApplicationReviewSkeleton />
      </div>
    );
  }

  const formData = application.formData || {};
  const attachedDocs = application.uploadedDocuments || [];
  const canContinue = validation ? validation.missingFields.length === 0 && validation.missingDocuments.length === 0 : true;

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-4">
      <header className="max-w-4xl mx-auto flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/applications/${applicationId}/documents`)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-primary">Review Application Details</h1>
            <span className="text-[11px] text-on-surface-variant font-mono">App ID: {application.id}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <ApplicationStepper currentStep={3} />

        {/* Validation Errors Warning */}
        {validation && !canContinue && (
          <div className="p-4 bg-red-50 border border-red-300 text-red-900 rounded-2xl mb-6 text-xs text-left">
            <h3 className="font-bold text-sm mb-1">Please complete missing information:</h3>
            <ul className="list-disc list-inside space-y-1">
              {validation.missingFields.map((f, i) => (
                <li key={i}>Missing field: {f}</li>
              ))}
              {validation.missingDocuments.map((d, i) => (
                <li key={i}>Missing document: {d}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 1: Profile */}
        <ApplicationReviewSection title="Applicant Profile" onEdit={() => navigate(`/applications/${applicationId}/form`)}>
          <div className="grid grid-cols-2 gap-2 text-xs text-left">
            <div>
              <span className="text-on-surface-variant block text-[10px]">Name</span>
              <span className="font-bold text-primary">{application.profileSnapshot?.name}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px]">State</span>
              <span className="font-bold text-primary">{application.profileSnapshot?.state}</span>
            </div>
          </div>
        </ApplicationReviewSection>

        {/* Section 2: Scheme Form Answers */}
        <ApplicationReviewSection title="Application Answers" onEdit={() => navigate(`/applications/${applicationId}/form`)}>
          <div className="grid grid-cols-2 gap-3 text-xs text-left">
            <div>
              <span className="text-on-surface-variant block text-[10px]">Farmer Category</span>
              <span className="font-bold text-primary uppercase">{formData.category || 'N/A'}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px]">Land Area</span>
              <span className="font-bold text-primary">{formData.landArea} Hectares</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px]">Bank Name</span>
              <span className="font-bold text-primary">{formData.bankName}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px]">Account Number</span>
              <span className="font-mono font-bold text-primary">{formData.accountNumber}</span>
            </div>
          </div>
        </ApplicationReviewSection>

        {/* Section 3: Documents */}
        <ApplicationReviewSection title="Attached Documents" onEdit={() => navigate(`/applications/${applicationId}/documents`)}>
          <div className="space-y-2 text-xs text-left">
            {attachedDocs.map((d) => (
              <div key={d.id} className="flex justify-between items-center p-2 bg-surface-container-low rounded-lg">
                <span className="font-bold text-primary">{d.name}</span>
                <span className="text-[10px] font-mono text-on-surface-variant">{d.fileName}</span>
              </div>
            ))}
          </div>
        </ApplicationReviewSection>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface-container-lowest border-t border-outline-variant z-40 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/applications/${applicationId}/documents`)}
            type="button"
            className="min-h-[44px] px-4 py-2 border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Previous
          </button>
          <button
            onClick={() => navigate(`/applications/${applicationId}/declaration`)}
            disabled={!canContinue}
            type="button"
            className="min-h-[48px] px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl disabled:opacity-40 hover:bg-primary-container inline-flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span>Continue to Declaration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
