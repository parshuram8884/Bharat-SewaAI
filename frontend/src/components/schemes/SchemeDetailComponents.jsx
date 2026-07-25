import React from 'react';
import { ArrowLeft, Building2, CheckCircle2, ShieldCheck, FileCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SchemeSaveButton, SchemeShareButton, SchemeStatusBadge } from './SchemeBadgesAndButtons';
import { useSaveScheme, useUnsaveScheme } from '../../hooks/useSchemeQuery';

export function SchemeDetailsHeader({ scheme }) {
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
    <div className="bg-surface-container-lowest border-b border-outline-variant p-4 md:p-6 rounded-b-2xl shadow-sm mb-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={() => navigate('/schemes')}
          type="button"
          aria-label="Back to schemes"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <SchemeSaveButton isSaved={scheme.isSaved} onToggle={handleToggleSave} schemeName={scheme.name} />
          <SchemeShareButton title={scheme.name} text={scheme.shortDescription} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="bg-primary-container/10 text-primary-container px-3 py-1 rounded-full text-xs font-semibold">
          {scheme.category}
        </span>
        <span className="bg-surface-variant text-on-surface-variant px-2.5 py-0.5 rounded text-xs font-medium">
          {scheme.governmentLevel}
        </span>
        <SchemeStatusBadge status={scheme.applicationStatus} />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{scheme.name}</h1>
      <div className="flex items-center gap-2 text-xs md:text-sm text-on-surface-variant mb-4">
        <Building2 className="w-4 h-4 text-outline shrink-0" />
        <span>{scheme.department}</span>
      </div>

      <p className="text-sm md:text-base text-on-surface leading-relaxed">{scheme.fullDescription}</p>
    </div>
  );
}

export function SchemeBenefitList({ benefits = [], summary }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 md:p-6 rounded-2xl mb-6">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-5 h-5 text-secondary" />
        <h2 className="text-lg font-bold text-primary">Key Scheme Benefits</h2>
      </div>

      {summary && (
        <div className="p-3 bg-secondary-container/10 text-on-secondary-container rounded-xl text-xs md:text-sm font-semibold mb-4 border border-secondary-container/20">
          {summary}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {benefits.map((b, idx) => (
          <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-on-surface font-medium leading-relaxed">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EligibilityConditionList({ rules = [], onCheckFull }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 md:p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-bold text-primary">Eligibility Conditions</h2>
        <button
          onClick={onCheckFull}
          type="button"
          className="text-xs font-bold text-secondary hover:underline min-h-[44px] px-2 flex items-center"
        >
          Check Full Eligibility &rarr;
        </button>
      </div>

      <div className="space-y-3">
        {rules.map((r, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs md:text-sm font-bold text-primary">{r.title}</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">{r.description}</p>
            </div>
            <span className="self-start md:self-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              Matches Profile
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RequiredDocumentsPreview({ documents = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 md:p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-primary">Required Documents</h2>
        </div>
        <button
          onClick={() => navigate('/documents')}
          type="button"
          className="text-xs font-bold text-secondary hover:underline min-h-[44px] px-2 flex items-center gap-1"
        >
          <span>Open Digital Locker</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {documents.map((doc, idx) => {
          const isLocker = doc.status.includes('Locker');
          return (
            <div key={idx} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-between gap-2">
              <span className="text-xs md:text-sm font-semibold text-on-surface">{doc.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isLocker ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {doc.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
