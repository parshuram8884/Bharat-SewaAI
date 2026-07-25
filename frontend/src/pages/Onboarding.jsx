import React, { useState } from 'react';
import Button from '../components/common/Button';
import { Languages, User, Check } from 'lucide-react';

export function Onboarding() {
  const [selectedLang, setSelectedLang] = useState('hi');
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [step, setStep] = useState(1);

  const languages = [
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'en', name: 'English' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      alert('Profile created successfully! Navigating to assistant.');
      window.location.href = '/';
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] bg-neutral-950 px-6 py-12 text-neutral-100">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-8 shadow-2xl">
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
          <span className={`w-8 h-0.5 ${step >= 2 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Languages className="w-6 h-6" />
                <span className="text-xs font-semibold tracking-wider uppercase">Step 1</span>
              </div>
              <h2 className="text-2xl font-bold">Select Your Language</h2>
              <p className="text-sm text-neutral-400">Choose the language you prefer for conversational voice translation.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selectedLang === lang.code
                      ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400'
                      : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <span className="text-sm font-medium">{lang.name}</span>
                  {selectedLang === lang.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <User className="w-6 h-6" />
                <span className="text-xs font-semibold tracking-wider uppercase">Step 2</span>
              </div>
              <h2 className="text-2xl font-bold">Setup Your Profile</h2>
              <p className="text-sm text-neutral-400">Enter your details to customize eligible government schemes.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-400">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-400">State of Residence</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra, Uttar Pradesh"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
          <Button
            variant="ghost"
            disabled={step === 1}
            onClick={() => setStep(1)}
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
          >
            {step === 1 ? 'Continue' : 'Finish'}
          </Button>
        </div>

      </div>
    </div>
  );
}

export default Onboarding;
