import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Info, ArrowRight } from 'lucide-react';
import { SchemeMatchBadge, SchemeStatusBadge, SchemeSaveButton } from './SchemeBadgesAndButtons';
import { useSaveScheme, useUnsaveScheme } from '../../hooks/useSchemeQuery';

export default function SchemeCard({ scheme }) {
  const navigate = useNavigate();
  const saveMutation = useSaveScheme();
  const unsaveMutation = useUnsaveScheme();

  const handleToggleSave = () => {
    if (scheme.isSaved) {
      unsaveMutation.mutate(scheme.id);
    } else {
      saveMutation.mutate(scheme.id);
    }
  };

  return (
    <article
      onClick={() => navigate(`/schemes/${scheme.id}`)}
      className="bg-surface-container-lowest border border-outline-variant p-4 md:p-5 rounded-2xl hover:shadow-lg transition-all flex flex-col gap-3 group cursor-pointer"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-primary-container/10 text-primary-container px-2.5 py-0.5 rounded text-xs font-semibold">
            {scheme.category}
          </span>
          <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded text-[11px] font-medium">
            {scheme.governmentLevel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <SchemeMatchBadge score={scheme.matchScore} />
          <SchemeSaveButton isSaved={scheme.isSaved} onToggle={handleToggleSave} schemeName={scheme.name} />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-base md:text-lg text-primary group-hover:text-secondary transition-colors">
          {scheme.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-1">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-outline" />
          <span className="truncate">{scheme.department}</span>
        </div>
      </div>

      <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed line-clamp-2">
        {scheme.shortDescription}
      </p>

      {scheme.recommendationReasons && scheme.recommendationReasons.length > 0 && (
        <div className="flex items-start gap-1.5 p-2 bg-surface-container-low rounded-lg text-xs text-on-surface">
          <Info className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
          <span className="line-clamp-1">{scheme.recommendationReasons[0]}</span>
        </div>
      )}

      <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-outline-variant/40">
        <SchemeStatusBadge status={scheme.applicationStatus} />
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/schemes/${scheme.id}/eligibility`);
            }}
            type="button"
            className="min-h-[44px] px-3 py-2 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:bg-primary-container active:scale-95 transition-all"
          >
            Check Eligibility
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/schemes/${scheme.id}`);
            }}
            type="button"
            aria-label={`View details for ${scheme.name}`}
            className="min-h-[44px] px-3 py-2 border border-outline text-primary font-semibold text-xs rounded-lg hover:bg-surface-container-low transition-colors flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
