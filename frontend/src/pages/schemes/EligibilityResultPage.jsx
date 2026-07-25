import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, FileCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import {
  EligibilityResultHero,
  EligibilityBreakdown,
  EligibilityDisclaimer,
  EligibilityResultSkeleton
} from '../../components/schemes/EligibilityResultComponents';
import { useEligibilityResult } from '../../hooks/useSchemeQuery';

export default function EligibilityResultPage() {
  const { schemeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const resultId = searchParams.get('resultId');
  const { data, isLoading, isError, refetch } = useEligibilityResult(resultId);

  if (isLoading) {
    return (
      <div className="p-6">
        <EligibilityResultSkeleton />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md mx-auto my-12">
        <h2 className="text-lg font-bold text-primary mb-2">Eligibility session not found</h2>
        <p className="text-xs text-on-surface-variant mb-4">The result may have expired or you opened an invalid link.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="min-h-[44px] px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
          <button
            onClick={() => navigate(`/schemes/${schemeId}`)}
            className="min-h-[44px] px-4 py-2 border border-outline text-primary font-bold text-xs rounded-xl"
          >
            Back to Scheme
          </button>
        </div>
      </div>
    );
  }

  const record = data.data;
  const evaluation = record.evaluation;

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(`/schemes/${schemeId}`)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Evaluation Result</span>
        </div>

        <EligibilityResultHero evaluation={evaluation} />

        <EligibilityBreakdown
          matched={evaluation.matchedRules}
          unmet={evaluation.unmetRules}
          missing={evaluation.missingInformation}
          recommendations={evaluation.recommendations}
        />

        <EligibilityDisclaimer disclaimer={evaluation.disclaimer} />

        {/* Action Controls */}
        <div className="flex flex-col gap-3">
          {(evaluation.status === 'eligible' || evaluation.status === 'likely-eligible') && (
            <button
              onClick={() => navigate(`/schemes/${schemeId}/apply`)}
              type="button"
              className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Start Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => navigate(`/schemes/${schemeId}/documents`)}
            type="button"
            className="w-full min-h-[44px] border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low flex items-center justify-center gap-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>View Required Documents</span>
          </button>

          <button
            onClick={() => navigate('/schemes')}
            type="button"
            className="w-full min-h-[44px] text-on-surface-variant font-semibold text-xs hover:underline"
          >
            Browse Other Schemes
          </button>
        </div>
      </main>
    </div>
  );
}
