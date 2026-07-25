import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, FileCheck, RefreshCw } from 'lucide-react';
import {
  SchemeDetailsHeader,
  SchemeBenefitList,
  EligibilityConditionList,
  RequiredDocumentsPreview
} from '../../components/schemes/SchemeDetailComponents';
import { EligibilityResumeBanner } from '../../components/schemes/EligibilityQuestionnaireComponents';
import { SchemeDetailsSkeleton } from '../../components/schemes/EligibilityResultComponents';
import { useSchemeDetails } from '../../hooks/useSchemeQuery';
import { useSchemeEligibilityUiStore } from '../../stores/schemeEligibilityUiStore';

export default function SchemeDetailsPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useSchemeDetails(schemeId);

  const { draftsMap, clearSchemeDraft } = useSchemeEligibilityUiStore();
  const existingDraft = draftsMap[schemeId];

  if (isLoading) {
    return (
      <div className="p-6">
        <SchemeDetailsSkeleton />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md mx-auto my-12">
        <p className="text-sm text-error font-semibold mb-4">Scheme not found or error loading details.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="min-h-[44px] px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
          <button
            onClick={() => navigate('/schemes')}
            className="min-h-[44px] px-4 py-2 border border-outline text-primary font-bold text-xs rounded-xl"
          >
            Back to Schemes
          </button>
        </div>
      </div>
    );
  }

  const scheme = data.data;

  const handleResume = () => {
    navigate(`/schemes/${schemeId}/eligibility/questions`);
  };

  const handleStartAgain = () => {
    if (window.confirm('Restart eligibility check? Your previous draft answers for this scheme will be cleared.')) {
      clearSchemeDraft(schemeId);
      navigate(`/schemes/${schemeId}/eligibility`);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans">
      <main className="max-w-4xl mx-auto px-4 pt-4">
        {/* Resume Banner if draft exists */}
        {existingDraft && existingDraft.answers && Object.keys(existingDraft.answers).length > 0 && (
          <EligibilityResumeBanner onResume={handleResume} onRestart={handleStartAgain} />
        )}

        <SchemeDetailsHeader scheme={scheme} />
        <SchemeBenefitList benefits={scheme.benefits} summary={scheme.benefitSummary} />
        <EligibilityConditionList
          rules={scheme.eligibilityRules}
          onCheckFull={() => navigate(`/schemes/${schemeId}/eligibility`)}
        />
        <RequiredDocumentsPreview documents={scheme.requiredDocuments} />

        {/* Legal Disclaimer */}
        <div className="p-4 bg-primary-container/10 border border-primary-container/20 rounded-2xl text-primary text-xs flex items-start gap-2.5 mb-8">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            This scheme overview is provided for information purposes. Final eligibility decision rests with the concerned government department.
          </p>
        </div>
      </main>

      {/* Mobile & Desktop Sticky Action Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface-container-lowest border-t border-outline-variant z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-xs font-bold text-primary block">{scheme.name}</span>
            <span className="text-[11px] text-on-surface-variant">Application Status: {scheme.applicationStatus}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/schemes/${schemeId}/documents`)}
              type="button"
              className="flex-1 sm:flex-none min-h-[48px] px-4 py-2.5 border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Documents</span>
            </button>
            <button
              onClick={() => navigate(`/schemes/${schemeId}/eligibility`)}
              type="button"
              className="flex-1 sm:flex-none min-h-[48px] px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
