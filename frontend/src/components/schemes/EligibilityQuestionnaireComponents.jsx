import React from 'react';
import { Clock, ShieldAlert, User, Edit3, ArrowRight, ArrowLeft, RefreshCw, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EligibilityIntroCard({ scheme, onStart }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-3xl shadow-sm text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-primary mb-2">Check Scheme Eligibility</h1>
      <p className="text-sm text-on-surface-variant mb-6">
        Answer a few simple questions to receive an instant preliminary eligibility assessment for <strong>{scheme.name}</strong>.
      </p>

      <div className="grid grid-cols-2 gap-3 p-4 bg-surface-container-low rounded-2xl mb-6 text-left">
        <div>
          <span className="text-[11px] font-bold uppercase text-on-surface-variant tracking-wider block">Est. Time</span>
          <span className="text-sm font-semibold text-primary">~2 Minutes</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase text-on-surface-variant tracking-wider block">Questions</span>
          <span className="text-sm font-semibold text-primary">4 Steps</span>
        </div>
      </div>

      <div className="flex items-start gap-2 text-left p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs mb-6">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-blue-700" />
        <span>Your answers are used solely for this preliminary assessment. Final approval rests with the department.</span>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onStart}
          type="button"
          className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <span>Start Eligibility Check</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('/profile/edit')}
          type="button"
          className="w-full min-h-[44px] border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low transition-colors"
        >
          Review My Profile
        </button>
      </div>
    </div>
  );
}

export function EligibilityProfileSummary({ profile }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 md:p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-primary">Pre-Filled Profile Summary</h2>
        </div>
        <button
          onClick={() => navigate('/profile/edit')}
          type="button"
          className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 min-h-[44px] px-2"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-surface-container-low rounded-xl">
          <span className="text-on-surface-variant text-[10px] uppercase font-bold block">State</span>
          <span className="font-semibold text-on-surface">{profile.state}</span>
        </div>
        <div className="p-2.5 bg-surface-container-low rounded-xl">
          <span className="text-on-surface-variant text-[10px] uppercase font-bold block">Occupation</span>
          <span className="font-semibold text-on-surface">{profile.occupation}</span>
        </div>
        <div className="p-2.5 bg-surface-container-low rounded-xl">
          <span className="text-on-surface-variant text-[10px] uppercase font-bold block">Landholding</span>
          <span className="font-semibold text-on-surface">{profile.landholdingHectares} Ha</span>
        </div>
        <div className="p-2.5 bg-surface-container-low rounded-xl">
          <span className="text-on-surface-variant text-[10px] uppercase font-bold block">Aadhaar DBT</span>
          <span className="font-semibold text-on-surface">{profile.bankAadhaarLinked ? 'Linked' : 'Not Linked'}</span>
        </div>
      </div>
    </div>
  );
}

export function EligibilityProgress({ currentStep, totalSteps }) {
  const percentage = Math.round(((currentStep + 1) / (totalSteps || 1)) * 100);

  return (
    <div className="w-full max-w-xl mx-auto mb-6" aria-label={`Questionnaire progress: step ${currentStep + 1} of ${totalSteps}`}>
      <div className="flex justify-between items-center text-xs font-bold text-primary mb-2">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{percentage}% Complete</span>
      </div>
      <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="h-full bg-secondary transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function EligibilityOption({ selected, label, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-full min-h-[48px] p-4 rounded-2xl border text-left flex items-center justify-between font-semibold text-sm transition-all ${
        selected
          ? 'bg-secondary-container/10 border-secondary text-secondary shadow-sm ring-1 ring-secondary'
          : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low text-on-surface'
      }`}
      aria-pressed={selected}
    >
      <span>{label}</span>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'bg-secondary border-secondary text-white' : 'border-outline'}`}>
        {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </button>
  );
}

export function EligibilityQuestionCard({ question, answerValue, onChangeAnswer }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-primary mb-2">{question.question}</h2>
      {question.helperText && <p className="text-xs text-on-surface-variant mb-6">{question.helperText}</p>}

      <div className="space-y-3">
        {question.type === 'yesno' && (
          <>
            <EligibilityOption selected={answerValue === true} label="Yes" onClick={() => onChangeAnswer(true)} />
            <EligibilityOption selected={answerValue === false} label="No" onClick={() => onChangeAnswer(false)} />
          </>
        )}

        {question.type === 'single-select' &&
          question.options?.map((opt) => (
            <EligibilityOption
              key={opt.value}
              selected={answerValue === opt.value}
              label={opt.label}
              onClick={() => onChangeAnswer(opt.value)}
            />
          ))}

        {question.type === 'numeric' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface">Enter value:</label>
            <input
              type="number"
              value={answerValue !== undefined ? answerValue : ''}
              onChange={(e) => onChangeAnswer(Number(e.target.value))}
              className="w-full min-h-[48px] p-3 rounded-xl border border-outline-variant bg-surface-container focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
            />
          </div>
        )}

        {question.type === 'profile-confirm' && (
          <>
            <EligibilityOption selected={answerValue === true} label="Yes, information is correct" onClick={() => onChangeAnswer(true)} />
            <EligibilityOption selected={answerValue === false} label="No, I need to update my details" onClick={() => onChangeAnswer(false)} />
          </>
        )}
      </div>
    </div>
  );
}

export function EligibilityNavigation({ onPrev, onNext, canPrev, canNext, isLastStep }) {
  return (
    <div className="flex items-center justify-between gap-3 max-w-xl mx-auto mt-6">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        type="button"
        className="min-h-[44px] px-4 py-2 border border-outline text-primary font-semibold text-xs rounded-xl disabled:opacity-40 hover:bg-surface-container-low flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>

      <button
        onClick={onNext}
        disabled={!canNext}
        type="button"
        className="min-h-[48px] px-6 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl disabled:opacity-40 hover:bg-primary-container flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
      >
        <span>{isLastStep ? 'Complete Evaluation' : 'Continue'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function EligibilityResumeBanner({ onResume, onRestart }) {
  return (
    <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <RefreshCw className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-amber-900">Incomplete Check Found</h3>
          <p className="text-[11px] text-amber-800">You have saved progress for this scheme.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onResume}
          type="button"
          className="min-h-[38px] px-3 py-1.5 bg-amber-700 text-white font-bold text-xs rounded-lg hover:bg-amber-800"
        >
          Resume
        </button>
        <button
          onClick={onRestart}
          type="button"
          className="min-h-[38px] px-3 py-1.5 border border-amber-400 text-amber-900 font-semibold text-xs rounded-lg hover:bg-amber-100"
        >
          Start Again
        </button>
      </div>
    </div>
  );
}
