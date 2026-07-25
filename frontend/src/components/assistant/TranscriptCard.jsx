import React from 'react';
import { Activity, CheckCircle, ArrowRight, Mic, Edit3 } from 'lucide-react';

export default function TranscriptCard({ transcript, translation, onConfirm, onSpeakAgain, onEdit }) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
      <div className="text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/20 text-secondary font-semibold text-xs mb-3">
          <CheckCircle className="w-4 h-4 mr-1" />
          Step 2 of 4: Confirm Intent
        </span>
        <h2 className="text-2xl font-bold text-primary mb-1">Did I get that right?</h2>
        <p className="text-on-surface-variant text-sm">Your request was processed using AI for maximum accuracy.</p>
      </div>

      <div className="relative bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">I heard:</p>
            <Activity className="w-5 h-5 text-tertiary-container animate-pulse" />
          </div>
          <div className="py-2">
            <p className="text-xl font-semibold text-primary leading-relaxed">
              "{transcript}"
            </p>
            {translation && (
              <p className="text-on-surface-variant text-sm italic mt-2">
                "{translation}"
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onConfirm}
          className="w-full bg-[#ff8031] hover:bg-[#e06d20] text-white h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          Yes, Continue
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSpeakAgain}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors active:opacity-70"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-primary">Speak Again</span>
          </button>
          <button
            onClick={onEdit}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors active:opacity-70"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary">
              <Edit3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-primary">Edit Text</span>
          </button>
        </div>
      </div>
    </div>
  );
}
