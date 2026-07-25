import React from 'react';
import { CheckCircle2, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SuggestedSchemeCard({ scheme }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl hover:shadow-lg transition-all flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${scheme.categoryColor || 'bg-primary-container text-on-primary-container'}`}>
          {scheme.category}
        </span>
        <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {scheme.matchPercentage}% Match
        </span>
      </div>

      <h3 className="font-bold text-base text-primary">{scheme.title}</h3>
      <p className="text-on-surface-variant text-xs leading-relaxed">{scheme.description}</p>

      {/* Disclaimer */}
      <div className="flex items-start gap-1.5 p-2 bg-amber-50 rounded-lg text-amber-900 text-[11px] border border-amber-200">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
        <span>{scheme.disclaimer || 'Final eligibility decision rests with the concerned department.'}</span>
      </div>

      <div className="mt-auto pt-1 flex gap-2">
        <button
          onClick={() => navigate(scheme.eligibilityUrl || '/schemes')}
          className="flex-1 bg-primary text-on-primary font-semibold text-xs py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all"
        >
          Check Eligibility
        </button>
        <button
          onClick={() => navigate(scheme.eligibilityUrl || '/schemes')}
          className="px-3 border border-outline text-primary rounded-lg hover:bg-surface-container-low transition-colors"
          title="View Details"
          aria-label={`View details for ${scheme.title}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
