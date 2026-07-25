import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export function MappingConflictCard({ mapping, onDecisionChange }) {
  const isUseExtracted = mapping.selectedDecision === 'use-extracted';

  return (
    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl mb-4 text-left">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="text-xs font-bold text-primary">{mapping.targetLabel}</h4>
        {mapping.hasConflict && (
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Conflict Detected
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-xl text-xs mb-4">
        <div>
          <span className="text-[10px] text-on-surface-variant block">Extracted from Document</span>
          <span className="font-bold text-emerald-800">{String(mapping.extractedValue)}</span>
        </div>
        <div>
          <span className="text-[10px] text-on-surface-variant block">Current Application Value</span>
          <span className="font-bold text-primary">{String(mapping.currentAppValue)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onDecisionChange(mapping.targetFieldId, 'use-extracted')}
          type="button"
          className={`flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            isUseExtracted
              ? 'bg-primary text-on-primary ring-2 ring-primary/20'
              : 'bg-surface-container border border-outline-variant text-on-surface'
          }`}
        >
          Use Extracted Value
        </button>
        <button
          onClick={() => onDecisionChange(mapping.targetFieldId, 'keep-existing')}
          type="button"
          className={`flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            !isUseExtracted
              ? 'bg-primary text-on-primary ring-2 ring-primary/20'
              : 'bg-surface-container border border-outline-variant text-on-surface'
          }`}
        >
          Keep Existing Value
        </button>
      </div>
    </div>
  );
}

export function AutofillReviewSection({ mappings, onApplyAll }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm mb-6 text-left">
      <h3 className="text-base font-bold text-primary mb-2">Autofill Summary</h3>
      <p className="text-xs text-on-surface-variant mb-4">
        Review all extracted value mappings before applying them to your active application.
      </p>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] mb-6 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
        <span>Autofill applies changes exclusively to your active application. Your global profile remains unchanged.</span>
      </div>
    </div>
  );
}
