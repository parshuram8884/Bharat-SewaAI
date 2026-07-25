import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, XCircle, ShieldAlert, Bookmark, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EligibilityResultHero({ evaluation }) {
  const { status, score } = evaluation;

  const STATUS_MAP = {
    eligible: {
      title: 'You appear eligible',
      desc: 'Based on the information provided, you appear to meet the initial conditions.',
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      badge: 'bg-emerald-600 text-white',
      icon: CheckCircle2
    },
    'likely-eligible': {
      title: 'You may be eligible',
      desc: 'Most conditions match, but final verification is required.',
      bg: 'bg-blue-50 border-blue-300 text-blue-900',
      badge: 'bg-blue-600 text-white',
      icon: HelpCircle
    },
    'action-required': {
      title: 'More information is needed',
      desc: 'Complete the following details to improve the assessment.',
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      badge: 'bg-amber-600 text-white',
      icon: AlertCircle
    },
    'not-eligible': {
      title: 'You may not meet the current conditions',
      desc: 'Some required conditions did not match the information provided.',
      bg: 'bg-red-50 border-red-300 text-red-900',
      badge: 'bg-red-600 text-white',
      icon: XCircle
    }
  };

  const config = STATUS_MAP[status] || STATUS_MAP.eligible;
  const IconComponent = config.icon;

  return (
    <div className={`border p-6 md:p-8 rounded-3xl text-center mb-6 shadow-sm ${config.bg}`} aria-live="polite">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md ${config.badge}`}>
        <IconComponent className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{config.title}</h1>
      <p className="text-xs md:text-sm mb-4 max-w-md mx-auto leading-relaxed">{config.desc}</p>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-current text-xs font-bold shadow-inner">
        <span>Evaluation Score: {score}%</span>
      </div>
    </div>
  );
}

export function EligibilityBreakdown({ matched = [], unmet = [], missing = [], recommendations = [] }) {
  return (
    <div className="space-y-4 mb-6">
      {matched.length > 0 && (
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">
          <h2 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Conditions Matched ({matched.length})</span>
          </h2>
          <ul className="space-y-2">
            {matched.map((r, i) => (
              <li key={i} className="text-xs text-on-surface p-2 bg-emerald-50/60 rounded-lg border border-emerald-200">
                <strong>{r.title}</strong> — {r.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {unmet.length > 0 && (
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">
          <h2 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>Conditions Not Matched ({unmet.length})</span>
          </h2>
          <ul className="space-y-2">
            {unmet.map((r, i) => (
              <li key={i} className="text-xs text-on-surface p-2 bg-red-50/60 rounded-lg border border-red-200">
                <strong>{r.title}</strong> — {r.failureMessage || r.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {missing.length > 0 && (
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">
          <h2 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Information Required ({missing.length})</span>
          </h2>
          <ul className="space-y-2">
            {missing.map((r, i) => (
              <li key={i} className="text-xs text-on-surface p-2 bg-amber-50/60 rounded-lg border border-amber-200">
                <strong>{r.title}</strong> — {r.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
          <h2 className="text-sm font-bold text-primary mb-2">Recommended Next Steps</h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-on-surface-variant">
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function EligibilityDisclaimer({ disclaimer }) {
  return (
    <div className="p-4 bg-primary-container/10 border border-primary-container/20 rounded-2xl text-primary text-xs flex items-start gap-2.5 mb-6">
      <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="leading-relaxed font-medium">
        {disclaimer || 'This is a preliminary assessment. Final eligibility and approval are determined by the concerned government department.'}
      </p>
    </div>
  );
}

export function SavedSchemeEmptyState() {
  const navigate = useNavigate();

  return (
    <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-3xl my-8 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
        <Bookmark className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-primary mb-2">No saved schemes yet</h2>
      <p className="text-xs text-on-surface-variant mb-6">
        Save schemes while browsing to quickly review them later.
      </p>
      <button
        onClick={() => navigate('/schemes')}
        type="button"
        className="min-h-[48px] px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container active:scale-95 transition-all inline-flex items-center gap-2"
      >
        <span>Explore Schemes</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function SchemeListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-56 bg-surface-container-low rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

export function SchemeDetailsSkeleton() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="h-48 bg-surface-container-low rounded-2xl animate-pulse" />
      <div className="h-32 bg-surface-container-low rounded-2xl animate-pulse" />
      <div className="h-40 bg-surface-container-low rounded-2xl animate-pulse" />
    </div>
  );
}

export function EligibilityResultSkeleton() {
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="h-48 bg-surface-container-low rounded-3xl animate-pulse" />
      <div className="h-64 bg-surface-container-low rounded-2xl animate-pulse" />
    </div>
  );
}
