import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EligibilityIntroCard, EligibilityProfileSummary } from '../../components/schemes/EligibilityQuestionnaireComponents';
import { SchemeDetailsSkeleton } from '../../components/schemes/EligibilityResultComponents';
import { useSchemeDetails } from '../../hooks/useSchemeQuery';
import { MOCK_CITIZEN_PROFILE } from '../../data/mockSchemesData';
import { useSchemeEligibilityUiStore } from '../../stores/schemeEligibilityUiStore';

export default function EligibilityIntroPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSchemeDetails(schemeId);
  const { initSession } = useSchemeEligibilityUiStore();

  if (isLoading) {
    return (
      <div className="p-6">
        <SchemeDetailsSkeleton />
      </div>
    );
  }

  const scheme = data?.data || { name: 'Government Scheme' };

  const handleStart = () => {
    initSession(schemeId);
    navigate(`/schemes/${schemeId}/eligibility/questions`);
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6">
      <main className="max-w-2xl mx-auto space-y-6">
        <EligibilityProfileSummary profile={MOCK_CITIZEN_PROFILE} />
        <EligibilityIntroCard scheme={scheme} onStart={handleStart} />
      </main>
    </div>
  );
}
