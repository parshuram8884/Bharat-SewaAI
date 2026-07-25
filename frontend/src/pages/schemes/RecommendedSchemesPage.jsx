import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, User, ShieldAlert } from 'lucide-react';
import SchemeCard from '../../components/schemes/SchemeCard';
import { SchemeListSkeleton } from '../../components/schemes/EligibilityResultComponents';
import { useRecommendedSchemes } from '../../hooks/useSchemeQuery';

export default function RecommendedSchemesPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useRecommendedSchemes();

  const profileSummary = data?.profileSummary;
  const recommendedList = data?.data || [];

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans">
      <header className="bg-surface border-b border-outline-variant p-4 md:p-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/schemes')}
              type="button"
              aria-label="Back to scheme discovery"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
                <span>Recommended for You</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h1>
              <p className="text-xs md:text-sm text-on-surface-variant">Suggestions based on your saved profile.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile/edit')}
            type="button"
            className="min-h-[44px] px-3.5 py-1.5 border border-outline text-primary rounded-full text-xs font-semibold hover:bg-surface-container-low flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>Update Profile</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* Profile match summary */}
        {profileSummary && (
          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl mb-6 shadow-sm">
            <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Matched Profile Factors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-2 bg-surface-container-low rounded-lg">
                <span className="text-on-surface-variant text-[10px] block font-bold">Occupation</span>
                <span className="font-semibold text-primary">{profileSummary.occupation}</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg">
                <span className="text-on-surface-variant text-[10px] block font-bold">State</span>
                <span className="font-semibold text-primary">{profileSummary.state}</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg">
                <span className="text-on-surface-variant text-[10px] block font-bold">District</span>
                <span className="font-semibold text-primary">{profileSummary.district}</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg">
                <span className="text-on-surface-variant text-[10px] block font-bold">Income Range</span>
                <span className="font-semibold text-primary">{profileSummary.annualIncome}</span>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2 mb-6">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
          <span>These recommendations are based on your profile details. Final eligibility decision rests with the concerned department.</span>
        </div>

        {isLoading ? (
          <SchemeListSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {recommendedList.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
