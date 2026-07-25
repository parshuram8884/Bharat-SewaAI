import React from 'react';
import { Check, Save, Cloud, CloudOff, Loader2 } from 'lucide-react';

const STEPS = [
  { step: 1, title: 'Profile & Form' },
  { step: 2, title: 'Documents' },
  { step: 3, title: 'Review' },
  { step: 4, title: 'Declaration & Submit' }
];

export function ApplicationStepper({ currentStep, onStepClick }) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-outline-variant -translate-y-1/2 z-0" />
        {STEPS.map((s) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <button
              key={s.step}
              onClick={() => onStepClick && isCompleted && onStepClick(s.step)}
              type="button"
              disabled={!isCompleted && !isCurrent}
              aria-label={`Step ${s.step}: ${s.title}`}
              className="relative z-10 flex flex-col items-center gap-1 group focus:outline-none"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-primary text-on-primary ring-4 ring-primary/20'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : s.step}
              </div>
              <span
                className={`text-[11px] font-bold hidden md:inline-block ${
                  isCurrent ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ApplicationProgress({ step, totalSteps = 4 }) {
  const percentage = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-4">
      <div
        className="bg-primary h-full transition-all duration-300 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function AutosaveStatus({ status = 'saved', lastSavedAt }) {
  const isSaving = status === 'saving';
  const isOffline = status === 'offline';

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-[11px] font-bold text-on-surface-variant">
      {isSaving ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
          <span>Saving...</span>
        </>
      ) : isOffline ? (
        <>
          <CloudOff className="w-3.5 h-3.5 text-amber-600" />
          <span>Offline Saved</span>
        </>
      ) : (
        <>
          <Cloud className="w-3.5 h-3.5 text-emerald-600" />
          <span>Draft Saved {lastSavedAt ? `at ${new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
        </>
      )}
    </div>
  );
}

export function SaveAndExitDialog({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl max-w-sm w-full shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <Save className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-primary mb-1">Save Draft & Exit?</h3>
        <p className="text-xs text-on-surface-variant mb-6">
          Your application progress has been saved. You can resume anytime from your dashboard.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            type="button"
            className="w-full min-h-[44px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container"
          >
            Save & Exit
          </button>
          <button
            onClick={onClose}
            type="button"
            className="w-full min-h-[44px] border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
}
