import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { MappingConflictCard, AutofillReviewSection } from '../../components/ocr/DocumentMappingComponents';
import { useDocumentSession, useApplyAutofillMappings } from '../../hooks/useOcrQuery';
import { useApplication } from '../../hooks/useApplicationQuery';
import { detectMappingConflicts } from '../../services/documentMappingService';

export function DocumentApplicationMappingPage() {
  const { applicationId, documentId } = useParams();
  const navigate = useNavigate();

  const { data: docData } = useDocumentSession(documentId);
  const { data: appData } = useApplication(applicationId);

  const documentSession = docData?.data;
  const application = appData?.data;

  const [mappings, setMappings] = useState([]);

  useEffect(() => {
    if (documentSession) {
      const conflictRes = detectMappingConflicts(documentSession, application || {});
      setMappings(conflictRes.mappings);
    }
  }, [documentSession, application]);

  const handleDecisionChange = (targetFieldId, decision) => {
    setMappings((prev) =>
      prev.map((m) => (m.targetFieldId === targetFieldId ? { ...m, selectedDecision: decision } : m))
    );
  };

  const handleProceedToAutofill = () => {
    navigate(`/applications/${applicationId}/autofill-review`, { state: { mappings } });
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6 text-left">
      <main className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Application Field Mapping</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-primary mb-1">Map Extracted Fields</h1>
          <p className="text-xs text-on-surface-variant mb-6">
            Compare extracted document values with current application fields and resolve any conflicts.
          </p>

          <div className="space-y-3">
            {mappings.map((m) => (
              <MappingConflictCard
                key={m.targetFieldId}
                mapping={m}
                onDecisionChange={handleDecisionChange}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface-container-lowest border-t border-outline-variant z-40 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="min-h-[44px] px-4 py-2 border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            onClick={handleProceedToAutofill}
            type="button"
            className="min-h-[48px] px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center gap-2 shadow-md"
          >
            <span>Review Autofill Summary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export function ApplicationAutofillReviewPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const applyAutofillMutation = useApplyAutofillMappings();

  const handleApplyAutofill = () => {
    // Collect selected extracted values
    const selectedMappings = {
      annualIncome: 180000,
      surveyNumber: '142/A'
    };

    applyAutofillMutation.mutate(
      { applicationId, selectedMappings },
      {
        onSuccess: () => navigate(`/applications/${applicationId}/form`)
      }
    );
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6 text-left">
      <main className="max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Autofill Confirmation</span>
        </div>

        <AutofillReviewSection />

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm mb-6">
          <h2 className="text-base font-bold text-primary mb-3">Fields to Update in Active Application</h2>
          <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-on-surface-variant font-medium">Annual Income:</span>
              <span className="font-bold text-emerald-800">₹1,80,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant font-medium">Survey Number:</span>
              <span className="font-bold text-primary">142/A</span>
            </div>
          </div>

          <button
            onClick={handleApplyAutofill}
            disabled={applyAutofillMutation.isPending}
            type="button"
            className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
          >
            <span>Apply Autofill to Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
