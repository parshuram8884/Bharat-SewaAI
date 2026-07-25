import React from 'react';

export default function AccessibilityPreferencePanel({ preferences, onChange }) {
  const toggle = (key) => {
    onChange({ ...preferences, [key]: !preferences[key] });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Accessibility Preferences</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900">High Contrast</h3>
            <p className="text-sm text-slate-500">Increase contrast between text and background</p>
          </div>
          <button 
            role="switch" 
            aria-checked={preferences.highContrast}
            onClick={() => toggle('highContrast')}
            className={`w-11 h-6 rounded-full transition-colors relative ${preferences.highContrast ? 'bg-blue-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.highContrast ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900">Reduced Motion</h3>
            <p className="text-sm text-slate-500">Disable non-essential animations and transitions</p>
          </div>
          <button 
            role="switch" 
            aria-checked={preferences.reducedMotion}
            onClick={() => toggle('reducedMotion')}
            className={`w-11 h-6 rounded-full transition-colors relative ${preferences.reducedMotion ? 'bg-blue-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.reducedMotion ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        <div>
          <h3 className="font-medium text-slate-900 mb-2">Text Scaling</h3>
          <div className="flex gap-3">
            {[90, 100, 110, 125].map(scale => (
              <button
                key={scale}
                onClick={() => onChange({ ...preferences, fontScale: scale })}
                className={`px-4 py-2 rounded-lg border font-medium ${preferences.fontScale === scale ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              >
                {scale}%
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
