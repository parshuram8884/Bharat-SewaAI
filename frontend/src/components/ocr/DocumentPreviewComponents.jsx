import React from 'react';
import { RotateCw, ZoomIn, ZoomOut, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';

export function DocumentPreviewToolbar({ zoom, rotation, onRotate, onZoomIn, onZoomOut, onReplace }) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 bg-surface-container rounded-2xl mb-4">
      <div className="flex items-center gap-1">
        <button
          onClick={onRotate}
          type="button"
          aria-label="Rotate document 90 degrees"
          className="p-2 rounded-xl text-primary hover:bg-surface-container-high font-bold text-xs flex items-center gap-1"
        >
          <RotateCw className="w-4 h-4" />
          <span className="hidden sm:inline">Rotate</span>
        </button>
        <button
          onClick={onZoomIn}
          type="button"
          aria-label="Zoom in"
          className="p-2 rounded-xl text-primary hover:bg-surface-container-high"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          type="button"
          aria-label="Zoom out"
          className="p-2 rounded-xl text-primary hover:bg-surface-container-high"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onReplace}
        type="button"
        className="px-3 py-1.5 border border-outline text-primary rounded-xl text-xs font-bold hover:bg-surface-container-low"
      >
        Replace Document
      </button>
    </div>
  );
}

export function DocumentQualitySummary({ quality }) {
  if (!quality) return null;

  const isGood = quality.overallStatus === 'good';
  const isWarning = quality.overallStatus === 'warning';

  return (
    <div className={`p-6 rounded-3xl border mb-6 text-left ${isGood ? 'bg-emerald-50 border-emerald-300' : isWarning ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300'}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {isGood ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-700" />
          )}
          <h3 className="text-base font-bold text-primary">
            Quality Check: {quality.overallStatus.toUpperCase()} ({quality.score}/100)
          </h3>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {quality.checks.map((chk) => (
          <div key={chk.id} className="flex items-center justify-between text-xs">
            <span className="font-semibold text-on-surface">{chk.label}</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${chk.status === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
              {chk.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {quality.recommendations.length > 0 && (
        <div className="p-3 bg-surface-container-lowest/60 rounded-xl text-xs text-on-surface-variant space-y-1">
          <span className="font-bold block text-primary">Recommendations:</span>
          {quality.recommendations.map((rec, i) => (
            <p key={i}>• {rec}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export function ConfidenceBadge({ level = 'high', score = 94 }) {
  const CONFIG = {
    high: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    medium: 'bg-amber-100 text-amber-900 border-amber-300',
    low: 'bg-red-100 text-red-900 border-red-300'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${CONFIG[level]}`}>
      {level} Confidence ({score}%)
    </span>
  );
}

export function ExtractionFieldCard({ field, onValueChange }) {
  return (
    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl mb-3 text-left">
      <div className="flex items-center justify-between gap-2 mb-2">
        <label htmlFor={`field-${field.key}`} className="text-xs font-bold text-primary">
          {field.label} {field.required && <span className="text-red-600">*</span>}
        </label>
        <ConfidenceBadge level={field.confidenceLevel} score={field.confidence} />
      </div>

      <input
        id={`field-${field.key}`}
        type="text"
        value={field.correctedValue || ''}
        onChange={(e) => onValueChange(field.key, e.target.value)}
        className="w-full min-h-[44px] px-3 py-2 bg-surface-container rounded-xl border border-outline-variant font-semibold text-xs md:text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
      />
    </div>
  );
}

export function DocumentPrivacyNotice() {
  return (
    <div className="p-4 bg-primary-container/10 border border-primary-container/20 rounded-2xl text-primary text-xs flex items-start gap-2.5 mb-6 text-left">
      <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="leading-relaxed font-medium">
        Privacy & Security Safeguard: Document extraction operates in mock mode. Sensitive identifiers are masked, and raw file bytes are never persisted.
      </p>
    </div>
  );
}
