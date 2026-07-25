import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileCheck, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSchemeDetails } from '../../hooks/useSchemeQuery';
import { SchemeDetailsSkeleton } from '../../components/schemes/EligibilityResultComponents';

export function SchemeDocumentsPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSchemeDetails(schemeId);

  if (isLoading) {
    return (
      <div className="p-6">
        <SchemeDetailsSkeleton />
      </div>
    );
  }

  const scheme = data?.data || { name: 'Scheme', requiredDocuments: [] };

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
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Document Checklist</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm mb-6">
          <h1 className="text-xl font-bold text-primary mb-1">{scheme.name}</h1>
          <p className="text-xs text-on-surface-variant mb-6">Review the required documents for your application.</p>

          <div className="space-y-3">
            {scheme.requiredDocuments?.map((doc, idx) => {
              const isLocker = doc.status.includes('Locker');
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-on-surface">{doc.name}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isLocker ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
                    {doc.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => navigate('/documents')}
          type="button"
          className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
        >
          <span>Open Digital Locker</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </main>
    </div>
  );
}

export function SchemeApplicationHandoffPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const { data } = useSchemeDetails(schemeId);

  const schemeName = data?.data?.name || 'Government Scheme';

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6">
      <main className="max-w-md mx-auto text-center py-8">
        <div className="w-16 h-16 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">Phase 6 Ready Handoff</span>
        <h1 className="text-2xl font-bold text-primary mb-2">Apply for {schemeName}</h1>
        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
          Your profile data and eligibility assessment results have been pre-filled. Complete application submission workflow will be enabled in Phase 6.
        </p>

        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl mb-6 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">Scheme:</span>
            <span className="font-bold text-primary">{schemeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">Eligibility Assessment:</span>
            <span className="font-bold text-emerald-700">Verified</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">Locker Documents:</span>
            <span className="font-bold text-primary">2 Ready</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/schemes')}
          type="button"
          className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
        >
          <span>Return to Scheme Discovery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>
    </div>
  );
}
