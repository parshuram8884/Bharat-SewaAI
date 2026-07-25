import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ArrowRight, Clock, FileCheck, CheckCircle2 } from 'lucide-react';
import { useSchemeDetails } from '../../hooks/useSchemeQuery';
import { useCreateApplicationDraft, useDraftApplicationByScheme } from '../../hooks/useApplicationQuery';
import { ApplicationFormSkeleton } from '../../components/applications/ApplicationReviewComponents';
import { MOCK_CITIZEN_PROFILE } from '../../data/mockSchemesData';

export default function ApplicationStartPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();

  const { data: schemeData, isLoading: isSchemeLoading } = useSchemeDetails(schemeId);
  const { data: existingDraftRes } = useDraftApplicationByScheme(schemeId);
  const createDraftMutation = useCreateApplicationDraft();

  const existingDraft = existingDraftRes?.data;
  const scheme = schemeData?.data || { name: 'Government Scheme', requiredDocuments: [] };

  const handleStart = () => {
    if (existingDraft) {
      navigate(`/applications/${existingDraft.id}/form`);
      return;
    }

    createDraftMutation.mutate(
      { schemeId },
      {
        onSuccess: (res) => {
          if (res?.data?.id) {
            navigate(`/applications/${res.data.id}/form`);
          }
        }
      }
    );
  };

  if (isSchemeLoading) {
    return (
      <div className="p-6">
        <ApplicationFormSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto text-left">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(`/schemes/${schemeId}`)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Application Workflow</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-3xl shadow-sm mb-6">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 text-secondary flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-primary mb-1">Apply for {scheme.name}</h1>
          <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
            Complete the application form and attach required documents to apply.
          </p>

          <div className="space-y-3 mb-6">
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Estimated Time</span>
              <span className="font-bold text-primary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ~5 Minutes
              </span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Required Documents</span>
              <span className="font-bold text-primary flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" /> {scheme.requiredDocuments?.length || 3} Requirements
              </span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Profile Verification</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pre-Filled ({MOCK_CITIZEN_PROFILE.name})
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs mb-6 leading-relaxed">
            Privacy Note: Information provided will be used exclusively for processing your application.
          </div>

          <button
            onClick={handleStart}
            disabled={createDraftMutation.isPending}
            type="button"
            className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span>{existingDraft ? 'Continue Existing Application' : 'Start Application'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
